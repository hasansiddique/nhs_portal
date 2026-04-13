"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.practitionersRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const server_1 = require("@trpc/server");
const client_1 = require("@prisma/client");
const trpc_1 = require("../trpc/trpc");
const SALT_ROUNDS = 10;
exports.practitionersRouter = (0, trpc_1.router)({
    list: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        cursor: zod_1.z.string().optional(),
        limit: zod_1.z.number().min(1).max(500).default(50),
        locationId: zod_1.z.string().optional(),
    }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        var _b;
        const user = ctx.user;
        const where = {};
        if (user.role === client_1.UserRole.PATIENT) {
            let locFilter = input.locationId;
            if (!locFilter && user.patientId) {
                const p = yield ctx.prisma.patient.findUnique({
                    where: { id: user.patientId },
                    select: { locationId: true },
                });
                locFilter = (_b = p === null || p === void 0 ? void 0 : p.locationId) !== null && _b !== void 0 ? _b : undefined;
            }
            if (locFilter) {
                where.practitionerLocations = { some: { locationId: locFilter } };
            }
            else {
                where.practitionerLocations = { some: {} };
            }
        }
        else if (user.role === client_1.UserRole.PRACTITIONER && user.practitionerId) {
            const locs = yield ctx.prisma.practitionerLocation.findMany({
                where: { practitionerId: user.practitionerId },
                select: { locationId: true },
            });
            const ids = locs.map((l) => l.locationId);
            if (ids.length === 0) {
                where.id = user.practitionerId;
            }
            else if (input.locationId) {
                where.practitionerLocations = { some: { locationId: input.locationId } };
            }
            else {
                where.OR = [
                    { id: user.practitionerId },
                    { practitionerLocations: { some: { locationId: { in: ids } } } },
                ];
            }
        }
        else if (user.role === client_1.UserRole.ADMIN) {
            if (input.locationId) {
                where.practitionerLocations = { some: { locationId: input.locationId } };
            }
        }
        const items = yield ctx.prisma.practitioner.findMany({
            take: input.limit + 1,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            where,
            include: {
                user: { select: { id: true, email: true, name: true } },
                practitionerLocations: Object.assign(Object.assign({}, (input.locationId ? { where: { locationId: input.locationId } } : {})), { include: { location: { select: { id: true, name: true } } } }),
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
        return ctx.prisma.practitioner.findUnique({
            where: { id: input.id },
            include: {
                user: { select: { id: true, email: true, name: true } },
                slots: { include: { location: true } },
                practitionerLocations: { include: { location: { select: { id: true, name: true } } } },
            },
        });
    })),
    /** Admin: create clinician login + practitioner + link to locations. */
    adminRegister: trpc_1.adminProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
        name: zod_1.z.string().min(1),
        title: zod_1.z.string().optional(),
        speciality: zod_1.z.string().optional(),
        gmcNumber: zod_1.z.string().optional().nullable(),
        locationIds: zod_1.z.array(zod_1.z.string()).min(1),
    }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        var _b, _c, _d;
        const email = input.email.trim().toLowerCase();
        const existing = yield ctx.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new server_1.TRPCError({ code: 'CONFLICT', message: 'Email is already registered' });
        }
        if (input.gmcNumber) {
            const gmcTaken = yield ctx.prisma.practitioner.findFirst({
                where: { gmcNumber: input.gmcNumber },
                select: { id: true },
            });
            if (gmcTaken) {
                throw new server_1.TRPCError({ code: 'CONFLICT', message: 'GMC number already in use' });
            }
        }
        const passwordHash = yield bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
        const user = yield ctx.prisma.user.create({
            data: {
                email,
                passwordHash,
                name: input.name,
                role: client_1.UserRole.PRACTITIONER,
            },
        });
        const practitioner = yield ctx.prisma.practitioner.create({
            data: {
                userId: user.id,
                title: (_b = input.title) !== null && _b !== void 0 ? _b : null,
                speciality: (_c = input.speciality) !== null && _c !== void 0 ? _c : null,
                gmcNumber: (_d = input.gmcNumber) !== null && _d !== void 0 ? _d : null,
                practitionerLocations: {
                    create: input.locationIds.map((locationId) => ({ locationId })),
                },
            },
            include: {
                user: { select: { id: true, email: true, name: true } },
                practitionerLocations: { include: { location: true } },
            },
        });
        return practitioner;
    })),
});
//# sourceMappingURL=practitioners.js.map