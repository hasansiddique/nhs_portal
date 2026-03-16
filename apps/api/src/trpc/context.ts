import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { prisma } from '../lib/prisma';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  // Optional: read token from cookie/header and resolve user
  const user = (req as any).user as AuthUser | undefined;
  return {
    prisma,
    req,
    res,
    user,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
