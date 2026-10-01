import { createClient } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    console.error(
      "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before migrating. Production stays empty until those variables are set and this command has been run.",
    );
    process.exit(1);
  }

  const directory = path.join(process.cwd(), "drizzle");
  const files = fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".sql"))
    .sort();
  const client = createClient({ url, authToken });
  await client.execute("PRAGMA foreign_keys = ON");
  for (const file of files) {
    const sql = fs.readFileSync(path.join(directory, file), "utf8");
    const statements = sql
      .split(/;\s*(?:\r?\n|$)/)
      .map((statement) => statement.trim())
      .filter(Boolean);
    for (const statement of statements) {
      try {
        await client.execute(statement);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (/duplicate column name/i.test(message)) continue;
        throw error;
      }
    }
    console.log(`Applied drizzle/${file}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Migration failed.";
  console.error(message);
  process.exit(1);
});
