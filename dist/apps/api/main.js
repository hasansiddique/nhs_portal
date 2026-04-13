"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("dotenv/config");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_2 = require("@trpc/server/adapters/express");
const routers_1 = require("./routers");
const context_1 = require("./trpc/context");
const auth_1 = require("./routes/auth");
const auth_2 = require("./routes/auth");
const appointmentStatusCron_1 = require("./cron/appointmentStatusCron");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
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
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000;
app.listen(port, () => {
    console.log(`NHS API (tRPC + REST auth) listening on http://localhost:${port}`);
    (0, appointmentStatusCron_1.startAppointmentStatusCron)();
});
//# sourceMappingURL=main.js.map