import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { UserRole, type PrismaClient } from '../generated/prisma-client';
import { router, staffProcedure } from '../trpc/trpc';
import type { AuthUser } from '../trpc/context';
import {
  PRACTITIONER_SLOT_MATERIALIZATION_DAYS,
  deleteUnbookedFutureSlotsForPractitionerDayLocation,
  materializeSlotsForPractitioner,
} from '../lib/practitionerAvailabilityMaterialize';

const windowInput = z.object({
  practitionerId: z.string().optional(),
  locationId: z.string(),
  dayOfWeek: z.number().int().min(1).max(7),
  windowStartMin: z.number().int().min(0).max(24 * 60),
  windowEndMin: z.number().int().min(0).max(24 * 60),
  slotDurationMin: z.number().int().min(5).max(240).default(30),
});

function assertWindowTimes(input: z.infer<typeof windowInput>) {
  if (input.windowEndMin <= input.windowStartMin) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Availability end time must be after the start time' });
  }
  if ((input.windowEndMin - input.windowStartMin) % input.slotDurationMin !== 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'The time window length must be a multiple of the slot duration',
    });
  }
}

async function assertPractitionerWorksAtLocation(ctx: {
  prisma: PrismaClient;
  practitionerId: string;
  locationId: string;
}) {
  const ok = await ctx.prisma.practitionerLocation.findFirst({
    where: { practitionerId: ctx.practitionerId, locationId: ctx.locationId },
    select: { id: true },
  });
  if (!ok) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'That clinician is not linked to the selected clinic' });
  }
}

