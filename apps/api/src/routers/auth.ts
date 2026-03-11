import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { router, publicProcedure } from '../trpc/trpc';

export const authRouter = router({
  signIn: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user) throw new Error('Invalid email or password');
      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) throw new Error('Invalid email or password');
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: { id: true, email: true, name: true, role: true },
    });
    return user;
  }),
});
