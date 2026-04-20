"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUkPostcode = normalizeUkPostcode;
exports.outwardUkPostcode = outwardUkPostcode;
exports.locationMatchesPostcodeFilter = locationMatchesPostcodeFilter;
/** Normalise UK-style postcodes for comparison (spaces removed, uppercased). */
function normalizeUkPostcode(raw) {
    return String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/\s+/g, '')
        .toUpperCase();
}
/**
 * Outward code = all but last 3 characters when length > 3 (standard UK inward is 3 chars).
 * For short / partial input, the whole string is treated as a prefix filter.
 */
function outwardUkPostcode(normalized) {
    if (normalized.length <= 3)
        return normalized;
    return normalized.slice(0, -3);
}
/** Whether a clinic postcode matches what the user typed (full, partial, or outward match). */
function locationMatchesPostcodeFilter(userRaw, locationPostcode) {
    const u = normalizeUkPostcode(userRaw);
    if (!u)
        return false;
    const s = normalizeUkPostcode(locationPostcode !== null && locationPostcode !== void 0 ? locationPostcode : '');
    if (!s)
        return false;
    if (u === s)
        return true;
    if (s.startsWith(u))
        return true;
    if (u.startsWith(s))
        return true;
    const uOut = outwardUkPostcode(u);
    const sOut = outwardUkPostcode(s);
    if (uOut.length >= 2 && sOut.length >= 2) {
        if (uOut === sOut)
            return true;
        if (sOut.startsWith(uOut) || uOut.startsWith(sOut))
            return true;
    }
    return false;
}
//# sourceMappingURL=postcode.js.map