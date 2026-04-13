import { initTRPC, TRPCError } from '@trpc/server';
import { UserRole } from '../generated/prisma-client';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

function requireRole(allowed: UserRole[]) {
  return t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const role = ctx.user.role as UserRole;
    if (!allowed.includes(role)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}

export const adminProcedure = protectedProcedure.use(requireRole([UserRole.ADMIN]));

export const staffProcedure = protectedProcedure.use(
  requireRole([UserRole.ADMIN, UserRole.PRACTITIONER])
);

export const patientProcedure = protectedProcedure.use(requireRole([UserRole.PATIENT]));
