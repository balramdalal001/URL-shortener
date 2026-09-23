"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalLimiter = void 0;
// rateLimiter.ts
const express_rate_limit_1 = require("express-rate-limit");
exports.globalLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7', // Returns rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the older `X-RateLimit-*` headers
    message: {
        status: 429,
        message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
});
//# sourceMappingURL=rateLimiter.js.map