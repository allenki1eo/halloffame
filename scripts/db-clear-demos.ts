import { demoSlugs } from "../src/lib/demo";
import { removePerson } from "../src/lib/db/people";

async function main() {
  if (process.env.CONFIRM_CLEAR_DEMOS !== "1") {
    console.error(
      "Refusing to delete pages. Set CONFIRM_CLEAR_DEMOS=1 to remove the eight fictional slugs from this Turso database.",
    );
    process.exit(1);
  }

  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    console.error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before clearing fictional pages.");
    process.exit(1);
  }

  for (const slug of demoSlugs) {
    const name = await removePerson(slug);
    console.log(name ? `Removed ${slug}` : `No row for ${slug}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Clear failed.";
  console.error(message);
  process.exit(1);
});
