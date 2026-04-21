"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRACTITIONER_SLOT_MATERIALIZATION_DAYS = void 0;
exports.isoDayOfWeek = isoDayOfWeek;
exports.slotMatchesAvailabilityWindow = slotMatchesAvailabilityWindow;
exports.loadAvailabilityWindows = loadAvailabilityWindows;
exports.buildSlotRowsFromWindows = buildSlotRowsFromWindows;
exports.deleteUnbookedFutureSlotsForPractitionerDayLocation = deleteUnbookedFutureSlotsForPractitionerDayLocation;
exports.materializeSlotsForPractitioner = materializeSlotsForPractitioner;
exports.assertIntervalMatchesAvailability = assertIntervalMatchesAvailability;
exports.materializeSlotsForManyPractitioners = materializeSlotsForManyPractitioners;
exports.resolvePractitionerIdsForSlotQuery = resolvePractitionerIdsForSlotQuery;
const tslib_1 = require("tslib");
const server_1 = require("@trpc/server");
const date_fns_1 = require("date-fns");
/** Keep in sync with `apps/api/prisma/seed.ts` — horizon for concrete `Slot` rows. */
exports.PRACTITIONER_SLOT_MATERIALIZATION_DAYS = 90;
/** ISO weekday: Monday = 1 … Sunday = 7 */
function isoDayOfWeek(d) {
    const js = d.getDay();
    return js === 0 ? 7 : js;
}
function minutesSinceLocalMidnight(d) {
    return d.getHours() * 60 + d.getMinutes();
}
function slotMatchesAvailabilityWindow(params) {
    if (isoDayOfWeek(params.startAt) !== params.dayOfWeek)
        return false;
    const durMin = Math.round((params.endAt.getTime() - params.startAt.getTime()) / 60000);
    if (durMin !== params.slotDurationMin)
        return false;
    const startMin = minutesSinceLocalMidnight(params.startAt);
    const endMin = minutesSinceLocalMidnight(params.endAt);
    if (endMin <= startMin)
        return false;
    if (startMin < params.windowStartMin)
        return false;
    if (endMin > params.windowEndMin)
        return false;
    if ((startMin - params.windowStartMin) % params.slotDurationMin !== 0)
        return false;
    return true;
}
function loadAvailabilityWindows(params) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        return params.prisma.practitionerAvailabilityWindow.findMany({
            where: Object.assign({ practitionerId: params.practitionerId }, (((_a = params.locationIds) === null || _a === void 0 ? void 0 : _a.length) ? { locationId: { in: params.locationIds } } : {})),
            orderBy: [{ dayOfWeek: 'asc' }, { windowStartMin: 'asc' }, { locationId: 'asc' }],
        });
    });
}
function buildSlotRowsFromWindows(params) {
    const rows = [];
    const base = (0, date_fns_1.startOfDay)(params.fromDay);
    for (let offset = 0; offset < params.horizonDays; offset += 1) {
        const day = (0, date_fns_1.startOfDay)((0, date_fns_1.addDays)(base, offset));
        const dow = isoDayOfWeek(day);
        for (const w of params.windows) {
            if (w.dayOfWeek !== dow)
                continue;
            for (let cursor = w.windowStartMin; cursor + w.slotDurationMin <= w.windowEndMin; cursor += w.slotDurationMin) {
                const startAt = new Date(day);
                startAt.setHours(Math.floor(cursor / 60), cursor % 60, 0, 0);
                const endAt = new Date(startAt.getTime() + w.slotDurationMin * 60000);
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
function deleteUnbookedFutureSlotsForPractitionerDayLocation(params) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const base = (0, date_fns_1.startOfDay)(params.fromDay);
        for (let offset = 0; offset < params.horizonDays; offset += 1) {
            const day = (0, date_fns_1.startOfDay)((0, date_fns_1.addDays)(base, offset));
            if (isoDayOfWeek(day) !== params.dayOfWeek)
                continue;
            const dayStart = day;
            const dayEnd = (0, date_fns_1.addDays)(dayStart, 1);
            yield params.prisma.slot.deleteMany({
                where: {
                    practitionerId: params.practitionerId,
                    locationId: params.locationId,
                    appointment: { is: null },
                    startAt: { gte: dayStart, lt: dayEnd },
                },
            });
        }
    });
}
function materializeSlotsForPractitioner(params) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const horizonDays = (_a = params.horizonDays) !== null && _a !== void 0 ? _a : exports.PRACTITIONER_SLOT_MATERIALIZATION_DAYS;
        const fromDay = (0, date_fns_1.startOfDay)((_b = params.fromDay) !== null && _b !== void 0 ? _b : new Date());
        const windows = yield loadAvailabilityWindows({
            prisma: params.prisma,
            practitionerId: params.practitionerId,
            locationIds: params.locationIds,
        });
        const windowsWithPid = windows.map((w) => (Object.assign(Object.assign({}, w), { practitionerId: params.practitionerId })));
        const rows = buildSlotRowsFromWindows({ windows: windowsWithPid, horizonDays, fromDay });
        if (rows.length === 0)
            return;
        yield params.prisma.slot.createMany({
            data: rows,
            skipDuplicates: true,
        });
    });
}
function assertIntervalMatchesAvailability(params) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const windows = yield params.prisma.practitionerAvailabilityWindow.findMany({
            where: { practitionerId: params.practitionerId, locationId: params.locationId },
        });
        const ok = windows.some((w) => slotMatchesAvailabilityWindow({
            startAt: params.startAt,
            endAt: params.endAt,
            dayOfWeek: w.dayOfWeek,
            windowStartMin: w.windowStartMin,
            windowEndMin: w.windowEndMin,
            slotDurationMin: w.slotDurationMin,
        }));
        if (!ok) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: 'That time is outside the clinician’s configured availability for this clinic',
            });
        }
    });
}
function materializeSlotsForManyPractitioners(params) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (params.practitionerIds.length === 0)
            return;
        const fromDay = (0, date_fns_1.startOfDay)(params.from);
        const toDay = (0, date_fns_1.startOfDay)(params.to);
        const spanDays = Math.max(1, Math.ceil((toDay.getTime() - fromDay.getTime()) / 86400000) + 1);
        const horizonDays = Math.min(exports.PRACTITIONER_SLOT_MATERIALIZATION_DAYS, spanDays);
        for (const pid of params.practitionerIds) {
            // eslint-disable-next-line no-await-in-loop
            yield materializeSlotsForPractitioner({
                prisma: params.prisma,
                practitionerId: pid,
                locationIds: params.locationIds,
                fromDay,
                horizonDays,
            });
        }
    });
}
function resolvePractitionerIdsForSlotQuery(params) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        if (params.practitionerId)
            return [params.practitionerId];
        if (!((_a = params.locationIds) === null || _a === void 0 ? void 0 : _a.length))
            return undefined;
        const windows = yield params.prisma.practitionerAvailabilityWindow.findMany({
            where: { locationId: { in: params.locationIds } },
            select: { practitionerId: true },
            distinct: ['practitionerId'],
        });
        return windows.map((w) => w.practitionerId);
    });
}
//# sourceMappingURL=practitionerAvailabilityMaterialize.js.map