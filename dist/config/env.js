"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    DATABASE_URL: zod_1.z.string().min(1).default("postgresql://postgres:localdev@localhost:5433/balram"),
    PGUSER: zod_1.z.string().min(1).default("postgres"),
    PGPASSWORD: zod_1.z.string().min(1),
    PGHOST: zod_1.z.string().min(1).default("localhost"),
    PGPORT: zod_1.z.coerce.number().int().positive().default(5433),
    PGDATABASE: zod_1.z.string().min(1).default("balram"),
    REDIS_URL: zod_1.z.string().min(1).default("redis://localhost:6379"),
    BASE_URL: zod_1.z.string().url().default("http://localhost:3000"),
    JWT_SECRET: zod_1.z.string().min(1).default("balram"),
    JWT_REFRESH_SECRET: zod_1.z.string().min(1).default("refresh_balram")
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map