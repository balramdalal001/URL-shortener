import "dotenv/config";
import { app } from "./app";
import redisClient from "./config/redis";
import { runMigrations } from "./config/migrations";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await runMigrations();
    console.log("Database migrations complete");

    await redisClient.connect();

    console.log("Redis connected");

    app.listen(PORT, () => {
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

