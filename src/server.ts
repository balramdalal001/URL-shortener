// import { app } from "./app";
// import { env } from "./config/env";
// import { redis } from "./config/redis";

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

import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
	console.log(`URL shortener listening on ${env.BASE_URL}`);
});

