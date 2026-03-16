"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const prisma_1 = require("../lib/prisma");
const createContext = ({ req, res }) => {
    // Optional: read token from cookie/header and resolve user
    const user = req.user;
    return {
        prisma: prisma_1.prisma,
        req,
        res,
        user,
    };
};
exports.createContext = createContext;
//# sourceMappingURL=context.js.map