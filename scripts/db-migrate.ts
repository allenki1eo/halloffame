import { createClient } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    console.error(
      "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before migrating. Without them, the site keeps reading data/profiles.json.",
    );
    process.exit(1);
  }

  const sqlPath = path.join(process.cwd(), "drizzle", "0000_phase1.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  const client = createClient({ url, authToken });
  await client.execute("PRAGMA foreign_keys = ON");
  await client.executeMultiple(sql);
  console.log("Applied drizzle/0000_phase1.sql");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Migration failed.";
  console.error(message);
  process.exit(1);
});
