import { z } from 'zod';
import { router, publicProcedure } from '../trpc/trpc';

export const practitionersRouter = router({
  list: publicProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(500).default(50),
        locationId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.practitioner.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          ...(input.locationId
            ? {
                practitionerLocations: {
                  some: { locationId: input.locationId },
                },
              }
            : {}),
        },
        include: {
          user: { select: { id: true, email: true, name: true } },
          practitionerLocations: {
            ...(input.locationId ? { where: { locationId: input.locationId } } : {}),
            include: { location: { select: { id: true, name: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        const next = items.pop();
        nextCursor = next?.id;
      }
      return { items, nextCursor };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.practitioner.findUnique({
        where: { id: input.id },
        include: {
          user: { select: { id: true, email: true, name: true } },
          slots: { include: { location: true } },
        },
      });
    }),
});
