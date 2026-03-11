"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationsRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const trpc_1 = require("../trpc/trpc");
exports.locationsRouter = (0, trpc_1.router)({
    list: trpc_1.publicProcedure.query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx }) {
        return ctx.prisma.location.findMany({
            orderBy: { name: 'asc' },
        });
    })),
    byId: trpc_1.publicProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        return ctx.prisma.location.findUnique({
            where: { id: input.id },
            include: { slots: true },
        });
    })),
});
//# sourceMappingURL=locations.js.map