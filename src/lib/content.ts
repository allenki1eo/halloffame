import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import type { CategorySlug, Profile, ProfileStatus } from "@/lib/types";

const profilesPath = path.join(process.cwd(), "data", "profiles.json");

function readProfiles(): Profile[] {
  const raw = fs.readFileSync(profilesPath, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("data/profiles.json must be an array.");
  }
  return parsed as Profile[];
}

export const getAllProfiles = cache(readProfiles);

export function getPublishedProfiles() {
  return getAllProfiles().filter((profile) => profile.status === "published");
}

export function getProfile(slug: string) {
  return getAllProfiles().find((profile) => profile.slug === slug) ?? null;
}

export function getPublishedProfile(slug: string) {
  const profile = getProfile(slug);
  if (!profile || profile.status !== "published") return null;
  return profile;
}

export function getPublishedByCategory(slug: CategorySlug) {
  return getPublishedProfiles().filter((profile) => profile.category === slug);
}

export function profilesUpdatedAt() {
  return fs.statSync(profilesPath).mtime;
}

export function updateProfileStatus(slug: string, status: ProfileStatus) {
  const profiles = readProfiles();
  const index = profiles.findIndex((profile) => profile.slug === slug);
  if (index === -1) return null;
  const current = profiles[index];
  if (!current) return null;
  const next = { ...current, status };
  profiles[index] = next;
  const payload = `${JSON.stringify(profiles, null, 2)}\n`;
  const tempPath = `${profilesPath}.tmp`;
  fs.writeFileSync(tempPath, payload, "utf8");
  fs.renameSync(tempPath, profilesPath);
  return next;
}
