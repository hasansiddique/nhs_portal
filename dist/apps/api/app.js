"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const tslib_1 = require("tslib");
require("dotenv/config");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_2 = require("@trpc/server/adapters/express");
const routers_1 = require("./routers");
const context_1 = require("./trpc/context");
const auth_1 = require("./routes/auth");
const auth_2 = require("./routes/auth");
const publicLocations_1 = require("./routes/publicLocations");
const appointmentStatusCron_1 = require("./cron/appointmentStatusCron");
/**
 * Express app with all HTTP routes (no `listen`).
 * On Vercel (`VERCEL=1`), wraps the app so requests under `/api/*` are forwarded with the `/api` prefix stripped
 * (browser + static hosting use `/api/trpc`, `/api/auth/...`).
 */
function buildCoreApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: true, credentials: true }));
    app.use(express_1.default.json());
    /**
     * Scheduled job entry for Vercel Cron (no in-process `setInterval` on serverless).
     * Vercel sends `x-vercel-cron: 1`. Optional `?secret=` matches `CRON_SECRET` for manual runs.
     */
    app.get('/cron/appointment-status', (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const isVercelCron = req.headers['x-vercel-cron'] === '1';
        const secret = process.env.CRON_SECRET;
        const secretOk = Boolean(secret && typeof req.query.secret === 'string' && req.query.secret === secret);
        if (!isVercelCron && !secretOk) {
            return res.status(401).send('Unauthorized');
        }
        try {
            const result = yield (0, appointmentStatusCron_1.markPastScheduledAppointmentsAsNoShow)();
            return res.json(Object.assign({ ok: true }, result));
        }
        catch (e) {
            console.error('[cron/appointment-status]', e);
            return res.status(500).json({ ok: false });
        }
    }));
    app.use('/trpc', (0, express_2.createExpressMiddleware)({
        router: routers_1.appRouter,
        createContext: context_1.createContext,
    }));
    app.post('/auth/login', auth_1.authLogin);
    app.post('/auth/signup', auth_1.authSignup);
    app.post('/auth/forgot-password', auth_1.authForgotPassword);
    app.post('/auth/verify-reset-token', auth_1.authVerifyResetToken);
    app.post('/auth/reset-password', auth_1.authResetPassword);
    app.post('/auth/refresh-token', auth_1.authRefreshToken);
    app.post('/check-email', auth_2.checkEmail);
    app.post('/check-username', auth_2.checkUsername);
    app.post('/public/locations-by-postcode', publicLocations_1.publicLocationsByPostcode);
    return app;
}
function createApp() {
    const core = buildCoreApp();
    if (process.env.VERCEL !== '1') {
        return core;
    }
    const root = (0, express_1.default)();
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
//# sourceMappingURL=app.js.map