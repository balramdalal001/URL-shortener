import "dotenv/config";
import { app } from "./app";
import redisClient from "./config/redis";
import { runMigrations } from "./config/migrations";

const PORT = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(PORT) || PORT <= 0 || PORT > 65535) {
  throw new Error("Invalid PORT environment variable");
}

async function startServer() {
  try {
    await runMigrations();
    console.log("Database migrations complete");

    await redisClient.connect();

    console.log("Redis connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
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

