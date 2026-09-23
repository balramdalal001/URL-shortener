"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.authLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // Block IP after 5 failed/successive attempts per hour
    message: {
        status: 429,
        message: 'Too many login attempts. Please try again in an hour.',
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
//# sourceMappingURL=authLimiter.js.map