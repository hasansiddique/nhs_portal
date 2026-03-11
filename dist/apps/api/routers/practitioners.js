"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.practitionersRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const trpc_1 = require("../trpc/trpc");
exports.practitionersRouter = (0, trpc_1.router)({
    list: trpc_1.publicProcedure
        .input(zod_1.z.object({ cursor: zod_1.z.string().optional(), limit: zod_1.z.number().min(1).max(100).default(20) }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const items = yield ctx.prisma.practitioner.findMany({
            take: input.limit + 1,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            include: {
                user: { select: { id: true, email: true, name: true } },
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
        return ctx.prisma.practitioner.findUnique({
            where: { id: input.id },
            include: {
                user: { select: { id: true, email: true, name: true } },
                slots: { include: { location: true } },
            },
        });
    })),
});
//# sourceMappingURL=practitioners.js.map