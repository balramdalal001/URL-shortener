"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
exports.database = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    user: env_1.env.PGUSER,
    password: env_1.env.PGPASSWORD,
    host: env_1.env.PGHOST,
    port: env_1.env.PGPORT,
    database: env_1.env.PGDATABASE
});
//# sourceMappingURL=database.js.map