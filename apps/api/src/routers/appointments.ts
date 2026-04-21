import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { UserRole, type AppointmentStatus } from '../generated/prisma-client';
import { router, protectedProcedure, staffProcedure } from '../trpc/trpc';
import type { Context } from '../trpc/context';
import { assertIntervalMatchesAvailability } from '../lib/practitionerAvailabilityMaterialize';

async function generateDemoNhsNumber(ctx: { prisma: Context['prisma'] }) {
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

async function resolvePatientIdForAppointment(ctx: Context, inputPatientId?: string) {
  const user = ctx.user;
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be signed in' });
  }

  if (user.role === UserRole.PATIENT) {
    let selfId = user.patientId;
    if (!selfId) {
      const row = await ctx.prisma.patient.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      selfId = row?.id;
    }
    if (!selfId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Patient profile is not linked to this account' });
    }
    if (inputPatientId && inputPatientId !== selfId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only book for yourself' });
    }
    return selfId;
  }

  if (inputPatientId) {
    const patient = await ctx.prisma.patient.findUnique({
      where: { id: inputPatientId },
      select: { id: true },
    });
    if (!patient) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Patient not found' });
    }

    if (user.role === UserRole.PRACTITIONER && user.practitionerId) {
      const patientRow = await ctx.prisma.patient.findUnique({
        where: { id: inputPatientId },
        select: { locationId: true },
      });
      if (!patientRow?.locationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Patient has no clinic on file; an admin must assign a location first',
        });
      }
      const allowed = await ctx.prisma.practitionerLocation.findFirst({
        where: {
          practitionerId: user.practitionerId,
          locationId: patientRow.locationId,
        },
      });
      if (!allowed) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only book patients registered at a location where you work',
        });
      }
    }

    return inputPatientId;
  }

  throw new TRPCError({ code: 'BAD_REQUEST', message: 'patientId is required' });
}

async function assertNoAppointmentConflicts(
  ctx: Context,
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
    throw new TRPCError({ code: 'CONFLICT', message: 'You already have an appointment at that time' });
  }

  if (practitionerConflict) {
    throw new TRPCError({ code: 'CONFLICT', message: 'This appointment time is no longer available' });
  }
}

async function getAppointmentOrThrow(ctx: Context, id: string) {
  const row = await ctx.prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: { select: { id: true, userId: true, locationId: true } },
      slot: { select: { locationId: true } },
    },
  });
  if (!row) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Appointment not found' });
  }
  return row;
}

function assertCanReadAppointment(
  user: NonNullable<Context['user']>,
  row: { patientId: string; practitionerId: string; patient: { userId: string; locationId: string | null } }
) {
  if (user.role === UserRole.ADMIN) return;

  if (user.role === UserRole.PATIENT) {
    if (user.patientId !== row.patientId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this appointment' });
    }
    return;
  }

  if (user.role === UserRole.PRACTITIONER) {
    if (user.practitionerId === row.practitionerId) return;
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this appointment' });
  }

  throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this appointment' });
}

function resolveAppointmentLocationIds(input: { locationId?: string; locationIds?: string[] }): string[] | undefined {
  if (input.locationIds?.length) return input.locationIds;
  if (input.locationId) return [input.locationId];
  return undefined;
}

function buildListWhere(
  user: NonNullable<Context['user']>,
  input: {
    patientId?: string;
    practitionerId?: string;
    status?: AppointmentStatus;
    from?: Date;
    to?: Date;
    locationId?: string;
    locationIds?: string[];
  }
): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  if (user.role === UserRole.PATIENT) {
    if (!user.patientId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Patient profile is not linked' });
    }
    where.patientId = user.patientId;
    if (input.practitionerId) {
      where.practitionerId = input.practitionerId;
    }
  } else if (user.role === UserRole.PRACTITIONER) {
    if (!user.practitionerId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Practitioner profile is not linked' });
    }
    where.practitionerId = user.practitionerId;
    if (input.patientId) {
      where.patientId = input.patientId;
    }
  } else if (user.role === UserRole.ADMIN) {
    if (input.patientId) where.patientId = input.patientId;
    if (input.practitionerId) where.practitionerId = input.practitionerId;
  }

  if (input.status) {
    where.status = input.status;
  }

  const slotFilter: Record<string, unknown> = {};
  if (input.from || input.to) {
    slotFilter.startAt = {
      ...(input.from && { gte: input.from }),
      ...(input.to && { lte: input.to }),
    };
  }
  const locIds = resolveAppointmentLocationIds(input);
  if (locIds?.length === 1) {
    slotFilter.locationId = locIds[0];
  } else if (locIds && locIds.length > 1) {
    slotFilter.locationId = { in: locIds };
  }
  if (Object.keys(slotFilter).length > 0) {
    where.slot = slotFilter;
  }

  return where;
}

