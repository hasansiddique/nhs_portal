"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const appointmentStatusCron_1 = require("./cron/appointmentStatusCron");
const app = (0, app_1.createApp)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000;
app.listen(port, () => {
    console.log(`NHS API (tRPC + REST auth) listening on http://localhost:${port}`);
    if (process.env.VERCEL === '1') {
        console.log('[boot] VERCEL=1 — skipping in-process appointment cron (use Vercel Cron → GET /api/cron/appointment-status)');
        return;
    }
    (0, appointmentStatusCron_1.startAppointmentStatusCron)();
});
//# sourceMappingURL=main.js.map