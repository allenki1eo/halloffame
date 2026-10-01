import { cache } from "react";
import fs from "node:fs";
import { isDemoSlug, isProduction } from "@/lib/demo";
import { DeskError, missingDatabaseMessage } from "@/lib/desk-error";
import { tursoConfigured } from "@/lib/db/client";
import { findPerson, listPeople, setPersonStatus } from "@/lib/db/people";
import { demoProfilesPath, readDemoProfiles, writeDemoProfiles } from "@/lib/profiles-file";
import type { CategorySlug, Profile, ProfileStatus } from "@/lib/types";

function localShowcase(): Profile[] {
  if (isProduction()) return [];
  return readDemoProfiles();
}

export const getAllProfiles = cache(async function getAllProfiles(): Promise<Profile[]> {
  if (tursoConfigured()) return listPeople();
  return localShowcase();
});

export async function getPublishedProfiles() {
  const profiles = await getAllProfiles();
  return profiles.filter((profile) => profile.status === "published" && !(isProduction() && isDemoSlug(profile.slug)));
}

export async function getProfile(slug: string) {
  if (tursoConfigured()) return findPerson(slug);
  const profiles = await getAllProfiles();
  return profiles.find((profile) => profile.slug === slug) ?? null;
}

export async function getPublishedProfile(slug: string) {
  if (isProduction() && isDemoSlug(slug)) return null;
  const profile = await getProfile(slug);
  if (!profile || profile.status !== "published") return null;
  return profile;
}

export async function getPublishedByCategory(slug: CategorySlug) {
  const profiles = await getPublishedProfiles();
  return profiles.filter((profile) => profile.category === slug);
}

export async function profilesUpdatedAt() {
  if (!tursoConfigured()) {
    if (isProduction()) return new Date();
    return fs.statSync(demoProfilesPath).mtime;
  }
  const profiles = await getAllProfiles();
  const times = profiles
    .map((profile) => Date.parse(profile.updatedAt ?? ""))
    .filter((value) => !Number.isNaN(value));
  if (times.length === 0) return new Date();
  return new Date(Math.max(...times));
}

export async function updateProfileStatus(slug: string, status: ProfileStatus) {
  if (tursoConfigured()) return setPersonStatus(slug, status);
  if (isProduction()) throw new DeskError(missingDatabaseMessage);
  const profiles = readDemoProfiles();
  const index = profiles.findIndex((profile) => profile.slug === slug);
  if (index === -1) return null;
  const current = profiles[index];
  if (!current) return null;
  const next = { ...current, status, updatedAt: new Date().toISOString() };
  profiles[index] = next;
  writeDemoProfiles(profiles);
  return next;
}
