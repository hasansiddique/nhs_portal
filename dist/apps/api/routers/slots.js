"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotsRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const prisma_client_1 = require("../generated/prisma-client");
const trpc_1 = require("../trpc/trpc");
const practitionerAvailabilityMaterialize_1 = require("../lib/practitionerAvailabilityMaterialize");
exports.slotsRouter = (0, trpc_1.router)({
    available: trpc_1.publicProcedure
        .input(zod_1.z.object({
        practitionerId: zod_1.z.string().optional(),
        locationId: zod_1.z.string().optional(),
        locationIds: zod_1.z.array(zod_1.z.string()).optional(),
        from: zod_1.z.coerce.date(),
        to: zod_1.z.coerce.date(),
    }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        var _b;
        const locIds = ((_b = input.locationIds) === null || _b === void 0 ? void 0 : _b.length) ? input.locationIds : input.locationId ? [input.locationId] : [];
        const locationClause = locIds.length > 1 ? { locationId: { in: locIds } } : locIds.length === 1 ? { locationId: locIds[0] } : {};
        const practitionerIds = yield (0, practitionerAvailabilityMaterialize_1.resolvePractitionerIdsForSlotQuery)({
            prisma: ctx.prisma,
            practitionerId: input.practitionerId,
            locationIds: locIds.length ? locIds : undefined,
        });
        if (practitionerIds === null || practitionerIds === void 0 ? void 0 : practitionerIds.length) {
            yield (0, practitionerAvailabilityMaterialize_1.materializeSlotsForManyPractitioners)({
                prisma: ctx.prisma,
                practitionerIds,
                locationIds: locIds.length ? locIds : undefined,
                from: input.from,
                to: input.to,
            });
        }
        const slots = yield ctx.prisma.slot.findMany({
            where: Object.assign(Object.assign(Object.assign({}, (input.practitionerId && { practitionerId: input.practitionerId })), locationClause), { startAt: { lt: input.to }, endAt: { gt: input.from }, appointment: null }),
            include: {
                practitioner: { include: { user: { select: { name: true } } } },
                location: { select: { id: true, name: true, address: true } },
            },
            orderBy: { startAt: 'asc' },
        });
        return slots;
    })),
    create: trpc_1.staffProcedure
        .input(zod_1.z.object({
        practitionerId: zod_1.z.string(),
        locationId: zod_1.z.string(),
        startAt: zod_1.z.coerce.date(),
        endAt: zod_1.z.coerce.date(),
    }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const user = ctx.user;
        yield (0, practitionerAvailabilityMaterialize_1.assertIntervalMatchesAvailability)({
            prisma: ctx.prisma,
            practitionerId: input.practitionerId,
            locationId: input.locationId,
            startAt: input.startAt,
            endAt: input.endAt,
        });
        if (user.role === prisma_client_1.UserRole.PRACTITIONER) {
            if (user.practitionerId !== input.practitionerId) {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You can only create slots for yourself' });
            }
            const ok = yield ctx.prisma.practitionerLocation.findFirst({
                where: { practitionerId: user.practitionerId, locationId: input.locationId },
            });
            if (!ok) {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You do not work at this location' });
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
    })),
});
//# sourceMappingURL=slots.js.map