import { replaceSeedPerson } from "@/lib/db/people";
import { readProfiles } from "@/lib/profiles-file";

export async function seedProfiles() {
  const profiles = readProfiles();
  for (const [index, profile] of profiles.entries()) {
    await replaceSeedPerson(profile, index);
  }
  return profiles.length;
}
