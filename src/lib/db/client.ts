import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "@/lib/db/schema";

export type Database = LibSQLDatabase<typeof schema>;

export function tursoConfig() {
  const url = process.env.TURSO_DATABASE_URL?.trim() ?? "";
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim() ?? "";
  if (!url || !authToken) return null;
  return { url, authToken };
}

export function tursoConfigured() {
  return tursoConfig() !== null;
}

let ready: Promise<Database> | null = null;

export function getDb() {
  const config = tursoConfig();
  if (!config) return null;
  if (!ready) {
    ready = openDatabase(config).catch((error: unknown) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

async function openDatabase(config: { url: string; authToken: string }) {
  const client = createClient(config);
  await client.execute("PRAGMA foreign_keys = ON");
  return drizzle(client, { schema });
}
