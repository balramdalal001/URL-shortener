import { promises as fs } from "node:fs";
import path from "node:path";
import { database } from "./database";

const migrationsDirectory = path.resolve(__dirname, "../../migrations");

// export async function runMigrations(): Promise<void> {
//   const client = await database.connect();

//   try {
//     await client.query("BEGIN");
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS schema_migrations (
//         filename VARCHAR(255) PRIMARY KEY,
//         applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
//       )
//     `);

//     const filenames = (await fs.readdir(migrationsDirectory))
//       .filter((filename) => filename.endsWith(".sql"))
//       .sort();

//     for (const filename of filenames) {
//       const applied = await client.query(
//         "SELECT 1 FROM schema_migrations WHERE filename = $1",
//         [filename]
//       );

//       if (applied.rowCount) continue;

//       const sql = await fs.readFile(path.join(migrationsDirectory, filename), "utf8");
//       await client.query(sql);
//       await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [filename]);
//       console.log(`Migration applied: ${filename}`);
//     }

//     await client.query("COMMIT");
//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// }

export async function runMigrations(): Promise<void> {
  const client = await database.connect();

  

  try {
    console.log("Migration directory:", migrationsDirectory);

    const filenames = (await fs.readdir(migrationsDirectory))
      .filter((filename) => filename.endsWith(".sql"))
      .sort();

    console.log("Migration files:", filenames);

    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    for (const filename of filenames) {
      const applied = await client.query(
        "SELECT 1 FROM schema_migrations WHERE filename = $1",
        [filename]
      );

      console.log("Already applied:", applied.rowCount);

      if (applied.rowCount) {
        console.log(`Migration already applied: ${filename}`);
        continue;
      }

      const sql = await fs.readFile(
        path.join(migrationsDirectory, filename),
        "utf8"
      );

      console.log(`Running migration: ${filename}`);

      await client.query(sql);

      await client.query(
        "INSERT INTO schema_migrations (filename) VALUES ($1)",
        [filename]
      );

      console.log(`Migration applied: ${filename}`);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}