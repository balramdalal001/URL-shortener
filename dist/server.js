"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const redis_1 = __importDefault(require("./config/redis"));
const migrations_1 = require("./config/migrations");
const PORT = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(PORT) || PORT <= 0 || PORT > 65535) {
    throw new Error("Invalid PORT environment variable");
}
async function startServer() {
    try {
        await (0, migrations_1.runMigrations)();
        console.log("Database migrations complete");
        await redis_1.default.connect();
        console.log("Redis connected");
        app_1.app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
// import { app } from "./app";
// import { env } from "./config/env";
// app.listen(env.PORT, () => {
// 	console.log(`URL shortener listening on ${env.BASE_URL}`);
// });
//# sourceMappingURL=server.js.map