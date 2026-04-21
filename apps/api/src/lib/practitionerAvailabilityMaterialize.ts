import { TRPCError } from '@trpc/server';
import { addDays, startOfDay } from 'date-fns';
import type { PrismaClient } from '../generated/prisma-client';

/** Keep in sync with `apps/api/prisma/seed.ts` — horizon for concrete `Slot` rows. */
export const PRACTITIONER_SLOT_MATERIALIZATION_DAYS = 90;

/** ISO weekday: Monday = 1 … Sunday = 7 */
export function isoDayOfWeek(d: Date): number {
  const js = d.getDay();
  return js === 0 ? 7 : js;
}

function minutesSinceLocalMidnight(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

export function slotMatchesAvailabilityWindow(params: {
  startAt: Date;
  endAt: Date;
  dayOfWeek: number;
  windowStartMin: number;
  windowEndMin: number;
  slotDurationMin: number;
}): boolean {
  if (isoDayOfWeek(params.startAt) !== params.dayOfWeek) return false;
  const durMin = Math.round((params.endAt.getTime() - params.startAt.getTime()) / 60_000);
  if (durMin !== params.slotDurationMin) return false;
  const startMin = minutesSinceLocalMidnight(params.startAt);
  const endMin = minutesSinceLocalMidnight(params.endAt);
  if (endMin <= startMin) return false;
  if (startMin < params.windowStartMin) return false;
  if (endMin > params.windowEndMin) return false;
  if ((startMin - params.windowStartMin) % params.slotDurationMin !== 0) return false;
  return true;
}

export async function loadAvailabilityWindows(params: {
  prisma: PrismaClient;
  practitionerId: string;
  locationIds?: string[];
}): Promise<
  {
    id: string;
    practitionerId: string;
    locationId: string;
    dayOfWeek: number;
    windowStartMin: number;
    windowEndMin: number;
    slotDurationMin: number;
  }[]
> {
  return params.prisma.practitionerAvailabilityWindow.findMany({
    where: {
      practitionerId: params.practitionerId,
      ...(params.locationIds?.length ? { locationId: { in: params.locationIds } } : {}),
    },
    orderBy: [{ dayOfWeek: 'asc' }, { windowStartMin: 'asc' }, { locationId: 'asc' }],
  });
}

export function buildSlotRowsFromWindows(params: {
  windows: {
    practitionerId: string;
    locationId: string;
    dayOfWeek: number;
    windowStartMin: number;
    windowEndMin: number;
    slotDurationMin: number;
  }[];
  horizonDays: number;
  fromDay: Date;
}): { practitionerId: string; locationId: string; startAt: Date; endAt: Date }[] {
  const rows: { practitionerId: string; locationId: string; startAt: Date; endAt: Date }[] = [];
  const base = startOfDay(params.fromDay);

  for (let offset = 0; offset < params.horizonDays; offset += 1) {
    const day = startOfDay(addDays(base, offset));
    const dow = isoDayOfWeek(day);

    for (const w of params.windows) {
      if (w.dayOfWeek !== dow) continue;

      for (
        let cursor = w.windowStartMin;
        cursor + w.slotDurationMin <= w.windowEndMin;
        cursor += w.slotDurationMin
      ) {
        const startAt = new Date(day);
        startAt.setHours(Math.floor(cursor / 60), cursor % 60, 0, 0);
        const endAt = new Date(startAt.getTime() + w.slotDurationMin * 60_000);
        rows.push({
          practitionerId: w.practitionerId,
          locationId: w.locationId,
          startAt,
          endAt,
        });
      }
    }
  }

  return rows;
}

export async function deleteUnbookedFutureSlotsForPractitionerDayLocation(params: {
  prisma: PrismaClient;
  practitionerId: string;
  locationId: string;
  dayOfWeek: number;
  fromDay: Date;
  horizonDays: number;
}): Promise<void> {
  const base = startOfDay(params.fromDay);

  for (let offset = 0; offset < params.horizonDays; offset += 1) {
    const day = startOfDay(addDays(base, offset));
    if (isoDayOfWeek(day) !== params.dayOfWeek) continue;

    const dayStart = day;
    const dayEnd = addDays(dayStart, 1);

    await params.prisma.slot.deleteMany({
      where: {
        practitionerId: params.practitionerId,
        locationId: params.locationId,
        appointment: { is: null },
        startAt: { gte: dayStart, lt: dayEnd },
      },
    });
  }
}

export async function materializeSlotsForPractitioner(params: {
  prisma: PrismaClient;
  practitionerId: string;
  locationIds?: string[];
  fromDay?: Date;
  horizonDays?: number;
}): Promise<void> {
  const horizonDays = params.horizonDays ?? PRACTITIONER_SLOT_MATERIALIZATION_DAYS;
  const fromDay = startOfDay(params.fromDay ?? new Date());

  const windows = await loadAvailabilityWindows({
    prisma: params.prisma,
    practitionerId: params.practitionerId,
    locationIds: params.locationIds,
  });

  const windowsWithPid = windows.map((w) => ({ ...w, practitionerId: params.practitionerId }));
  const rows = buildSlotRowsFromWindows({ windows: windowsWithPid, horizonDays, fromDay });
  if (rows.length === 0) return;

  await params.prisma.slot.createMany({
    data: rows,
    skipDuplicates: true,
  });
}

export async function assertIntervalMatchesAvailability(params: {
  prisma: PrismaClient;
  practitionerId: string;
  locationId: string;
  startAt: Date;
  endAt: Date;
}): Promise<void> {
  const windows = await params.prisma.practitionerAvailabilityWindow.findMany({
    where: { practitionerId: params.practitionerId, locationId: params.locationId },
  });

  const ok = windows.some((w) =>
    slotMatchesAvailabilityWindow({
      startAt: params.startAt,
      endAt: params.endAt,
      dayOfWeek: w.dayOfWeek,
      windowStartMin: w.windowStartMin,
      windowEndMin: w.windowEndMin,
      slotDurationMin: w.slotDurationMin,
    })
  );

  if (!ok) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'That time is outside the clinician’s configured availability for this clinic',
    });
  }
}

export async function materializeSlotsForManyPractitioners(params: {
  prisma: PrismaClient;
  practitionerIds: string[];
  locationIds?: string[];
  from: Date;
  to: Date;
}): Promise<void> {
  if (params.practitionerIds.length === 0) return;

  const fromDay = startOfDay(params.from);
  const toDay = startOfDay(params.to);
  const spanDays = Math.max(1, Math.ceil((toDay.getTime() - fromDay.getTime()) / 86_400_000) + 1);

  const horizonDays = Math.min(PRACTITIONER_SLOT_MATERIALIZATION_DAYS, spanDays);

  for (const pid of params.practitionerIds) {
    // eslint-disable-next-line no-await-in-loop
    await materializeSlotsForPractitioner({
      prisma: params.prisma,
      practitionerId: pid,
      locationIds: params.locationIds,
      fromDay,
      horizonDays,
    });
  }
}

export async function resolvePractitionerIdsForSlotQuery(params: {
  prisma: PrismaClient;
  practitionerId?: string;
  locationIds?: string[];
}): Promise<string[] | undefined> {
  if (params.practitionerId) return [params.practitionerId];

  if (!params.locationIds?.length) return undefined;

  const windows = await params.prisma.practitionerAvailabilityWindow.findMany({
    where: { locationId: { in: params.locationIds } },
    select: { practitionerId: true },
    distinct: ['practitionerId'],
  });

  return windows.map((w) => w.practitionerId);
}
