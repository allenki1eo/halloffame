import { replaceSeedPerson } from "@/lib/db/people";
import { readDemoProfiles } from "@/lib/profiles-file";

export async function seedProfiles() {
  const profiles = readDemoProfiles();
  for (const [index, profile] of profiles.entries()) {
    await replaceSeedPerson(profile, index);
  }
  return profiles.length;
}
