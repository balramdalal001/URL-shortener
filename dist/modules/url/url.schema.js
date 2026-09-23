"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortCodeSchema = exports.createUrlSchema = void 0;
const zod_1 = require("zod");
exports.createUrlSchema = zod_1.z.object({
    url: zod_1.z.string().url()
});
exports.shortCodeSchema = zod_1.z.object({
    code: zod_1.z.string().regex(/^[A-Za-z0-9_-]+$/)
});
//# sourceMappingURL=url.schema.js.map