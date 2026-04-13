"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientProcedure = exports.staffProcedure = exports.adminProcedure = exports.protectedProcedure = exports.publicProcedure = exports.router = void 0;
const server_1 = require("@trpc/server");
const prisma_client_1 = require("../generated/prisma-client");
const t = server_1.initTRPC.context().create();
exports.router = t.router;
exports.publicProcedure = t.procedure;
const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: Object.assign(Object.assign({}, ctx), { user: ctx.user }),
    });
});
exports.protectedProcedure = t.procedure.use(isAuthed);
function requireRole(allowed) {
    return t.middleware(({ ctx, next }) => {
        if (!ctx.user) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
        }
        const role = ctx.user.role;
        if (!allowed.includes(role)) {
            throw new server_1.TRPCError({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
        }
        return next({
            ctx: Object.assign(Object.assign({}, ctx), { user: ctx.user }),
        });
    });
}
exports.adminProcedure = exports.protectedProcedure.use(requireRole([prisma_client_1.UserRole.ADMIN]));
exports.staffProcedure = exports.protectedProcedure.use(requireRole([prisma_client_1.UserRole.ADMIN, prisma_client_1.UserRole.PRACTITIONER]));
exports.patientProcedure = exports.protectedProcedure.use(requireRole([prisma_client_1.UserRole.PATIENT]));
//# sourceMappingURL=trpc.js.map