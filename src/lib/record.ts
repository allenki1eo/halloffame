import { categories } from "@/lib/categories";
import { DeskError } from "@/lib/desk-error";
import { isMedal, isMediaKind } from "@/lib/medals";
import { isSlug, slugify } from "@/lib/slug";
import { isSocialKind } from "@/lib/socials";
import type { CategorySlug, Medal, MediaKind, ProfileStatus, SocialLink } from "@/lib/types";

export type PersonDraft = {
  originalSlug: string;
  slug: string;
  name: string;
  category: CategorySlug;
  place: string;
  role: string;
  oneLiner: string;
  photoUrl: string;
  photoAlt: string;
  status: ProfileStatus;
  honorMedal: Medal;
  journey: string[];
  whyItMatters: string[];
  socials: SocialLink[];
  sw: {
    role: string;
    place: string;
    oneLiner: string;
    photoAlt: string;
    journey: string[];
    whyItMatters: string[];
  };
};

export type WorkDraft = {
  personSlug: string;
  workId: string;
  title: string;
  years: string;
  summary: string;
  outcome: string;
  medal: Medal;
  sw: {
    title: string;
    summary: string;
    outcome: string;
  };
};

export type MediaDraft = {
  personSlug: string;
  workId: string;
  mediaId: string;
  kind: MediaKind;
  url: string;
  title: string;
  caption: string;
  alt: string;
};

function clip(value: string, max: number) {
  return value.trim().slice(0, max);
}

export function paragraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 40)
    .map((paragraph) => paragraph.slice(0, 2000));
}

export function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function uploadFile(formData: FormData, key: string) {
  const value = formData.get(key);
  if (!(value instanceof File) || value.size <= 0) return null;
  return value;
}

export function parsePerson(formData: FormData): PersonDraft {
  const name = clip(field(formData, "name"), 80);
  if (name.length < 2) throw new DeskError("Add the person’s name.");

  const requestedSlug = clip(field(formData, "slug"), 80);
  const slug = requestedSlug || slugify(name);
  if (!isSlug(slug)) {
    throw new DeskError("The address uses lowercase letters, numbers, and hyphens.");
  }

  const category = categories.find((item) => item.slug === field(formData, "category"));
  if (!category) throw new DeskError("Choose a category.");

  const place = clip(field(formData, "place"), 120);
  const role = clip(field(formData, "role"), 120);
  const oneLiner = clip(field(formData, "oneLiner"), 240);
  if (!place || !role || !oneLiner) {
    throw new DeskError("Place, role, and the one line are required.");
  }

  const honorMedal = field(formData, "honorMedal");
  if (!isMedal(honorMedal)) throw new DeskError("Choose an honor medal.");

  const status = field(formData, "status");
  if (status !== "published" && status !== "draft") {
    throw new DeskError("Choose whether the page is public or still on the desk.");
  }

  const photoAlt = clip(field(formData, "photoAlt"), 300) || `Portrait of ${name}.`;

  return {
    originalSlug: clip(field(formData, "originalSlug"), 80),
    slug,
    name,
    category: category.slug,
    place,
    role,
    oneLiner,
    photoUrl: clip(field(formData, "photoUrl"), 2000),
    photoAlt,
    status,
    honorMedal,
    journey: paragraphs(field(formData, "journey")),
    whyItMatters: paragraphs(field(formData, "whyItMatters")),
    socials: parseSocials(formData),
    sw: {
      role: clip(field(formData, "roleSw"), 120),
      place: clip(field(formData, "placeSw"), 120),
      oneLiner: clip(field(formData, "oneLinerSw"), 240),
      photoAlt: clip(field(formData, "photoAltSw"), 300),
      journey: paragraphs(field(formData, "journeySw")),
      whyItMatters: paragraphs(field(formData, "whySw")),
    },
  };
}

function parseSocials(formData: FormData): SocialLink[] {
  const kinds = formData.getAll("socialKind");
  const urls = formData.getAll("socialUrl");
  const links: SocialLink[] = [];
  const count = Math.max(kinds.length, urls.length);
  for (let index = 0; index < count; index += 1) {
    const kindValue = kinds[index];
    const urlValue = urls[index];
    const kindRaw = typeof kindValue === "string" ? kindValue : "";
    const url = clip(typeof urlValue === "string" ? urlValue : "", 500);
    if (!url) continue;
    if (!isSocialKind(kindRaw)) throw new DeskError("Choose a kind of link.");
    if (kindRaw === "email") {
      const address = url.replace(/^mailto:/i, "");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
        throw new DeskError("Use an email address for that link.");
      }
      links.push({ kind: "email", url: address });
      continue;
    }
    if (kindRaw === "whatsapp") {
      if (/^https?:\/\//i.test(url)) {
        assertHttpUrl(url);
        links.push({ kind: "whatsapp", url });
      } else {
        const digits = url.replace(/\D/g, "");
        if (digits.length < 8) throw new DeskError("Use a WhatsApp number or a wa.me link.");
        links.push({ kind: "whatsapp", url: digits });
      }
      continue;
    }
    assertHttpUrl(url);
    if (!/^https?:\/\//i.test(url)) throw new DeskError("Social links use a full http(s) address.");
    links.push({ kind: kindRaw, url });
  }
  if (links.length > 8) throw new DeskError("A page can hold eight links.");
  return links;
}

export function parseWork(formData: FormData): WorkDraft {
  const personSlug = clip(field(formData, "personSlug"), 80);
  if (!isSlug(personSlug)) throw new DeskError("That page could not be found.");

  const title = clip(field(formData, "title"), 160);
  if (title.length < 2) throw new DeskError("Add a title for the work.");

  const medal = field(formData, "medal");
  if (!isMedal(medal)) throw new DeskError("Choose a medal for this work.");

  return {
    personSlug,
    workId: clip(field(formData, "workId"), 80),
    title,
    years: clip(field(formData, "years"), 80),
    summary: clip(field(formData, "summary"), 4000),
    outcome: clip(field(formData, "outcome"), 2000),
    medal,
    sw: {
      title: clip(field(formData, "titleSw"), 160),
      summary: clip(field(formData, "summarySw"), 4000),
      outcome: clip(field(formData, "outcomeSw"), 2000),
    },
  };
}

export function parseMedia(formData: FormData): MediaDraft {
  const personSlug = clip(field(formData, "personSlug"), 80);
  const workId = clip(field(formData, "workId"), 80);
  if (!isSlug(personSlug) || !workId) throw new DeskError("That work could not be found.");

  const kind = field(formData, "kind");
  if (!isMediaKind(kind)) throw new DeskError("Choose image, video, or link.");

  return {
    personSlug,
    workId,
    mediaId: clip(field(formData, "mediaId"), 80),
    kind,
    url: clip(field(formData, "url"), 2000),
    title: clip(field(formData, "title"), 160),
    caption: clip(field(formData, "caption"), 400),
    alt: clip(field(formData, "alt"), 300),
  };
}

export function assertHttpUrl(url: string) {
  if (url.startsWith("/") && !url.startsWith("//")) return;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return;
  } catch {
    // Fall through to the desk error.
  }
  throw new DeskError("Use a full http(s) link, or a path that starts with /.");
}