export const appointmentsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        patientId: z.string().optional(),
        practitionerId: z.string().optional(),
        status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
        limit: z.number().min(1).max(500).default(50),
        locationId: z.string().optional(),
        locationIds: z.array(z.string()).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user!;
      const where = buildListWhere(user, input);

      const items = await ctx.prisma.appointment.findMany({
        where,
        take: input.limit,
        include: {
          patient: { include: { user: { select: { name: true, email: true, dateOfBirth: true } } } },
          practitioner: { select: { id: true, title: true, speciality: true, user: { select: { name: true } } } },
          slot: { include: { location: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return { items };
    }),

  byId: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const appointment = await ctx.prisma.appointment.findUnique({
      where: { id: input.id },
      include: {
        patient: { include: { user: { select: { name: true, email: true, phone: true, dateOfBirth: true } } } },
        practitioner: { select: { id: true, title: true, speciality: true, user: { select: { name: true } } } },
        slot: { include: { location: true } },
      },
    });
    if (!appointment) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Appointment not found' });
    }
    assertCanReadAppointment(ctx.user!, {
      patientId: appointment.patientId,
      practitionerId: appointment.practitionerId,
      patient: {
        userId: appointment.patient.userId,
        locationId: appointment.patient.locationId ?? null,
      },
    });
    return appointment;
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
      if (!slot) throw new TRPCError({ code: 'NOT_FOUND', message: 'Slot not found' });
      if (slot.appointment) throw new TRPCError({ code: 'CONFLICT', message: 'Slot already booked' });

      await assertIntervalMatchesAvailability({
        prisma: ctx.prisma,
        practitionerId: slot.practitionerId,
        locationId: slot.locationId,
        startAt: slot.startAt,
        endAt: slot.endAt,
      });

      if (ctx.user!.role === UserRole.PRACTITIONER && ctx.user!.practitionerId !== slot.practitionerId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'This slot is for a different practitioner' });
      }

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

  createFromCalendar: staffProcedure
    .input(
      z.object({
        patientId: z.string(),
        practitionerId: z.string(),
        locationId: z.string(),
        startAt: z.coerce.date(),
        endAt: z.coerce.date(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.endAt <= input.startAt) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Appointment end time must be after the start time' });
      }

      if (ctx.user!.role === UserRole.PRACTITIONER && ctx.user!.practitionerId !== input.practitionerId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only create appointments as yourself' });
      }

      const patient = await ctx.prisma.patient.findUnique({
        where: { id: input.patientId },
        select: { id: true, locationId: true },
      });
      if (!patient) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Patient not found' });
      }

      if (ctx.user!.role === UserRole.PRACTITIONER && ctx.user!.practitionerId) {
        const ok = await ctx.prisma.practitionerLocation.findFirst({
          where: {
            practitionerId: ctx.user.practitionerId,
            locationId: input.locationId,
          },
        });
        if (!ok) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not work at this location' });
        }
      }

      await assertNoAppointmentConflicts(ctx, {
        patientId: input.patientId,
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
        throw new TRPCError({ code: 'CONFLICT', message: 'This appointment time is no longer available' });
      }

      await assertIntervalMatchesAvailability({
        prisma: ctx.prisma,
        practitionerId: input.practitionerId,
        locationId: input.locationId,
        startAt: input.startAt,
        endAt: input.endAt,
      });

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
          patientId: input.patientId,
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
      const row = await getAppointmentOrThrow(ctx, input.id);
      const user = ctx.user!;

      if (user.role === UserRole.PATIENT) {
        if (user.patientId !== row.patientId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot update this appointment' });
        }
        if (input.status !== 'CANCELLED') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Patients may only cancel appointments' });
        }
      } else if (user.role === UserRole.PRACTITIONER) {
        if (user.practitionerId !== row.practitionerId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot update this appointment' });
        }
      }

      return ctx.prisma.appointment.update({
        where: { id: input.id },
        data: { status: input.status, notes: input.notes },
      });
    }),
});
