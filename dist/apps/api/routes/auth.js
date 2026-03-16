"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLogin = authLogin;
exports.authSignup = authSignup;
exports.checkEmail = checkEmail;
exports.checkUsername = checkUsername;
exports.authForgotPassword = authForgotPassword;
exports.authVerifyResetToken = authVerifyResetToken;
exports.authResetPassword = authResetPassword;
exports.authRefreshToken = authRefreshToken;
const tslib_1 = require("tslib");
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const prisma_1 = require("../lib/prisma");
const JWT_SECRET = process.env.JWT_SECRET || 'nhs-portal-secret-change-in-production';
const SALT_ROUNDS = 10;
const RESET_TOKEN_EXPIRY_HOURS = 24;
function sendError(res, status, messages) {
    res.status(status).json({ messages: messages });
}
function toUserPayload(user) {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        displayName: user.name || user.email,
        role: user.role,
    };
}
function authLogin(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const body = req.body;
            const username = ((_b = (_a = body.username) !== null && _a !== void 0 ? _a : body.email) !== null && _b !== void 0 ? _b : '').trim();
            const password = body.password;
            if (!username || !password) {
                sendError(res, 400, { error: 'Username and password are required' });
                return;
            }
            const email = username.includes('@') ? username.trim().toLowerCase() : null;
            if (!email) {
                sendError(res, 401, { error: 'Invalid email or password' });
                return;
            }
            const user = yield prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                sendError(res, 401, { error: 'Invalid email or password' });
                return;
            }
            const valid = yield bcrypt_1.default.compare(password, user.passwordHash);
            if (!valid) {
                sendError(res, 401, { error: 'Invalid email or password' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
            res.json({
                token,
                user: toUserPayload(user),
            });
        }
        catch (e) {
            console.error('authLogin', e);
            sendError(res, 500, { error: 'Login failed' });
        }
    });
}
function authSignup(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const email = (body.email || '').trim().toLowerCase();
            const username = (body.username || body.email || '').trim();
            const password = body.password;
            if (!email || !password) {
                sendError(res, 400, { error: 'Email and password are required' });
                return;
            }
            const existing = yield prisma_1.prisma.user.findUnique({ where: { email } });
            if (existing) {
                sendError(res, 400, { error: 'Email is already registered' });
                return;
            }
            const passwordHash = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
            yield prisma_1.prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    name: username || email,
                    role: 'PATIENT',
                },
            });
            res.json({ message: 'Account created successfully. You can sign in now.' });
        }
        catch (e) {
            console.error('authSignup', e);
            sendError(res, 500, { error: 'Sign up failed' });
        }
    });
}
function checkEmail(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const email = (body.email || '').trim().toLowerCase();
            if (!email) {
                res.json({ status: false, message: 'Email is required' });
                return;
            }
            const existing = yield prisma_1.prisma.user.findUnique({ where: { email } });
            res.json({ status: !existing, message: existing ? 'Email is already taken' : 'Email is available' });
        }
        catch (e) {
            console.error('checkEmail', e);
            res.status(500).json({ status: false, message: 'Validation failed' });
        }
    });
}
function checkUsername(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const username = (body.username || '').trim();
            if (!username) {
                res.json({ status: false, message: 'Username is required' });
                return;
            }
            const existing = yield prisma_1.prisma.user.findFirst({
                where: { name: username },
            });
            res.json({ status: !existing, message: existing ? 'Username is already taken' : 'Username is available' });
        }
        catch (e) {
            console.error('checkUsername', e);
            res.status(500).json({ status: false, message: 'Validation failed' });
        }
    });
}
function authForgotPassword(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const email = (body.email || '').trim().toLowerCase();
            if (!email) {
                sendError(res, 400, { error: 'Email is required' });
                return;
            }
            const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                res.json({ message: 'If that email is registered, you will receive a reset link.' });
                return;
            }
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
            yield prisma_1.prisma.user.update({
                where: { id: user.id },
                data: { resetToken, resetTokenExpiresAt },
            });
            // In production you would send an email with a link like:
            // ${redirectUrl}?token=${resetToken}
            // For now we just return success; you can add nodemailer later.
            res.json({ message: 'If that email is registered, you will receive a reset link.' });
        }
        catch (e) {
            console.error('authForgotPassword', e);
            sendError(res, 500, { error: 'Request failed' });
        }
    });
}
function authVerifyResetToken(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const token = (body.reset_token || '').trim();
            if (!token) {
                res.json({ status: false });
                return;
            }
            const user = yield prisma_1.prisma.user.findFirst({
                where: {
                    resetToken: token,
                    resetTokenExpiresAt: { gt: new Date() },
                },
            });
            res.json({ status: !!user });
        }
        catch (e) {
            console.error('authVerifyResetToken', e);
            res.json({ status: false });
        }
    });
}
function authResetPassword(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const token = (body.reset_token || '').trim();
            const password = body.password;
            if (!token || !password) {
                sendError(res, 400, { error: 'Token and password are required' });
                return;
            }
            const user = yield prisma_1.prisma.user.findFirst({
                where: {
                    resetToken: token,
                    resetTokenExpiresAt: { gt: new Date() },
                },
            });
            if (!user) {
                sendError(res, 400, { error: 'Invalid or expired reset link' });
                return;
            }
            const passwordHash = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
            yield prisma_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    passwordHash,
                    resetToken: null,
                    resetTokenExpiresAt: null,
                },
            });
            res.json({ message: 'Password updated successfully' });
        }
        catch (e) {
            console.error('authResetPassword', e);
            sendError(res, 500, { error: 'Reset failed' });
        }
    });
}
function authRefreshToken(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const userId = body.user_id;
            const email = (body.email || '').trim().toLowerCase();
            if (!userId || !email) {
                sendError(res, 400, { error: 'user_id and email are required' });
                return;
            }
            const user = yield prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user || user.email !== email) {
                sendError(res, 401, { error: 'Invalid refresh request' });
                return;
            }
            const newToken = jsonwebtoken_1.default.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
            res.json({ newToken });
        }
        catch (e) {
            console.error('authRefreshToken', e);
            sendError(res, 500, { error: 'Refresh failed' });
        }
    });
}
//# sourceMappingURL=auth.js.map