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
import { startAppointmentStatusCron } from './cron/appointmentStatusCron';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

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

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log(`NHS API (tRPC + REST auth) listening on http://localhost:${port}`);
  startAppointmentStatusCron();
});
