import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1).default("postgresql://localhost:5432/balram"),
  PGUSER: z.string().min(1).default("postgres"),
  PGPASSWORD: z.string().min(1),
  PGHOST: z.string().min(1).default("localhost"),
  PGPORT: z.coerce.number().int().positive().default(5433),
  PGDATABASE: z.string().min(1).default("balram"),
//   REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  BASE_URL: z.string().url().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(1).default("balram"),
  JWT_REFRESH_SECRET : z.string().min(1).default("refresh_balram")
});

export const env = envSchema.parse(process.env);