function resolveTargetPractitionerId(user: AuthUser, inputId?: string) {
  if (user.role === UserRole.PRACTITIONER) {
    if (!user.practitionerId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Practitioner profile is not linked to this account' });
    }
    if (inputId && inputId !== user.practitionerId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only manage your own availability' });
    }
    return user.practitionerId;
  }

  if (user.role === UserRole.ADMIN) {
    if (!inputId) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'practitionerId is required' });
    }
    return inputId;
  }

  throw new TRPCError({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
}

async function resyncFutureDaySlots(params: {
  prisma: PrismaClient;
  practitionerId: string;
  locationId: string;
  dayOfWeek: number;
}) {
  await deleteUnbookedFutureSlotsForPractitionerDayLocation({
    prisma: params.prisma,
    practitionerId: params.practitionerId,
    locationId: params.locationId,
    dayOfWeek: params.dayOfWeek,
    fromDay: new Date(),
    horizonDays: PRACTITIONER_SLOT_MATERIALIZATION_DAYS,
  });

  await materializeSlotsForPractitioner({
    prisma: params.prisma,
    practitionerId: params.practitionerId,
    locationIds: [params.locationId],
    fromDay: new Date(),
    horizonDays: PRACTITIONER_SLOT_MATERIALIZATION_DAYS,
  });
}

export const availabilityRouter = router({
  list: staffProcedure
    .input(
      z.object({
        /** When set (admin only), restrict to one clinician; omit to list everyone. */
        practitionerId: z.string().optional(),
        locationId: z.string().optional(),
        /** When set, only windows at these clinics (UI location filter). */
        locationIds: z.array(z.string()).optional(),
        /** Admin only: case-insensitive match on clinician name or email. */
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user!;

      const locationWhere =
        input.locationIds && input.locationIds.length > 0
          ? { locationId: { in: input.locationIds } }
          : input.locationId
            ? { locationId: input.locationId }
            : {};

      if (user.role === UserRole.PRACTITIONER) {
        const practitionerId = resolveTargetPractitionerId(user, input.practitionerId);
        return ctx.prisma.practitionerAvailabilityWindow.findMany({
          where: {
            practitionerId,
            ...locationWhere,
          },
          include: {
            location: { select: { id: true, name: true } },
            practitioner: { include: { user: { select: { id: true, name: true, email: true } } } },
          },
          orderBy: [{ dayOfWeek: 'asc' }, { windowStartMin: 'asc' }, { locationId: 'asc' }],
        });
      }

      if (user.role === UserRole.ADMIN) {
        const q = input.search?.trim();
        const where = {
          ...(input.practitionerId ? { practitionerId: input.practitionerId } : {}),
          ...locationWhere,
          ...(q
            ? {
                practitioner: {
                  user: {
                    OR: [
                      { name: { contains: q, mode: 'insensitive' as const } },
                      { email: { contains: q, mode: 'insensitive' as const } },
                    ],
                  },
                },
              }
            : {}),
        };

        return ctx.prisma.practitionerAvailabilityWindow.findMany({
          where,
          include: {
            location: { select: { id: true, name: true } },
            practitioner: {
              include: {
                user: { select: { id: true, name: true, email: true } },
                practitionerLocations: { include: { location: { select: { id: true, name: true } } } },
              },
            },
          },
          orderBy: [
            { practitioner: { user: { name: 'asc' } } },
            { dayOfWeek: 'asc' },
            { windowStartMin: 'asc' },
            { locationId: 'asc' },
          ],
        });
      }

      throw new TRPCError({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
    }),

  upsert: staffProcedure
    .input(
      z
        .object({
          id: z.string().optional(),
        })
        .merge(windowInput)
    )
    .mutation(async ({ ctx, input }) => {
      assertWindowTimes(input);
      const practitionerId = resolveTargetPractitionerId(ctx.user, input.practitionerId);
      await assertPractitionerWorksAtLocation({ prisma: ctx.prisma, practitionerId, locationId: input.locationId });

      if (input.id) {
        const existing = await ctx.prisma.practitionerAvailabilityWindow.findUnique({
          where: { id: input.id },
        });
        if (!existing) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Availability window not found' });
        }
        if (existing.practitionerId !== practitionerId) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot edit this availability window' });
        }

        const touchedDays = new Set<string>();
        const touch = (pid: string, loc: string, dow: number) => touchedDays.add(`${pid}|${loc}|${dow}`);

        touch(existing.practitionerId, existing.locationId, existing.dayOfWeek);
        touch(practitionerId, input.locationId, input.dayOfWeek);

        const row = await ctx.prisma.practitionerAvailabilityWindow.update({
          where: { id: input.id },
          data: {
            practitionerId,
            locationId: input.locationId,
            dayOfWeek: input.dayOfWeek,
            windowStartMin: input.windowStartMin,
            windowEndMin: input.windowEndMin,
            slotDurationMin: input.slotDurationMin,
          },
          include: { location: { select: { id: true, name: true } } },
        });

        for (const key of touchedDays) {
          const [pid, loc, dowStr] = key.split('|');
          // eslint-disable-next-line no-await-in-loop
          await resyncFutureDaySlots({
            prisma: ctx.prisma,
            practitionerId: pid!,
            locationId: loc!,
            dayOfWeek: Number(dowStr),
          });
        }

        return row;
      }

      const created = await ctx.prisma.practitionerAvailabilityWindow.create({
        data: {
          practitionerId,
          locationId: input.locationId,
          dayOfWeek: input.dayOfWeek,
          windowStartMin: input.windowStartMin,
          windowEndMin: input.windowEndMin,
          slotDurationMin: input.slotDurationMin,
        },
        include: { location: { select: { id: true, name: true } } },
      });

      await resyncFutureDaySlots({
        prisma: ctx.prisma,
        practitionerId,
        locationId: input.locationId,
        dayOfWeek: input.dayOfWeek,
      });

      return created;
    }),

  delete: staffProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const existing = await ctx.prisma.practitionerAvailabilityWindow.findUnique({ where: { id: input.id } });
    if (!existing) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Availability window not found' });
    }

    const practitionerId = resolveTargetPractitionerId(ctx.user, existing.practitionerId);
    if (existing.practitionerId !== practitionerId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot delete this availability window' });
    }

    await ctx.prisma.practitionerAvailabilityWindow.delete({ where: { id: input.id } });

    await resyncFutureDaySlots({
      prisma: ctx.prisma,
      practitionerId: existing.practitionerId,
      locationId: existing.locationId,
      dayOfWeek: existing.dayOfWeek,
    });

    return { ok: true as const };
  }),
});
