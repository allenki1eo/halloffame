import type { Locale } from "@/lib/messages";
import type { Profile, SwahiliCopy, SwahiliWork } from "@/lib/types";

function text(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function list(value: string[] | undefined, fallback: string[]) {
  const cleaned = value?.map((item) => item.trim()).filter(Boolean);
  return cleaned && cleaned.length > 0 ? cleaned : fallback;
}

function years(value: string, locale: Locale) {
  if (locale !== "sw") return value;
  return value.replace(/\bongoing\b/gi, "inaendelea");
}

function localizeWork(work: Profile["work"][number], copy: SwahiliWork | undefined, locale: Locale) {
  return {
    ...work,
    title: text(copy?.title, work.title),
    years: years(work.years, locale),
    summary: text(copy?.summary, work.summary),
    outcome: text(copy?.outcome, work.outcome),
    media: work.media.map((item) => {
      const media = copy?.media?.[item.id];
      return {
        ...item,
        title: text(media?.title, item.title),
        caption: text(media?.caption, item.caption),
        alt: text(media?.alt, item.alt),
      };
    }),
  };
}

export function localizeProfile(profile: Profile, locale: Locale): Profile {
  if (locale !== "sw") return profile;
  const sw: SwahiliCopy = profile.sw ?? {};
  return {
    ...profile,
    role: text(sw.role, profile.role),
    place: text(sw.place, profile.place),
    oneLiner: text(sw.oneLiner, profile.oneLiner),
    photoAlt: text(sw.photoAlt, profile.photoAlt),
    journey: list(sw.journey, profile.journey),
    whyItMatters: list(sw.whyItMatters, profile.whyItMatters),
    work: profile.work.map((item) => localizeWork(item, sw.work?.[item.id], locale)),
  };
}
