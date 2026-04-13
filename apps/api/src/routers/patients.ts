import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc/trpc';

export const patientsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(500).default(50),
        locationId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.patient.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          ...(input.locationId ? { locationId: input.locationId } : {}),
        },
        include: {
          user: { select: { id: true, email: true, name: true, phone: true } },
          location: { select: { id: true, name: true } },
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
      return ctx.prisma.patient.findUnique({
        where: { id: input.id },
        include: {
          user: { select: { id: true, email: true, name: true, phone: true } },
          appointments: {
            include: {
              slot: true,
              practitioner: { include: { user: { select: { name: true, email: true } } } },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        nhsNumber: z.string(),
        dateOfBirth: z.date(),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        postcode: z.string().optional(),
        gpSurgeryName: z.string().optional(),
        gpSurgeryCode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.patient.create({
        data: {
          userId: input.userId,
          nhsNumber: input.nhsNumber,
          dateOfBirth: input.dateOfBirth,
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2,
          postcode: input.postcode,
          gpSurgeryName: input.gpSurgeryName,
          gpSurgeryCode: input.gpSurgeryCode,
        },
      });
    }),
});
