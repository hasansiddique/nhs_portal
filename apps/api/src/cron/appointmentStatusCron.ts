import { prisma } from '../lib/prisma';

const THIRTY_MIN_MS = 30 * 60 * 1000;

/**
 * Past scheduled visits that were never completed or cancelled.
 * Uses the slot **end** time so in-progress appointments are not flipped mid-window.
 */
export async function markPastScheduledAppointmentsAsNoShow(): Promise<{ updated: number }> {
  const now = new Date();

  const stale = await prisma.appointment.findMany({
    where: {
      status: 'SCHEDULED',
      slot: { endAt: { lt: now } },
    },
    select: { id: true },
  });

  if (stale.length === 0) {
    return { updated: 0 };
  }

  const result = await prisma.appointment.updateMany({
    where: {
      id: { in: stale.map((a) => a.id) },
      status: 'SCHEDULED',
    },
    data: { status: 'NO_SHOW' },
  });

  return { updated: result.count };
}

async function runJobSafely() {
  try {
    const { updated } = await markPastScheduledAppointmentsAsNoShow();
    if (updated > 0) {
      console.log(
        `[appointment-status-cron] ${new Date().toISOString()} — set ${updated} past SCHEDULED appointment(s) to NO_SHOW`
      );
    }
  } catch (err) {
    console.error('[appointment-status-cron] run failed:', err);
  }
}

let intervalHandle: ReturnType<typeof setInterval> | undefined;

/**
 * Runs once shortly after boot, then every 30 minutes.
 * Set `DISABLE_APPOINTMENT_STATUS_CRON=true` to skip (e.g. one-off scripts).
 */
export function startAppointmentStatusCron() {
  if (process.env.DISABLE_APPOINTMENT_STATUS_CRON === 'true' || process.env.DISABLE_APPOINTMENT_STATUS_CRON === '1') {
    console.log('[appointment-status-cron] disabled via DISABLE_APPOINTMENT_STATUS_CRON');
    return;
  }

  if (intervalHandle) {
    return;
  }

  void runJobSafely();
  intervalHandle = setInterval(() => {
    void runJobSafely();
  }, THIRTY_MIN_MS);

  console.log('[appointment-status-cron] scheduled every 30 minutes');
}

export function stopAppointmentStatusCron() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = undefined;
  }
}
