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
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const postcode_1 = require("../lib/postcode");
const prisma_1 = require("../lib/prisma");
const JWT_SECRET = process.env.JWT_SECRET || 'nhs-portal-secret-change-in-production';
const SALT_ROUNDS = 10;
const RESET_TOKEN_EXPIRY_HOURS = 24;
function generateDemoNhsNumber() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        for (let attempt = 0; attempt < 5; attempt += 1) {
            const candidate = String(Date.now() + Math.floor(Math.random() * 1000)).slice(-10);
            const existing = yield prisma_1.prisma.patient.findUnique({
                where: { nhsNumber: candidate },
                select: { id: true },
            });
            if (!existing) {
                return candidate;
            }
        }
        return String(Date.now()).padStart(10, '0').slice(-10);
    });
}
function sendError(res, status, messages) {
    res.status(status).json({ messages: messages });
}
function toUserPayload(user) {
    var _a, _b, _c, _d, _e, _f, _g;
    const displayName = user.name || user.email;
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        displayName,
        username: displayName,
        role: user.role,
        patientId: (_a = user.patient) === null || _a === void 0 ? void 0 : _a.id,
        practitionerId: (_b = user.practitioner) === null || _b === void 0 ? void 0 : _b.id,
        homeLocationId: (_d = (_c = user.patient) === null || _c === void 0 ? void 0 : _c.locationId) !== null && _d !== void 0 ? _d : undefined,
        workLocationIds: (_g = (_f = (_e = user.practitioner) === null || _e === void 0 ? void 0 : _e.practitionerLocations) === null || _f === void 0 ? void 0 : _f.map((l) => l.locationId)) !== null && _g !== void 0 ? _g : undefined,
    };
}
function authLogin(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const body = (req.body || {});
            const username = String((_b = (_a = body.username) !== null && _a !== void 0 ? _a : body.email) !== null && _b !== void 0 ? _b : '').trim();
            const password = body.password != null ? String(body.password) : '';
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
                include: {
                    patient: { select: { id: true, locationId: true } },
                    practitioner: {
                        select: {
                            id: true,
                            practitionerLocations: { select: { locationId: true } },
                        },
                    },
                },
            });
            if (!user) {
                sendError(res, 401, { error: 'Invalid email or password' });
                return;
            }
            const valid = yield bcryptjs_1.default.compare(password, user.passwordHash);
            if (!valid) {
                sendError(res, 401, { error: 'Invalid email or password' });
                return;
            }
            const token = jsonwebtoken_1.default.sign(Object.assign(Object.assign({ sub: user.id, email: user.email, role: user.role }, (((_c = user.patient) === null || _c === void 0 ? void 0 : _c.id) ? { patientId: user.patient.id } : {})), (((_d = user.practitioner) === null || _d === void 0 ? void 0 : _d.id) ? { practitionerId: user.practitioner.id } : {})), JWT_SECRET, { expiresIn: '7d' });
            res.json({
                token,
                user: toUserPayload(user),
            });
        }
        catch (e) {
            console.error('authLogin', e);
            const msg = e instanceof Error ? e.message : String(e);
            if (/Can't reach database server|P1001|ECONNREFUSED|ENOTFOUND|database server/i.test(msg)) {
                sendError(res, 503, {
                    error: 'Database unreachable. Set DATABASE_URL in a `.env` file at the repository root (or in your environment), ensure PostgreSQL is running, then restart the API.',
                });
                return;
            }
            sendError(res, 500, { error: 'Login failed' });
        }
    });
}
function authSignup(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const body = (req.body || {});
            const email = String((_a = body.email) !== null && _a !== void 0 ? _a : '').trim().toLowerCase();
            const username = String((_c = (_b = body.username) !== null && _b !== void 0 ? _b : body.email) !== null && _c !== void 0 ? _c : '').trim();
            const password = body.password != null ? String(body.password) : '';
            const confirmPassword = body.confirmPassword != null ? String(body.confirmPassword) : '';
            const roleRaw = String((_d = body.role) !== null && _d !== void 0 ? _d : '').trim().toUpperCase();
            const role = roleRaw === 'PRACTITIONER' ? 'PRACTITIONER' : 'PATIENT';
            const postcodeRaw = String((_e = body.postcode) !== null && _e !== void 0 ? _e : '').trim();
            const postcodeNorm = (0, postcode_1.normalizeUkPostcode)(postcodeRaw);
            const locationIds = Array.isArray(body.locationIds)
                ? [...new Set(body.locationIds.map((id) => String(id !== null && id !== void 0 ? id : '').trim()).filter(Boolean))]
                : [];
            if (!email || !password) {
                sendError(res, 400, { error: 'Email and password are required' });
                return;
            }
            if (confirmPassword && confirmPassword !== password) {
                sendError(res, 400, { error: 'Password and confirm password do not match' });
                return;
            }
            if (!postcodeNorm || postcodeNorm.length < 2) {
                sendError(res, 400, { error: 'Please enter a valid postcode' });
                return;
            }
            if (locationIds.length === 0) {
                sendError(res, 400, { error: 'Select at least one clinic location' });
                return;
            }
            const existing = yield prisma_1.prisma.user.findUnique({ where: { email } });
            if (existing) {
                sendError(res, 400, { error: 'Email is already registered' });
                return;
            }
            const locations = yield prisma_1.prisma.location.findMany({
                where: { id: { in: locationIds } },
                select: { id: true, postcode: true },
            });
            if (locations.length !== locationIds.length) {
                sendError(res, 400, { error: 'One or more selected clinics are invalid' });
                return;
            }
            for (const loc of locations) {
                if (!(0, postcode_1.locationMatchesPostcodeFilter)(postcodeRaw, loc.postcode)) {
                    sendError(res, 400, { error: 'Selected clinics do not match the postcode you entered' });
                    return;
                }
            }
            const passwordHash = yield bcryptjs_1.default.hash(password, SALT_ROUNDS);
            const user = yield prisma_1.prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    name: username || email,
                    role: role,
                },
            });
            if (role === 'PRACTITIONER') {
                const practitioner = yield prisma_1.prisma.practitioner.create({
                    data: {
                        userId: user.id,
                        title: 'Dr',
                    },
                    select: { id: true },
                });
                yield prisma_1.prisma.practitionerLocation.createMany({
                    data: locationIds.map((locationId) => ({
                        practitionerId: practitioner.id,
                        locationId,
                    })),
                    skipDuplicates: true,
                });
            }
            else {
                yield prisma_1.prisma.patient.create({
                    data: {
                        userId: user.id,
                        nhsNumber: yield generateDemoNhsNumber(),
                        dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
                        locationId: locationIds[0],
                        postcode: postcodeRaw,
                    },
                });
            }
            res.json({ message: 'Account created successfully. You can sign in now.' });
        }
        catch (e) {
            console.error('authSignup', e);
            sendError(res, 500, { error: 'Sign up failed' });
        }
    });
}
/**
 * Check if email is already used by an existing user (User table).
 * Returns status: true if available, status: false if already taken or invalid.
 * Form should show error when status is false and allow create account when status is true.
 */
