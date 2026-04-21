"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientsRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const server_1 = require("@trpc/server");
const prisma_client_1 = require("../generated/prisma-client");
const trpc_1 = require("../trpc/trpc");
const SALT_ROUNDS = 10;
exports.patientsRouter = (0, trpc_1.router)({
    list: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        cursor: zod_1.z.string().nullable().optional(),
        limit: zod_1.z.number().min(1).max(500).default(50),
        locationId: zod_1.z.string().optional(),
        locationIds: zod_1.z.array(zod_1.z.string()).optional(),
    }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        var _b, _c;
        const user = ctx.user;
        const where = {};
        if (user.role === prisma_client_1.UserRole.PATIENT) {
            where.userId = user.id;
        }
        else if (user.role === prisma_client_1.UserRole.PRACTITIONER && user.practitionerId) {
            const locs = yield ctx.prisma.practitionerLocation.findMany({
                where: { practitionerId: user.practitionerId },
                select: { locationId: true },
            });
            const ids = locs.map((l) => l.locationId);
            if (ids.length === 0) {
                return { items: [], nextCursor: undefined };
            }
            where.OR = [{ locationId: { in: ids } }, { locationId: null }];
            const requested = ((_b = input.locationIds) === null || _b === void 0 ? void 0 : _b.length) ? input.locationIds : input.locationId ? [input.locationId] : [];
            const filterIds = requested.filter((f) => ids.includes(f));
            if (filterIds.length === 1) {
                where.locationId = filterIds[0];
            }
            else if (filterIds.length > 1) {
                where.locationId = { in: filterIds };
            }
        }
        else if (user.role === prisma_client_1.UserRole.ADMIN) {
            const filterIds = ((_c = input.locationIds) === null || _c === void 0 ? void 0 : _c.length) ? input.locationIds : input.locationId ? [input.locationId] : [];
            if (filterIds.length === 1) {
                where.locationId = filterIds[0];
            }
            else if (filterIds.length > 1) {
                where.locationId = { in: filterIds };
            }
        }
        else {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Invalid role' });
        }
        const items = yield ctx.prisma.patient.findMany({
            take: input.limit + 1,
            cursor: input.cursor != null && input.cursor !== '' ? { id: input.cursor } : undefined,
            where,
            include: {
                user: { select: { id: true, email: true, name: true, phone: true } },
                location: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        let nextCursor;
        if (items.length > input.limit) {
            const next = items.pop();
            nextCursor = next === null || next === void 0 ? void 0 : next.id;
        }
        return { items, nextCursor };
    })),
    byId: trpc_1.protectedProcedure.input(zod_1.z.object({ id: zod_1.z.string() })).query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const user = ctx.user;
        const row = yield ctx.prisma.patient.findUnique({
            where: { id: input.id },
            include: {
                user: { select: { id: true, email: true, name: true, phone: true } },
                appointments: {
                    include: {
                        slot: true,
                        practitioner: { include: { user: { select: { name: true, email: true } } } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                location: { select: { id: true, name: true } },
            },
        });
        if (!row) {
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'Patient not found' });
        }
        if (user.role === prisma_client_1.UserRole.PATIENT && row.userId !== user.id) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this patient record' });
        }
        if (user.role === prisma_client_1.UserRole.PRACTITIONER && user.practitionerId) {
            if (!row.locationId) {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this patient record' });
            }
            const ok = yield ctx.prisma.practitionerLocation.findFirst({
                where: { practitionerId: user.practitionerId, locationId: row.locationId },
            });
            if (!ok) {
                throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this patient record' });
            }
        }
        return row;
    })),
    /** Admin: create login + patient profile in one step. */
    adminRegister: trpc_1.adminProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
        name: zod_1.z.string().min(1),
        nhsNumber: zod_1.z.string().min(3),
        dateOfBirth: zod_1.z.coerce.date(),
        locationId: zod_1.z.string().optional(),
    }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const email = input.email.trim().toLowerCase();
        const existing = yield ctx.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new server_1.TRPCError({ code: 'CONFLICT', message: 'Email is already registered' });
        }
        const dupNhs = yield ctx.prisma.patient.findUnique({ where: { nhsNumber: input.nhsNumber } });
        if (dupNhs) {
            throw new server_1.TRPCError({ code: 'CONFLICT', message: 'NHS number already in use' });
        }
        const passwordHash = yield bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
        const user = yield ctx.prisma.user.create({
            data: {
                email,
                passwordHash,
                name: input.name,
                role: prisma_client_1.UserRole.PATIENT,
            },
        });
        const patient = yield ctx.prisma.patient.create({
            data: Object.assign({ userId: user.id, nhsNumber: input.nhsNumber, dateOfBirth: input.dateOfBirth }, (input.locationId ? { locationId: input.locationId } : {})),
            include: {
                user: { select: { id: true, email: true, name: true } },
                location: { select: { id: true, name: true } },
            },
        });
        return patient;
    })),
    /** Legacy create (user must already exist). Admin only. */
    create: trpc_1.adminProcedure
        .input(zod_1.z.object({
        userId: zod_1.z.string(),
        nhsNumber: zod_1.z.string(),
        dateOfBirth: zod_1.z.coerce.date(),
        addressLine1: zod_1.z.string().optional(),
        addressLine2: zod_1.z.string().optional(),
        postcode: zod_1.z.string().optional(),
        gpSurgeryName: zod_1.z.string().optional(),
        gpSurgeryCode: zod_1.z.string().optional(),
        locationId: zod_1.z.string().optional(),
    }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        return ctx.prisma.patient.create({
            data: Object.assign({ userId: input.userId, nhsNumber: input.nhsNumber, dateOfBirth: input.dateOfBirth, addressLine1: input.addressLine1, addressLine2: input.addressLine2, postcode: input.postcode, gpSurgeryName: input.gpSurgeryName, gpSurgeryCode: input.gpSurgeryCode }, (input.locationId ? { locationId: input.locationId } : {})),
        });
    })),
});
//# sourceMappingURL=patients.js.map