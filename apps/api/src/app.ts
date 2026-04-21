import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext } from './trpc/context';
import {
  authLogin,
  authSignup,
  authForgotPassword,
  authVerifyResetToken,
  authResetPassword,
  authRefreshToken,
} from './routes/auth';
import { checkEmail, checkUsername } from './routes/auth';
import { publicLocationsByPostcode } from './routes/publicLocations';
import { markPastScheduledAppointmentsAsNoShow } from './cron/appointmentStatusCron';

/**
 * Express app with all HTTP routes (no `listen`).
 * On Vercel (`VERCEL=1`), wraps the app so requests under `/api/*` are forwarded with the `/api` prefix stripped
 * (browser + static hosting use `/api/trpc`, `/api/auth/...`).
 */
function buildCoreApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  /**
   * Scheduled job entry for Vercel Cron (no in-process `setInterval` on serverless).
   * Vercel sends `x-vercel-cron: 1`. Optional `?secret=` matches `CRON_SECRET` for manual runs.
   */
  app.get('/cron/appointment-status', async (req, res) => {
    const isVercelCron = req.headers['x-vercel-cron'] === '1';
    const secret = process.env.CRON_SECRET;
    const secretOk = Boolean(secret && typeof req.query.secret === 'string' && req.query.secret === secret);
    if (!isVercelCron && !secretOk) {
      return res.status(401).send('Unauthorized');
    }
    try {
      const result = await markPastScheduledAppointmentsAsNoShow();
      return res.json({ ok: true, ...result });
    } catch (e) {
      console.error('[cron/appointment-status]', e);
      return res.status(500).json({ ok: false });
    }
  });

  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.post('/auth/login', authLogin);
  app.post('/auth/signup', authSignup);
  app.post('/auth/forgot-password', authForgotPassword);
  app.post('/auth/verify-reset-token', authVerifyResetToken);
  app.post('/auth/reset-password', authResetPassword);
  app.post('/auth/refresh-token', authRefreshToken);
  app.post('/check-email', checkEmail);
  app.post('/check-username', checkUsername);
  app.post('/public/locations-by-postcode', publicLocationsByPostcode);

  return app;
}

export function createApp() {
  const core = buildCoreApp();
  if (process.env.VERCEL !== '1') {
    return core;
  }

  const root = express();
  root.use((req, res, next) => {
    const u = req.url || '/';
    if (u === '/api' || u.startsWith('/api/')) {
      req.url = u.slice(4) || '/';
    }
    next();
  });
  root.use(core);
  return root;
}
