import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc/trpc';

export const slotsRouter = router({
  available: publicProcedure
    .input(
      z.object({
        practitionerId: z.string().optional(),
        locationId: z.string().optional(),
        from: z.date(),
        to: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const slots = await ctx.prisma.slot.findMany({
        where: {
          ...(input.practitionerId && { practitionerId: input.practitionerId }),
          ...(input.locationId && { locationId: input.locationId }),
          startAt: { gte: input.from },
          endAt: { lte: input.to },
          appointment: null, // only slots not yet booked
        },
        include: {
          practitioner: { include: { user: { select: { name: true } } } },
          location: { select: { id: true, name: true, address: true } },
        },
        orderBy: { startAt: 'asc' },
      });
      return slots;
    }),

  create: protectedProcedure
    .input(
      z.object({
        practitionerId: z.string(),
        locationId: z.string(),
        startAt: z.date(),
        endAt: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.slot.create({
        data: {
          practitionerId: input.practitionerId,
          locationId: input.locationId,
          startAt: input.startAt,
          endAt: input.endAt,
        },
      });
    }),
});
