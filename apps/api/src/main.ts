import { createApp } from './app';
import { startAppointmentStatusCron } from './cron/appointmentStatusCron';

const app = createApp();
const port = process.env.PORT ?? 4000;

app.listen(port, () => {
  console.log(`NHS API (tRPC + REST auth) listening on http://localhost:${port}`);
  if (process.env.VERCEL === '1') {
    console.log('[boot] VERCEL=1 — skipping in-process appointment cron (use Vercel Cron → GET /api/cron/appointment-status)');
    return;
  }
  startAppointmentStatusCron();
});
