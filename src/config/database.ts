import { Pool } from "pg";
import { env } from "./env";

export const database = new Pool({
	connectionString: env.DATABASE_URL,
	user: env.PGUSER,
	password: env.PGPASSWORD,
	host: env.PGHOST,
	port: env.PGPORT,
	database: env.PGDATABASE
});
