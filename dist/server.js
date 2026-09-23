"use strict";
// import { app } from "./app";
// import { env } from "./config/env";
// import { redis } from "./config/redis";
Object.defineProperty(exports, "__esModule", { value: true });
// async function startServer(): Promise<void> {
//   await redis.connect();
//   app.listen(env.PORT, () => {
//     console.log(`URL shortener listening on ${env.BASE_URL}`);
//   });
// }
// startServer().catch((error) => {
//   console.error("Failed to start server", error);
//   process.exitCode = 1;
// });
const app_1 = require("./app");
const env_1 = require("./config/env");
app_1.app.listen(env_1.env.PORT, () => {
    console.log(`URL shortener listening on ${env_1.env.BASE_URL}`);
});
//# sourceMappingURL=server.js.map