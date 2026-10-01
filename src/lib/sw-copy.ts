import type { SwahiliCopy, SwahiliMedia, SwahiliWork } from "@/lib/types";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}

export function safeJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function parseSwWork(value: unknown): SwahiliWork {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const row = value as Record<string, unknown>;
  const mediaRaw =
    row.media && typeof row.media === "object" && !Array.isArray(row.media)
      ? (row.media as Record<string, unknown>)
      : {};
  const media: Record<string, SwahiliMedia> = {};
  for (const [id, item] of Object.entries(mediaRaw)) {
    if (!item || typeof item !== "object") continue;
    const mediaRow = item as Record<string, unknown>;
    const title = text(mediaRow.title);
    const caption = text(mediaRow.caption);
    const alt = text(mediaRow.alt);
    if (!title && !caption && !alt) continue;
    media[id] = {
      ...(title ? { title } : {}),
      ...(caption ? { caption } : {}),
      ...(alt ? { alt } : {}),
    };
  }
  const title = text(row.title);
  const summary = text(row.summary);
  const outcome = text(row.outcome);
  return {
    ...(title ? { title } : {}),
    ...(summary ? { summary } : {}),
    ...(outcome ? { outcome } : {}),
    ...(Object.keys(media).length > 0 ? { media } : {}),
  };
}

export function parseSwCopy(value: unknown): SwahiliCopy {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const row = value as Record<string, unknown>;
  const workRaw =
    row.work && typeof row.work === "object" && !Array.isArray(row.work)
      ? (row.work as Record<string, unknown>)
      : {};
  const work: Record<string, SwahiliWork> = {};
  for (const [id, item] of Object.entries(workRaw)) {
    const parsed = parseSwWork(item);
    if (Object.keys(parsed).length > 0) work[id] = parsed;
  }
  const role = text(row.role);
  const place = text(row.place);
  const oneLiner = text(row.oneLiner);
  const photoAlt = text(row.photoAlt);
  const journey = stringList(row.journey);
  const whyItMatters = stringList(row.whyItMatters);
  return {
    ...(role ? { role } : {}),
    ...(place ? { place } : {}),
    ...(oneLiner ? { oneLiner } : {}),
    ...(photoAlt ? { photoAlt } : {}),
    ...(journey.length > 0 ? { journey } : {}),
    ...(whyItMatters.length > 0 ? { whyItMatters } : {}),
    ...(Object.keys(work).length > 0 ? { work } : {}),
  };
}

export function personSwJson(sw: SwahiliCopy | undefined) {
  if (!sw) return "{}";
  const rest = { ...sw };
  delete rest.work;
  return JSON.stringify(rest);
}

export function mergeWorkSw(existingJson: string, patch: { title: string; summary: string; outcome: string }) {
  const current = parseSwWork(safeJson(existingJson));
  const next: SwahiliWork = { ...current };
  const title = patch.title.trim();
  const summary = patch.summary.trim();
  const outcome = patch.outcome.trim();
  if (title) next.title = title;
  else delete next.title;
  if (summary) next.summary = summary;
  else delete next.summary;
  if (outcome) next.outcome = outcome;
  else delete next.outcome;
  return JSON.stringify(next);
}
