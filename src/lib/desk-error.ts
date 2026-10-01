export class DeskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeskError";
  }
}

export type DatabaseFailure = "credentials" | "unreachable";

export const databaseCredentialsMessage =
  "The database rejected these credentials. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.";

export const databaseUnreachableMessage =
  "The database could not be reached. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.";

function errorChain(error: unknown) {
  const chain: object[] = [];
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    chain.push(current);
    current = "cause" in current ? (current as { cause?: unknown }).cause : undefined;
  }
  return chain;
}

function statusOf(value: object) {
  if (!("status" in value)) return null;
  const status = (value as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

export function databaseFailure(error: unknown): DatabaseFailure | null {
  const chain = errorChain(error);
  if (chain.length === 0) return null;
  const text = chain
    .map((item) => ("message" in item && typeof item.message === "string" ? item.message : ""))
    .filter(Boolean)
    .join(" ");
  const status = chain.map(statusOf).find((code) => code !== null) ?? null;
  if (status === 401 || status === 403) return "credentials";
  if (/HTTP status 401|HTTP status 403|unauthorized|invalid jwt|jwt/i.test(text)) return "credentials";
  if (status === 400 && /HTTP status 400/i.test(text) && !/sqlite|syntax|no such/i.test(text)) return "credentials";
  if (/libsql|turso|hrana|fetch failed|ECONN|ENOTFOUND|SERVER_ERROR|no such table|no such column/i.test(text)) {
    return "unreachable";
  }
  return null;
}

export function deskErrorMessage(error: unknown) {
  if (error instanceof DeskError) return error.message;
  const raw = error instanceof Error ? error.message : "";
  if (/blob/i.test(raw) && databaseFailure(error) === null) {
    return "The file could not be stored. Check BLOB_READ_WRITE_TOKEN, or paste a link.";
  }
  const failure = databaseFailure(error);
  if (failure === "credentials") return databaseCredentialsMessage;
  if (failure === "unreachable") return databaseUnreachableMessage;
  return "The desk could not save that change.";
}

export const missingDatabaseMessage =
  "Creating and editing needs TURSO_DATABASE_URL and TURSO_AUTH_TOKEN, then npm run db:migrate. Production does not publish the fictional pages.";
