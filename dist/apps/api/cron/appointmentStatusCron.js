"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPastScheduledAppointmentsAsNoShow = markPastScheduledAppointmentsAsNoShow;
exports.startAppointmentStatusCron = startAppointmentStatusCron;
exports.stopAppointmentStatusCron = stopAppointmentStatusCron;
const tslib_1 = require("tslib");
const prisma_1 = require("../lib/prisma");
const THIRTY_MIN_MS = 30 * 60 * 1000;
/**
 * Past scheduled visits that were never completed or cancelled.
 * Uses the slot **end** time so in-progress appointments are not flipped mid-window.
 */
function markPastScheduledAppointmentsAsNoShow() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const stale = yield prisma_1.prisma.appointment.findMany({
            where: {
                status: 'SCHEDULED',
                slot: { endAt: { lt: now } },
            },
            select: { id: true },
        });
        if (stale.length === 0) {
            return { updated: 0 };
        }
        const result = yield prisma_1.prisma.appointment.updateMany({
            where: {
                id: { in: stale.map((a) => a.id) },
                status: 'SCHEDULED',
            },
            data: { status: 'NO_SHOW' },
        });
        return { updated: result.count };
    });
}
function runJobSafely() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const { updated } = yield markPastScheduledAppointmentsAsNoShow();
            if (updated > 0) {
                console.log(`[appointment-status-cron] ${new Date().toISOString()} — set ${updated} past SCHEDULED appointment(s) to NO_SHOW`);
            }
        }
        catch (err) {
            console.error('[appointment-status-cron] run failed:', err);
        }
    });
}
let intervalHandle;
/**
 * Runs once shortly after boot, then every 30 minutes.
 * Set `DISABLE_APPOINTMENT_STATUS_CRON=true` to skip (e.g. one-off scripts).
 */
function startAppointmentStatusCron() {
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
function stopAppointmentStatusCron() {
    if (intervalHandle) {
        clearInterval(intervalHandle);
        intervalHandle = undefined;
    }
}
//# sourceMappingURL=appointmentStatusCron.js.map