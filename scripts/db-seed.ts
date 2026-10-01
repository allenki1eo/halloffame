import { seedProfiles } from "../src/lib/db/seed";

async function main() {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    console.error(
      "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before seeding. Without them, the site keeps reading data/profiles.json and this command does nothing.",
    );
    process.exit(1);
  }

  const count = await seedProfiles();
  console.log(`Seeded ${count} people from data/profiles.json.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed failed.";
  console.error(message);
  process.exit(1);
});
