"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilityRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const prisma_client_1 = require("../generated/prisma-client");
const trpc_1 = require("../trpc/trpc");
const practitionerAvailabilityMaterialize_1 = require("../lib/practitionerAvailabilityMaterialize");
const windowInput = zod_1.z.object({
    practitionerId: zod_1.z.string().optional(),
    locationId: zod_1.z.string(),
    dayOfWeek: zod_1.z.number().int().min(1).max(7),
    windowStartMin: zod_1.z.number().int().min(0).max(24 * 60),
    windowEndMin: zod_1.z.number().int().min(0).max(24 * 60),
    slotDurationMin: zod_1.z.number().int().min(5).max(240).default(30),
});
function assertWindowTimes(input) {
    if (input.windowEndMin <= input.windowStartMin) {
        throw new server_1.TRPCError({ code: 'BAD_REQUEST', message: 'Availability end time must be after the start time' });
    }
    if ((input.windowEndMin - input.windowStartMin) % input.slotDurationMin !== 0) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'The time window length must be a multiple of the slot duration',
        });
    }
}
function assertPractitionerWorksAtLocation(ctx) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const ok = yield ctx.prisma.practitionerLocation.findFirst({
            where: { practitionerId: ctx.practitionerId, locationId: ctx.locationId },
            select: { id: true },
        });
        if (!ok) {
            throw new server_1.TRPCError({ code: 'BAD_REQUEST', message: 'That clinician is not linked to the selected clinic' });
        }
    });
}
function resolveTargetPractitionerId(user, inputId) {
    if (user.role === prisma_client_1.UserRole.PRACTITIONER) {
        if (!user.practitionerId) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Practitioner profile is not linked to this account' });
        }
        if (inputId && inputId !== user.practitionerId) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You can only manage your own availability' });
        }
        return user.practitionerId;
    }
    if (user.role === prisma_client_1.UserRole.ADMIN) {
        if (!inputId) {
            throw new server_1.TRPCError({ code: 'BAD_REQUEST', message: 'practitionerId is required' });
        }
        return inputId;
    }
    throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
}
function resyncFutureDaySlots(params) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield (0, practitionerAvailabilityMaterialize_1.deleteUnbookedFutureSlotsForPractitionerDayLocation)({
            prisma: params.prisma,
            practitionerId: params.practitionerId,
            locationId: params.locationId,
            dayOfWeek: params.dayOfWeek,
            fromDay: new Date(),
            horizonDays: practitionerAvailabilityMaterialize_1.PRACTITIONER_SLOT_MATERIALIZATION_DAYS,
        });
        yield (0, practitionerAvailabilityMaterialize_1.materializeSlotsForPractitioner)({
            prisma: params.prisma,
            practitionerId: params.practitionerId,
            locationIds: [params.locationId],
            fromDay: new Date(),
            horizonDays: practitionerAvailabilityMaterialize_1.PRACTITIONER_SLOT_MATERIALIZATION_DAYS,
        });
    });
}
exports.availabilityRouter = (0, trpc_1.router)({
    list: trpc_1.staffProcedure
        .input(zod_1.z.object({
        /** When set (admin only), restrict to one clinician; omit to list everyone. */
        practitionerId: zod_1.z.string().optional(),
        locationId: zod_1.z.string().optional(),
        /** When set, only windows at these clinics (UI location filter). */
        locationIds: zod_1.z.array(zod_1.z.string()).optional(),
        /** Admin only: case-insensitive match on clinician name or email. */
        search: zod_1.z.string().optional(),
    }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        var _b;
        const user = ctx.user;
        const locationWhere = input.locationIds && input.locationIds.length > 0
            ? { locationId: { in: input.locationIds } }
            : input.locationId
                ? { locationId: input.locationId }
                : {};
        if (user.role === prisma_client_1.UserRole.PRACTITIONER) {
            const practitionerId = resolveTargetPractitionerId(user, input.practitionerId);
            return ctx.prisma.practitionerAvailabilityWindow.findMany({
                where: Object.assign({ practitionerId }, locationWhere),
                include: {
                    location: { select: { id: true, name: true } },
                    practitioner: { include: { user: { select: { id: true, name: true, email: true } } } },
                },
                orderBy: [{ dayOfWeek: 'asc' }, { windowStartMin: 'asc' }, { locationId: 'asc' }],
            });
        }
        if (user.role === prisma_client_1.UserRole.ADMIN) {
            const q = (_b = input.search) === null || _b === void 0 ? void 0 : _b.trim();
            const where = Object.assign(Object.assign(Object.assign({}, (input.practitionerId ? { practitionerId: input.practitionerId } : {})), locationWhere), (q
                ? {
                    practitioner: {
                        user: {
                            OR: [
                                { name: { contains: q, mode: 'insensitive' } },
                                { email: { contains: q, mode: 'insensitive' } },
                            ],
                        },
                    },
                }
                : {}));
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
        throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
    })),
    upsert: trpc_1.staffProcedure
        .input(zod_1.z
        .object({
        id: zod_1.z.string().optional(),
    })
        .merge(windowInput))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        assertWindowTimes(input);
        const practitionerId = resolveTargetPractitionerId(ctx.user, input.practitionerId);
        yield assertPractitionerWorksAtLocation({ prisma: ctx.prisma, practitionerId, locationId: input.locationId });
        if (input.id) {
            const existing = yield ctx.prisma.practitionerAvailabilityWindow.findUnique({
                where: { id: input.id },
            });
            if (!existing) {
                throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Availability window not found' });
            }
            if (existing.practitionerId !== practitionerId) {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You cannot edit this availability window' });
            }
            const touchedDays = new Set();
            const touch = (pid, loc, dow) => touchedDays.add(`${pid}|${loc}|${dow}`);
            touch(existing.practitionerId, existing.locationId, existing.dayOfWeek);
            touch(practitionerId, input.locationId, input.dayOfWeek);
            const row = yield ctx.prisma.practitionerAvailabilityWindow.update({
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
                yield resyncFutureDaySlots({
                    prisma: ctx.prisma,
                    practitionerId: pid,
                    locationId: loc,
                    dayOfWeek: Number(dowStr),
                });
            }
            return row;
        }
        const created = yield ctx.prisma.practitionerAvailabilityWindow.create({
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
        yield resyncFutureDaySlots({
            prisma: ctx.prisma,
            practitionerId,
            locationId: input.locationId,
            dayOfWeek: input.dayOfWeek,
        });
        return created;
    })),
    delete: trpc_1.staffProcedure.input(zod_1.z.object({ id: zod_1.z.string() })).mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const existing = yield ctx.prisma.practitionerAvailabilityWindow.findUnique({ where: { id: input.id } });
        if (!existing) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Availability window not found' });
        }
        const practitionerId = resolveTargetPractitionerId(ctx.user, existing.practitionerId);
        if (existing.practitionerId !== practitionerId) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You cannot delete this availability window' });
        }
        yield ctx.prisma.practitionerAvailabilityWindow.delete({ where: { id: input.id } });
        yield resyncFutureDaySlots({
            prisma: ctx.prisma,
            practitionerId: existing.practitionerId,
            locationId: existing.locationId,
            dayOfWeek: existing.dayOfWeek,
        });
        return { ok: true };
    })),
});
//# sourceMappingURL=availability.js.map