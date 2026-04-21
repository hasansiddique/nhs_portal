"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const prisma_client_1 = require("../generated/prisma-client");
const trpc_1 = require("../trpc/trpc");
const practitionerAvailabilityMaterialize_1 = require("../lib/practitionerAvailabilityMaterialize");
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
function resolvePatientIdForAppointment(ctx, inputPatientId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const user = ctx.user;
        if (!user) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED', message: 'You must be signed in' });
        }
        if (user.role === prisma_client_1.UserRole.PATIENT) {
            let selfId = user.patientId;
            if (!selfId) {
                const row = yield ctx.prisma.patient.findUnique({
                    where: { userId: user.id },
                    select: { id: true },
                });
                selfId = row === null || row === void 0 ? void 0 : row.id;
            }
            if (!selfId) {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Patient profile is not linked to this account' });
            }
            if (inputPatientId && inputPatientId !== selfId) {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You can only book for yourself' });
            }
            return selfId;
        }
        if (inputPatientId) {
            const patient = yield ctx.prisma.patient.findUnique({
                where: { id: inputPatientId },
                select: { id: true },
            });
            if (!patient) {
                throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Patient not found' });
            }
            if (user.role === prisma_client_1.UserRole.PRACTITIONER && user.practitionerId) {
                const patientRow = yield ctx.prisma.patient.findUnique({
                    where: { id: inputPatientId },
                    select: { locationId: true },
                });
                if (!(patientRow === null || patientRow === void 0 ? void 0 : patientRow.locationId)) {
                    throw new server_1.TRPCError({
                        code: 'FORBIDDEN',
                        message: 'Patient has no clinic on file; an admin must assign a location first',
                    });
                }
                const allowed = yield ctx.prisma.practitionerLocation.findFirst({
                    where: {
                        practitionerId: user.practitionerId,
                        locationId: patientRow.locationId,
                    },
                });
                if (!allowed) {
                    throw new server_1.TRPCError({
                        code: 'FORBIDDEN',
                        message: 'You can only book patients registered at a location where you work',
                    });
                }
            }
            return inputPatientId;
        }
        throw new server_1.TRPCError({ code: 'BAD_REQUEST', message: 'patientId is required' });
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
            throw new server_1.TRPCError({ code: 'CONFLICT', message: 'You already have an appointment at that time' });
        }
        if (practitionerConflict) {
            throw new server_1.TRPCError({ code: 'CONFLICT', message: 'This appointment time is no longer available' });
        }
    });
}
function getAppointmentOrThrow(ctx, id) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const row = yield ctx.prisma.appointment.findUnique({
            where: { id },
            include: {
                patient: { select: { id: true, userId: true, locationId: true } },
                slot: { select: { locationId: true } },
            },
        });
        if (!row) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Appointment not found' });
        }
        return row;
    });
}
function assertCanReadAppointment(user, row) {
    if (user.role === prisma_client_1.UserRole.ADMIN)
        return;
    if (user.role === prisma_client_1.UserRole.PATIENT) {
        if (user.patientId !== row.patientId) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this appointment' });
        }
        return;
    }
    if (user.role === prisma_client_1.UserRole.PRACTITIONER) {
        if (user.practitionerId === row.practitionerId)
            return;
        throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this appointment' });
    }
    throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this appointment' });
}
function resolveAppointmentLocationIds(input) {
    var _a;
    if ((_a = input.locationIds) === null || _a === void 0 ? void 0 : _a.length)
        return input.locationIds;
    if (input.locationId)
        return [input.locationId];
    return undefined;
}
function buildListWhere(user, input) {
    const where = {};
    if (user.role === prisma_client_1.UserRole.PATIENT) {
        if (!user.patientId) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Patient profile is not linked' });
        }
        where.patientId = user.patientId;
        if (input.practitionerId) {
            where.practitionerId = input.practitionerId;
        }
    }
    else if (user.role === prisma_client_1.UserRole.PRACTITIONER) {
        if (!user.practitionerId) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Practitioner profile is not linked' });
        }
        where.practitionerId = user.practitionerId;
        if (input.patientId) {
            where.patientId = input.patientId;
        }
    }
    else if (user.role === prisma_client_1.UserRole.ADMIN) {
        if (input.patientId)
            where.patientId = input.patientId;
        if (input.practitionerId)
            where.practitionerId = input.practitionerId;
    }
    if (input.status) {
        where.status = input.status;
    }
    const slotFilter = {};
    if (input.from || input.to) {
        slotFilter.startAt = Object.assign(Object.assign({}, (input.from && { gte: input.from })), (input.to && { lte: input.to }));
    }
    const locIds = resolveAppointmentLocationIds(input);
    if ((locIds === null || locIds === void 0 ? void 0 : locIds.length) === 1) {
        slotFilter.locationId = locIds[0];
    }
    else if (locIds && locIds.length > 1) {
        slotFilter.locationId = { in: locIds };
    }
    if (Object.keys(slotFilter).length > 0) {
        where.slot = slotFilter;
    }
    return where;
}
exports.appointmentsRouter = (0, trpc_1.router)({
    list: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        patientId: zod_1.z.string().optional(),
        practitionerId: zod_1.z.string().optional(),
        status: zod_1.z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
        from: zod_1.z.coerce.date().optional(),
        to: zod_1.z.coerce.date().optional(),
        limit: zod_1.z.number().min(1).max(500).default(50),
        locationId: zod_1.z.string().optional(),
        locationIds: zod_1.z.array(zod_1.z.string()).optional(),
    }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const user = ctx.user;
        const where = buildListWhere(user, input);
        const items = yield ctx.prisma.appointment.findMany({
            where,
            take: input.limit,
            include: {
                patient: { include: { user: { select: { name: true, email: true, dateOfBirth: true } } } },
                practitioner: { select: { id: true, title: true, speciality: true, user: { select: { name: true } } } },
                slot: { include: { location: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { items };
    })),
    byId: trpc_1.protectedProcedure.input(zod_1.z.object({ id: zod_1.z.string() })).query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        var _b;
        const appointment = yield ctx.prisma.appointment.findUnique({
            where: { id: input.id },
            include: {
                patient: { include: { user: { select: { name: true, email: true, phone: true, dateOfBirth: true } } } },
                practitioner: { select: { id: true, title: true, speciality: true, user: { select: { name: true } } } },
                slot: { include: { location: true } },
            },
        });
        if (!appointment) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Appointment not found' });
        }
        assertCanReadAppointment(ctx.user, {
            patientId: appointment.patientId,
            practitionerId: appointment.practitionerId,
            patient: {
                userId: appointment.patient.userId,
                locationId: (_b = appointment.patient.locationId) !== null && _b !== void 0 ? _b : null,
            },
        });
        return appointment;
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
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Slot not found' });
        if (slot.appointment)
            throw new server_1.TRPCError({ code: 'CONFLICT', message: 'Slot already booked' });
        yield (0, practitionerAvailabilityMaterialize_1.assertIntervalMatchesAvailability)({
            prisma: ctx.prisma,
            practitionerId: slot.practitionerId,
            locationId: slot.locationId,
            startAt: slot.startAt,
            endAt: slot.endAt,
        });
        if (ctx.user.role === prisma_client_1.UserRole.PRACTITIONER && ctx.user.practitionerId !== slot.practitionerId) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'This slot is for a different practitioner' });
        }
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
    createFromCalendar: trpc_1.staffProcedure
        .input(zod_1.z.object({
        patientId: zod_1.z.string(),
        practitionerId: zod_1.z.string(),
        locationId: zod_1.z.string(),
        startAt: zod_1.z.coerce.date(),
        endAt: zod_1.z.coerce.date(),
        reason: zod_1.z.string().optional(),
    }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        if (input.endAt <= input.startAt) {
            throw new server_1.TRPCError({ code: 'BAD_REQUEST', message: 'Appointment end time must be after the start time' });
        }
        if (ctx.user.role === prisma_client_1.UserRole.PRACTITIONER && ctx.user.practitionerId !== input.practitionerId) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You can only create appointments as yourself' });
        }
        const patient = yield ctx.prisma.patient.findUnique({
            where: { id: input.patientId },
            select: { id: true, locationId: true },
        });
        if (!patient) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Patient not found' });
        }
        if (ctx.user.role === prisma_client_1.UserRole.PRACTITIONER && ctx.user.practitionerId) {
            const ok = yield ctx.prisma.practitionerLocation.findFirst({
                where: {
                    practitionerId: ctx.user.practitionerId,
                    locationId: input.locationId,
                },
            });
            if (!ok) {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You do not work at this location' });
            }
        }
        yield assertNoAppointmentConflicts(ctx, {
            patientId: input.patientId,
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
            throw new server_1.TRPCError({ code: 'CONFLICT', message: 'This appointment time is no longer available' });
        }
        yield (0, practitionerAvailabilityMaterialize_1.assertIntervalMatchesAvailability)({
            prisma: ctx.prisma,
            practitionerId: input.practitionerId,
            locationId: input.locationId,
            startAt: input.startAt,
            endAt: input.endAt,
        });
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
                patientId: input.patientId,
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
        const row = yield getAppointmentOrThrow(ctx, input.id);
        const user = ctx.user;
        if (user.role === prisma_client_1.UserRole.PATIENT) {
            if (user.patientId !== row.patientId) {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You cannot update this appointment' });
            }
            if (input.status !== 'CANCELLED') {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Patients may only cancel appointments' });
            }
        }
        else if (user.role === prisma_client_1.UserRole.PRACTITIONER) {
            if (user.practitionerId !== row.practitionerId) {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You cannot update this appointment' });
            }
        }
        return ctx.prisma.appointment.update({
            where: { id: input.id },
            data: { status: input.status, notes: input.notes },
        });
    })),
});
//# sourceMappingURL=appointments.js.map