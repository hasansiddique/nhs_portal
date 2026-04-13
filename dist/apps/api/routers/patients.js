"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientsRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const trpc_1 = require("../trpc/trpc");
exports.patientsRouter = (0, trpc_1.router)({
    list: trpc_1.publicProcedure
        .input(zod_1.z.object({
        cursor: zod_1.z.string().optional(),
        limit: zod_1.z.number().min(1).max(500).default(50),
        locationId: zod_1.z.string().optional(),
    }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const items = yield ctx.prisma.patient.findMany({
            take: input.limit + 1,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            where: Object.assign({}, (input.locationId ? { locationId: input.locationId } : {})),
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
    byId: trpc_1.publicProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        return ctx.prisma.patient.findUnique({
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
            },
        });
    })),
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        userId: zod_1.z.string(),
        nhsNumber: zod_1.z.string(),
        dateOfBirth: zod_1.z.date(),
        addressLine1: zod_1.z.string().optional(),
        addressLine2: zod_1.z.string().optional(),
        postcode: zod_1.z.string().optional(),
        gpSurgeryName: zod_1.z.string().optional(),
        gpSurgeryCode: zod_1.z.string().optional(),
    }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        return ctx.prisma.patient.create({
            data: {
                userId: input.userId,
                nhsNumber: input.nhsNumber,
                dateOfBirth: input.dateOfBirth,
                addressLine1: input.addressLine1,
                addressLine2: input.addressLine2,
                postcode: input.postcode,
                gpSurgeryName: input.gpSurgeryName,
                gpSurgeryCode: input.gpSurgeryCode,
            },
        });
    })),
});
//# sourceMappingURL=patients.js.map