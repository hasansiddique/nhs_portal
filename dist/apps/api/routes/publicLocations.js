"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicLocationsByPostcode = publicLocationsByPostcode;
const tslib_1 = require("tslib");
const postcode_1 = require("../lib/postcode");
const prisma_1 = require("../lib/prisma");
function sendError(res, status, messages) {
    res.status(status).json({ messages });
}
/**
 * Public lookup for registration: list clinic locations that match the given postcode
 * (prefix / outward matching against Location.postcode).
 */
function publicLocationsByPostcode(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const body = (req.body || {});
            const raw = String((_a = body.postcode) !== null && _a !== void 0 ? _a : '').trim();
            const norm = (0, postcode_1.normalizeUkPostcode)(raw);
            if (norm.length < 2) {
                return res.json({ locations: [] });
            }
            const all = yield prisma_1.prisma.location.findMany({
                orderBy: { name: 'asc' },
                select: { id: true, name: true, address: true, postcode: true },
            });
            const matches = all.filter((l) => (0, postcode_1.locationMatchesPostcodeFilter)(raw, l.postcode)).slice(0, 80);
            return res.json({ locations: matches });
        }
        catch (e) {
            console.error('publicLocationsByPostcode', e);
            sendError(res, 500, { error: 'Lookup failed' });
        }
    });
}
//# sourceMappingURL=publicLocations.js.map