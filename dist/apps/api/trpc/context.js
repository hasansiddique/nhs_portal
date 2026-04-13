"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const JWT_SECRET = process.env.JWT_SECRET || 'nhs-portal-secret-change-in-production';
const createContext = ({ req, res }) => {
    let user = req.user;
    if (!user) {
        const authHeader = req.headers.authorization;
        const raw = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : authHeader;
        const token = raw === null || raw === void 0 ? void 0 : raw.trim();
        if (token) {
            try {
                const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                if (payload.sub && payload.email) {
                    user = {
                        id: String(payload.sub),
                        email: String(payload.email),
                        role: typeof payload.role === 'string' ? payload.role : 'PATIENT',
                        patientId: typeof payload.patientId === 'string' ? payload.patientId : undefined,
                        practitionerId: typeof payload.practitionerId === 'string' ? payload.practitionerId : undefined,
                    };
                }
            }
            catch (_a) {
                user = undefined;
            }
        }
    }
    return {
        prisma: prisma_1.prisma,
        req,
        res,
        user,
    };
};
exports.createContext = createContext;
//# sourceMappingURL=context.js.map