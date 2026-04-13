"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const tslib_1 = require("tslib");
const zod_1 = require("zod");
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const trpc_1 = require("../trpc/trpc");
exports.authRouter = (0, trpc_1.router)({
    signIn: trpc_1.publicProcedure
        .input(zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(1) }))
        .mutation((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const user = yield ctx.prisma.user.findUnique({
            where: { email: input.email },
        });
        if (!user)
            throw new Error('Invalid email or password');
        const valid = yield bcryptjs_1.default.compare(input.password, user.passwordHash);
        if (!valid)
            throw new Error('Invalid email or password');
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    })),
    me: trpc_1.publicProcedure.query((_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ ctx }) {
        if (!ctx.user)
            return null;
        const user = yield ctx.prisma.user.findUnique({
            where: { id: ctx.user.id },
            select: { id: true, email: true, name: true, role: true },
        });
        return user;
    })),
});
//# sourceMappingURL=auth.js.map