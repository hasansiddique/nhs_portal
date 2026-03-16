"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotsRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const trpc_1 = require("../trpc/trpc");
exports.slotsRouter = (0, trpc_1.router)({
    available: trpc_1.publicProcedure
        .input(zod_1.z.object({
        practitionerId: zod_1.z.string().optional(),
        locationId: zod_1.z.string().optional(),
        from: zod_1.z.date(),
        to: zod_1.z.date(),
    }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const slots = yield ctx.prisma.slot.findMany({
            where: Object.assign(Object.assign(Object.assign({}, (input.practitionerId && { practitionerId: input.practitionerId })), (input.locationId && { locationId: input.locationId })), { startAt: { gte: input.from }, endAt: { lte: input.to }, appointment: null }),
            include: {
                practitioner: { include: { user: { select: { name: true } } } },
                location: { select: { id: true, name: true, address: true } },
            },
            orderBy: { startAt: 'asc' },
        });
        return slots;
    })),
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        practitionerId: zod_1.z.string(),
        locationId: zod_1.z.string(),
        startAt: zod_1.z.date(),
        endAt: zod_1.z.date(),
    }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
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