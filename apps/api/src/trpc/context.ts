import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'nhs-portal-secret-change-in-production';

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  let user = (req as any).user as AuthUser | undefined;

  if (!user) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as {
          sub?: string;
          email?: string;
          role?: string;
        };

        if (payload.sub && payload.email) {
          user = {
            id: String(payload.sub),
            email: String(payload.email),
            role: typeof payload.role === 'string' ? payload.role : 'PATIENT',
          };
        }
      } catch {
        user = undefined;
      }
    }
  }

  return {
    prisma,
    req,
    res,
    user,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
