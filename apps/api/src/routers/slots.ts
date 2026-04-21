import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { UserRole } from '../generated/prisma-client';
import { router, publicProcedure, protectedProcedure, staffProcedure } from '../trpc/trpc';
import {
  assertIntervalMatchesAvailability,
  materializeSlotsForManyPractitioners,
  resolvePractitionerIdsForSlotQuery,
} from '../lib/practitionerAvailabilityMaterialize';

export const slotsRouter = router({
  available: publicProcedure
    .input(
      z.object({
        practitionerId: z.string().optional(),
        locationId: z.string().optional(),
        locationIds: z.array(z.string()).optional(),
        from: z.coerce.date(),
        to: z.coerce.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const locIds = input.locationIds?.length ? input.locationIds : input.locationId ? [input.locationId] : [];
      const locationClause =
        locIds.length > 1 ? { locationId: { in: locIds } } : locIds.length === 1 ? { locationId: locIds[0] } : {};

      const practitionerIds = await resolvePractitionerIdsForSlotQuery({
        prisma: ctx.prisma,
        practitionerId: input.practitionerId,
        locationIds: locIds.length ? locIds : undefined,
      });

      if (practitionerIds?.length) {
        await materializeSlotsForManyPractitioners({
          prisma: ctx.prisma,
          practitionerIds,
          locationIds: locIds.length ? locIds : undefined,
          from: input.from,
          to: input.to,
        });
      }

      const slots = await ctx.prisma.slot.findMany({
        where: {
          ...(input.practitionerId && { practitionerId: input.practitionerId }),
          ...locationClause,
          startAt: { lt: input.to },
          endAt: { gt: input.from },
          appointment: null,
        },
        include: {
          practitioner: { include: { user: { select: { name: true } } } },
          location: { select: { id: true, name: true, address: true } },
        },
        orderBy: { startAt: 'asc' },
      });
      return slots;
    }),

  create: staffProcedure
    .input(
      z.object({
        practitionerId: z.string(),
        locationId: z.string(),
        startAt: z.coerce.date(),
        endAt: z.coerce.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user!;
      await assertIntervalMatchesAvailability({
        prisma: ctx.prisma,
        practitionerId: input.practitionerId,
        locationId: input.locationId,
        startAt: input.startAt,
        endAt: input.endAt,
      });

      if (user.role === UserRole.PRACTITIONER) {
        if (user.practitionerId !== input.practitionerId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only create slots for yourself' });
        }
        const ok = await ctx.prisma.practitionerLocation.findFirst({
          where: { practitionerId: user.practitionerId!, locationId: input.locationId },
        });
        if (!ok) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not work at this location' });
        }
      }

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
