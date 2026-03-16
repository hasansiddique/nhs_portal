"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const trpc_1 = require("../trpc/trpc");
exports.appointmentsRouter = (0, trpc_1.router)({
    list: trpc_1.publicProcedure
        .input(zod_1.z.object({
        patientId: zod_1.z.string().optional(),
        practitionerId: zod_1.z.string().optional(),
        status: zod_1.z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
        from: zod_1.z.date().optional(),
        to: zod_1.z.date().optional(),
        limit: zod_1.z.number().min(1).max(100).default(50),
    }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const where = {};
        if (input.patientId)
            where.patientId = input.patientId;
        if (input.practitionerId)
            where.practitionerId = input.practitionerId;
        if (input.status)
            where.status = input.status;
        if (input.from || input.to) {
            where.slot = {
                startAt: Object.assign(Object.assign({}, (input.from && { gte: input.from })), (input.to && { lte: input.to })),
            };
        }
        const items = yield ctx.prisma.appointment.findMany({
            where,
            take: input.limit,
            include: {
                patient: { include: { user: { select: { name: true, email: true } } } },
                practitioner: { include: { user: { select: { name: true } } } },
                slot: { include: { location: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { items };
    })),
    byId: trpc_1.publicProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        return ctx.prisma.appointment.findUnique({
            where: { id: input.id },
            include: {
                patient: { include: { user: { select: { name: true, email: true, phone: true } } } },
                practitioner: { include: { user: { select: { name: true } } } },
                slot: { include: { location: true } },
            },
        });
    })),
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        patientId: zod_1.z.string(),
        slotId: zod_1.z.string(),
        reason: zod_1.z.string().optional(),
    }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const slot = yield ctx.prisma.slot.findUnique({
            where: { id: input.slotId },
            include: { appointment: true },
        });
        if (!slot)
            throw new Error('Slot not found');
        if (slot.appointment)
            throw new Error('Slot already booked');
        return ctx.prisma.appointment.create({
            data: {
                patientId: input.patientId,
                slotId: input.slotId,
                practitionerId: slot.practitionerId,
                reason: input.reason,
            },
            include: {
                slot: { include: { location: true } },
                practitioner: { include: { user: { select: { name: true } } } },
            },
        });
    })),
    updateStatus: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        status: zod_1.z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
        notes: zod_1.z.string().optional(),
    }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        return ctx.prisma.appointment.update({
            where: { id: input.id },
            data: { status: input.status, notes: input.notes },
        });
    })),
});
//# sourceMappingURL=appointments.js.map