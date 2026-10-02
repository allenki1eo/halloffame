import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "@/lib/db/schema";

export type Database = LibSQLDatabase<typeof schema>;

/**
 * `libsql://` opens a WebSocket that is held open between requests. On serverless
 * hosts the function is frozen between invocations, the socket dies underneath the
 * cached client, and the next query fails (a save errors, a traffic beacon is lost).
 * Plain HTTPS keeps every query stateless, which is what Turso recommends there.
 */
function httpUrl(url: string) {
  return url.replace(/^libsql:\/\//i, "https://").replace(/^wss:\/\//i, "https://").replace(/^ws:\/\//i, "http://");
}

export function tursoConfig() {
  const url = process.env.TURSO_DATABASE_URL?.trim() ?? "";
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim() ?? "";
  if (!url || !authToken) return null;
  return { url: httpUrl(url), authToken };
}

export function tursoConfigured() {
  return tursoConfig() !== null;
}

let database: Database | null = null;
let databaseKey = "";

export async function getDb() {
  const config = tursoConfig();
  if (!config) return null;
  const key = `${config.url}\n${config.authToken}`;
  if (!database || databaseKey !== key) {
    database = drizzle(createClient(config), { schema });
    databaseKey = key;
  }
  return database;
}
