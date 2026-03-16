import { z } from 'zod';
import { router, publicProcedure } from '../trpc/trpc';

export const locationsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.location.findMany({
      orderBy: { name: 'asc' },
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.location.findUnique({
        where: { id: input.id },
        include: { slots: true },
      });
    }),
});
