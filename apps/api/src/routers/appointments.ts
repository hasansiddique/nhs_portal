import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc/trpc';

export const appointmentsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        patientId: z.string().optional(),
        practitionerId: z.string().optional(),
        status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
        from: z.date().optional(),
        to: z.date().optional(),
        limit: z.number().min(1).max(100).default(50),
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
        patientId: z.string(),
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
      return ctx.prisma.appointment.create({
        data: {
          patientId: input.patientId,
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
