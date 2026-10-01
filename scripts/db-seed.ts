import { seedProfiles } from "../src/lib/db/seed";

async function main() {
  if (process.env.ALLOW_DEMO_SEED !== "1") {
    console.error(
      "Refusing to load the fictional pages. Set ALLOW_DEMO_SEED=1 only on a local database. Do not seed production.",
    );
    process.exit(1);
  }

  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    console.error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before seeding. This command does not change the public site by itself.");
    process.exit(1);
  }

  const count = await seedProfiles();
  console.log(`Seeded ${count} fictional people from data/demo-profiles.json. Leave them off the production database.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed failed.";
  console.error(message);
  process.exit(1);
});