function checkEmail(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const body = (req.body || {});
            const email = String((_a = body.email) !== null && _a !== void 0 ? _a : '').trim().toLowerCase();
            if (!email) {
                return res.status(200).json({ status: false, message: 'Email is required' });
            }
            const existing = yield prisma_1.prisma.user.findUnique({ where: { email } });
            return res.status(200).json({
                status: !existing,
                message: existing ? 'Email is already taken' : 'Email is available',
            });
        }
        catch (e) {
            console.error('checkEmail', e);
            return res.status(500).json({ status: false, message: 'Validation failed' });
        }
    });
}
/**
 * Check if username (User.name) is already used by an existing user (User table).
 * Returns status: true if available, status: false if already taken or invalid.
 * Form should show error when status is false and allow create account when status is true.
 */
function checkUsername(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const body = (req.body || {});
            const username = String((_a = body.username) !== null && _a !== void 0 ? _a : '').trim();
            if (!username) {
                return res.status(200).json({ status: false, message: 'Username is required' });
            }
            const existing = yield prisma_1.prisma.user.findFirst({
                where: { name: username },
            });
            return res.status(200).json({
                status: !existing,
                message: existing ? 'Username is already taken' : 'Username is available',
            });
        }
        catch (e) {
            console.error('checkUsername', e);
            return res.status(500).json({ status: false, message: 'Validation failed' });
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
            const passwordHash = yield bcryptjs_1.default.hash(password, SALT_ROUNDS);
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