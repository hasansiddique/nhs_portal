"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const trpc_1 = require("../trpc/trpc");
function generateDemoNhsNumber(ctx) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        for (let attempt = 0; attempt < 5; attempt += 1) {
            const candidate = String(Date.now() + Math.floor(Math.random() * 1000)).slice(-10);
            const existing = yield ctx.prisma.patient.findUnique({
                where: { nhsNumber: candidate },
                select: { id: true },
            });
            if (!existing) {
                return candidate;
            }
        }
        return String(Date.now()).padStart(10, '0').slice(-10);
    });
}
function resolvePatientIdForAppointment(ctx, patientId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        if (patientId) {
            const patient = yield ctx.prisma.patient.findUnique({
                where: { id: patientId },
                select: { id: true },
            });
            if (!patient) {
                throw new Error('Patient not found');
            }
            return patient.id;
        }
        if (!((_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new Error('You must be signed in to create an appointment');
        }
        const existingPatient = yield ctx.prisma.patient.findUnique({
            where: { userId: ctx.user.id },
            select: { id: true },
        });
        if (existingPatient) {
            return existingPatient.id;
        }
        const createdPatient = yield ctx.prisma.patient.create({
            data: {
                userId: ctx.user.id,
                nhsNumber: yield generateDemoNhsNumber(ctx),
                dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
            },
            select: { id: true },
        });
        return createdPatient.id;
    });
}
function assertNoAppointmentConflicts(ctx, input) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const [patientConflict, practitionerConflict] = yield Promise.all([
            ctx.prisma.appointment.findFirst({
                where: {
                    patientId: input.patientId,
                    status: { not: 'CANCELLED' },
                    slot: {
                        startAt: { lt: input.endAt },
                        endAt: { gt: input.startAt },
                    },
                },
                select: { id: true },
            }),
            ctx.prisma.appointment.findFirst({
                where: {
                    practitionerId: input.practitionerId,
                    status: { not: 'CANCELLED' },
                    slot: {
                        startAt: { lt: input.endAt },
                        endAt: { gt: input.startAt },
                    },
                },
                select: { id: true },
            }),
        ]);
        if (patientConflict) {
            throw new Error('You already have an appointment at that time');
        }
        if (practitionerConflict) {
            throw new Error('This appointment time is no longer available');
        }
    });
}
exports.appointmentsRouter = (0, trpc_1.router)({
    list: trpc_1.publicProcedure
        .input(zod_1.z.object({
        patientId: zod_1.z.string().optional(),
        practitionerId: zod_1.z.string().optional(),
        status: zod_1.z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
        from: zod_1.z.coerce.date().optional(),
        to: zod_1.z.coerce.date().optional(),
        limit: zod_1.z.number().min(1).max(500).default(50),
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
        patientId: zod_1.z.string().optional(),
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
        const patientId = yield resolvePatientIdForAppointment(ctx, input.patientId);
        yield assertNoAppointmentConflicts(ctx, {
            patientId,
            practitionerId: slot.practitionerId,
            startAt: slot.startAt,
            endAt: slot.endAt,
        });
        return ctx.prisma.appointment.create({
            data: {
                patientId,
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
    createFromCalendar: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        patientId: zod_1.z.string().optional(),
        practitionerId: zod_1.z.string(),
        locationId: zod_1.z.string(),
        startAt: zod_1.z.coerce.date(),
        endAt: zod_1.z.coerce.date(),
        reason: zod_1.z.string().optional(),
    }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        if (input.endAt <= input.startAt) {
            throw new Error('Appointment end time must be after the start time');
        }
        const patientId = yield resolvePatientIdForAppointment(ctx, input.patientId);
        yield assertNoAppointmentConflicts(ctx, {
            patientId,
            practitionerId: input.practitionerId,
            startAt: input.startAt,
            endAt: input.endAt,
        });
        const existingSlot = yield ctx.prisma.slot.findFirst({
            where: {
                practitionerId: input.practitionerId,
                locationId: input.locationId,
                startAt: input.startAt,
                endAt: input.endAt,
            },
            include: { appointment: true },
        });
        if (existingSlot === null || existingSlot === void 0 ? void 0 : existingSlot.appointment) {
            throw new Error('This appointment time is no longer available');
        }
        const slot = existingSlot !== null && existingSlot !== void 0 ? existingSlot : (yield ctx.prisma.slot.create({
            data: {
                practitionerId: input.practitionerId,
                locationId: input.locationId,
                startAt: input.startAt,
                endAt: input.endAt,
            },
        }));
        return ctx.prisma.appointment.create({
            data: {
                patientId,
                slotId: slot.id,
                practitionerId: input.practitionerId,
                reason: input.reason,
            },
            include: {
                patient: { include: { user: { select: { name: true, email: true } } } },
                practitioner: { include: { user: { select: { name: true } } } },
                slot: { include: { location: true } },
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