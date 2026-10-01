export class DeskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeskError";
  }
}

export function deskErrorMessage(error: unknown) {
  if (error instanceof DeskError) return error.message;
  const raw = error instanceof Error ? error.message : "";
  if (/blob/i.test(raw)) {
    return "The file could not be stored. Check BLOB_READ_WRITE_TOKEN, or paste a link.";
  }
  if (/libsql|turso|fetch failed|unauthorized|ECONN|ENOTFOUND|401|403/i.test(raw)) {
    return "The database could not be reached. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.";
  }
  return "The desk could not save that change.";
}

export const missingDatabaseMessage =
  "Creating and editing needs TURSO_DATABASE_URL and TURSO_AUTH_TOKEN, then npm run db:migrate. Production does not publish the fictional pages.";
