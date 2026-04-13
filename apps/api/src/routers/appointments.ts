import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc/trpc';

async function generateDemoNhsNumber(ctx: any) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = String(Date.now() + Math.floor(Math.random() * 1000)).slice(-10);
    const existing = await ctx.prisma.patient.findUnique({
      where: { nhsNumber: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  return String(Date.now()).padStart(10, '0').slice(-10);
}

async function resolvePatientIdForAppointment(ctx: any, patientId?: string) {
  if (patientId) {
    const patient = await ctx.prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    return patient.id;
  }

  if (!ctx.user?.id) {
    throw new Error('You must be signed in to create an appointment');
  }

  const existingPatient = await ctx.prisma.patient.findUnique({
    where: { userId: ctx.user.id },
    select: { id: true },
  });

  if (existingPatient) {
    return existingPatient.id;
  }

  const createdPatient = await ctx.prisma.patient.create({
    data: {
      userId: ctx.user.id,
      nhsNumber: await generateDemoNhsNumber(ctx),
      dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
    },
    select: { id: true },
  });

  return createdPatient.id;
}

async function assertNoAppointmentConflicts(
  ctx: any,
  input: { patientId: string; practitionerId: string; startAt: Date; endAt: Date }
) {
  const [patientConflict, practitionerConflict] = await Promise.all([
    ctx.prisma.appointment.findFirst({
      where: {
        patientId: input.patientId,
        status: { not: 'CANCELLED' },
        slot: {
          startAt: { lt: input.endAt },
          endAt: { gt: input.startAt },
        },
      },
      select: { id: true },
    }),
    ctx.prisma.appointment.findFirst({
      where: {
        practitionerId: input.practitionerId,
        status: { not: 'CANCELLED' },
        slot: {
          startAt: { lt: input.endAt },
          endAt: { gt: input.startAt },
        },
      },
      select: { id: true },
    }),
  ]);

  if (patientConflict) {
    throw new Error('You already have an appointment at that time');
  }

  if (practitionerConflict) {
    throw new Error('This appointment time is no longer available');
  }
}

export const appointmentsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        patientId: z.string().optional(),
        practitionerId: z.string().optional(),
        status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
        limit: z.number().min(1).max(500).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};
      if (input.patientId) where.patientId = input.patientId;
      if (input.practitionerId) where.practitionerId = input.practitionerId;
      if (input.status) where.status = input.status;
      if (input.from || input.to) {
        where.slot = {
          startAt: {
            ...(input.from && { gte: input.from }),
            ...(input.to && { lte: input.to }),
          },
        };
      }
      const items = await ctx.prisma.appointment.findMany({
        where,
        take: input.limit,
        include: {
          patient: { include: { user: { select: { name: true, email: true } } } },
          practitioner: { include: { user: { select: { name: true } } } },
          slot: { include: { location: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return { items };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.appointment.findUnique({
        where: { id: input.id },
        include: {
          patient: { include: { user: { select: { name: true, email: true, phone: true } } } },
          practitioner: { include: { user: { select: { name: true } } } },
          slot: { include: { location: true } },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        patientId: z.string().optional(),
        slotId: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slot = await ctx.prisma.slot.findUnique({
        where: { id: input.slotId },
        include: { appointment: true },
      });
      if (!slot) throw new Error('Slot not found');
      if (slot.appointment) throw new Error('Slot already booked');
      const patientId = await resolvePatientIdForAppointment(ctx, input.patientId);
      await assertNoAppointmentConflicts(ctx, {
        patientId,
        practitionerId: slot.practitionerId,
        startAt: slot.startAt,
        endAt: slot.endAt,
      });
      return ctx.prisma.appointment.create({
        data: {
          patientId,
          slotId: input.slotId,
          practitionerId: slot.practitionerId,
          reason: input.reason,
        },
        include: {
          slot: { include: { location: true } },
          practitioner: { include: { user: { select: { name: true } } } },
        },
      });
    }),

  createFromCalendar: protectedProcedure
    .input(
      z.object({
        patientId: z.string().optional(),
        practitionerId: z.string(),
        locationId: z.string(),
        startAt: z.coerce.date(),
        endAt: z.coerce.date(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.endAt <= input.startAt) {
        throw new Error('Appointment end time must be after the start time');
      }

      const patientId = await resolvePatientIdForAppointment(ctx, input.patientId);

      await assertNoAppointmentConflicts(ctx, {
        patientId,
        practitionerId: input.practitionerId,
        startAt: input.startAt,
        endAt: input.endAt,
      });

      const existingSlot = await ctx.prisma.slot.findFirst({
        where: {
          practitionerId: input.practitionerId,
          locationId: input.locationId,
          startAt: input.startAt,
          endAt: input.endAt,
        },
        include: { appointment: true },
      });

      if (existingSlot?.appointment) {
        throw new Error('This appointment time is no longer available');
      }

      const slot =
        existingSlot ??
        (await ctx.prisma.slot.create({
          data: {
            practitionerId: input.practitionerId,
            locationId: input.locationId,
            startAt: input.startAt,
            endAt: input.endAt,
          },
        }));

      return ctx.prisma.appointment.create({
        data: {
          patientId,
          slotId: slot.id,
          practitionerId: input.practitionerId,
          reason: input.reason,
        },
        include: {
          patient: { include: { user: { select: { name: true, email: true } } } },
          practitioner: { include: { user: { select: { name: true } } } },
          slot: { include: { location: true } },
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.appointment.update({
        where: { id: input.id },
        data: { status: input.status, notes: input.notes },
      });
    }),
});
