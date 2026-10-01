import fs from "node:fs";
import path from "node:path";
import { isMedal } from "@/lib/medals";
import { slugify } from "@/lib/slug";
import { parseSocialList } from "@/lib/socials";
import { parseSwCopy } from "@/lib/sw-copy";
import { categorySlugs, type CategorySlug, type Medal, type MediaKind, type Profile, type ProfileStatus, type WorkItem, type WorkMedia } from "@/lib/types";

export const profilesPath = path.join(process.cwd(), "data", "profiles.json");
export const demoProfilesPath = path.join(process.cwd(), "data", "demo-profiles.json");

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim());
}

function medalOf(value: unknown, fallback: Medal): Medal {
  const raw = text(value);
  return isMedal(raw) ? raw : fallback;
}

function categoryOf(value: unknown): CategorySlug {
  const raw = text(value);
  if ((categorySlugs as readonly string[]).includes(raw)) return raw as CategorySlug;
  return "community";
}

function statusOf(value: unknown): ProfileStatus {
  return text(value) === "draft" ? "draft" : "published";
}

function mediaKindOf(value: unknown): MediaKind {
  const raw = text(value);
  if (raw === "image" || raw === "video" || raw === "link") return raw;
  return "link";
}

function normalizeMedia(value: unknown, fallbackId: string): WorkMedia | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const url = text(row.url);
  if (!url) return null;
  return {
    id: text(row.id) || fallbackId,
    kind: mediaKindOf(row.kind),
    url,
    title: text(row.title),
    caption: text(row.caption),
    alt: text(row.alt),
  };
}

function normalizeWork(value: unknown, personSlug: string, index: number): WorkItem | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const title = text(row.title);
  if (!title) return null;
  const id = text(row.id) || `${personSlug}-${slugify(title) || `work-${index + 1}`}`;
  const mediaRaw = Array.isArray(row.media) ? row.media : [];
  return {
    id,
    title,
    years: text(row.years),
    summary: text(row.summary),
    outcome: text(row.outcome),
    medal: medalOf(row.medal, "bronze"),
    media: mediaRaw
      .map((item, mediaIndex) => normalizeMedia(item, `${id}-media-${mediaIndex + 1}`))
      .filter((item): item is WorkMedia => item !== null),
  };
}

export function normalizeProfile(value: unknown, index: number): Profile {
  if (!value || typeof value !== "object") {
    throw new Error("Each profile in data/profiles.json must be an object.");
  }
  const row = value as Record<string, unknown>;
  const name = text(row.name);
  const slug = text(row.slug) || slugify(name) || `page-${index + 1}`;
  const workRaw = Array.isArray(row.work) ? row.work : [];
  return {
    slug,
    name,
    category: categoryOf(row.category),
    place: text(row.place),
    role: text(row.role),
    oneLiner: text(row.oneLiner),
    photo: text(row.photo),
    photoAlt: text(row.photoAlt),
    status: statusOf(row.status),
    honorMedal: medalOf(row.honorMedal, "bronze"),
    work: workRaw
      .map((item, workIndex) => normalizeWork(item, slug, workIndex))
      .filter((item): item is WorkItem => item !== null),
    journey: stringList(row.journey),
    whyItMatters: stringList(row.whyItMatters),
    socials: parseSocialList(row.socials),
    sw: parseSwCopy(row.sw),
    updatedAt: text(row.updatedAt) || undefined,
  };
}

function readProfileFile(filePath: string): Profile[] {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`${path.relative(process.cwd(), filePath)} must be an array.`);
  }
  return parsed.map((item, index) => normalizeProfile(item, index));
}

export function readProfiles(): Profile[] {
  return readProfileFile(profilesPath);
}

export function readDemoProfiles(): Profile[] {
  return readProfileFile(demoProfilesPath);
}

function writeProfileFile(filePath: string, profiles: Profile[]) {
  const payload = `${JSON.stringify(profiles, null, 2)}\n`;
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, payload, "utf8");
  fs.renameSync(tempPath, filePath);
}

export function writeProfiles(profiles: Profile[]) {
  writeProfileFile(profilesPath, profiles);
}

export function writeDemoProfiles(profiles: Profile[]) {
  writeProfileFile(demoProfilesPath, profiles);
}
