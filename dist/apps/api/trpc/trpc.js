"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.router = void 0;
const server_1 = require("@trpc/server");
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
//# sourceMappingURL=trpc.js.map