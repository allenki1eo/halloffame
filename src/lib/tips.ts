import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { isCategorySlug } from "@/lib/categories";
import type { CategorySlug, Tip, TipInput } from "@/lib/types";

const tipsPath = path.join(process.cwd(), "data", "tips.json");
const memoryTips: Tip[] = [];
const hits = new Map<string, number[]>();

const LIMITS = {
  personName: { min: 2, max: 80 },
  place: { min: 2, max: 80 },
  workSummary: { min: 20, max: 800 },
  why: { min: 20, max: 800 },
  suggesterName: { min: 0, max: 80 },
  contact: { min: 0, max: 120 },
} as const;

export type TipField = "personName" | "category" | "place" | "workSummary" | "why";

export type ParsedTip =
  | { ok: true; value: Omit<Tip, "id" | "createdAt" | "storage"> }
  | { ok: false; formError: string; fieldErrors: Partial<Record<TipField, string>> };

function normalize(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").trim();
}

function checkLength(
  value: string,
  label: string,
  bounds: { min: number; max: number },
) {
  if (value.length < bounds.min) {
    return bounds.min === 0 ? null : `Add ${label}.`;
  }
  if (value.length > bounds.max) {
    return `Keep ${label} under ${bounds.max} characters.`;
  }
  return null;
}

export function parseTipInput(input: TipInput): ParsedTip {
  const personName = normalize(input.personName).replace(/\s+/g, " ");
  const place = normalize(input.place).replace(/\s+/g, " ");
  const workSummary = normalize(input.workSummary);
  const why = normalize(input.why);
  const suggesterName = normalize(input.suggesterName).replace(/\s+/g, " ");
  const contact = normalize(input.contact).replace(/\s+/g, " ");
  const category = input.category.trim();

  const fieldErrors: Partial<Record<TipField, string>> = {};
  const nameError = checkLength(personName, "their name", LIMITS.personName);
  const placeError = checkLength(place, "where they work", LIMITS.place);
  const workError = checkLength(workSummary, "a short account of the work", LIMITS.workSummary);
  const whyError = checkLength(why, "why you are suggesting them", LIMITS.why);
  const suggesterError = checkLength(suggesterName, "your name", LIMITS.suggesterName);
  const contactError = checkLength(contact, "your contact", LIMITS.contact);

  if (nameError) fieldErrors.personName = nameError;
  if (placeError) fieldErrors.place = placeError;
  if (workError) fieldErrors.workSummary = workError;
  if (whyError) fieldErrors.why = whyError;
  if (!isCategorySlug(category)) {
    fieldErrors.category = "Choose a category.";
  }

  if (suggesterError || contactError) {
    return {
      ok: false,
      formError: suggesterError ?? contactError ?? "Check the suggestion and try again.",
      fieldErrors,
    };
  }

  if (Object.keys(fieldErrors).length > 0 || !isCategorySlug(category)) {
    return {
      ok: false,
      formError: "A few fields still need attention.",
      fieldErrors,
    };
  }

  return {
    ok: true,
    value: {
      personName,
      category: category as CategorySlug,
      place,
      workSummary,
      why,
      suggesterName,
      contact,
    },
  };
}

function readTipFile(): Tip[] {
  try {
    const raw = fs.readFileSync(tipsPath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Tip[];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw error;
  }
}

export function getTips() {
  const fromFile = readTipFile();
  const seen = new Set(fromFile.map((tip) => tip.id));
  const extras = memoryTips.filter((tip) => !seen.has(tip.id));
  return [...extras, ...fromFile].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function allowTip(key: string) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= 8) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function saveTip(
  value: Omit<Tip, "id" | "createdAt" | "storage">,
  rateKey: string,
): { ok: true; storage: Tip["storage"] } | { ok: false; message: string } {
  if (!allowTip(rateKey)) {
    return {
      ok: false,
      message: "Please wait a while before sending another suggestion.",
    };
  }

  const tip: Tip = {
    ...value,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    storage: "file",
  };

  try {
    const existing = readTipFile();
    if (existing.length >= 200) {
      return {
        ok: false,
        message:
          "This preview desk is holding as many notes as it can. A production database is the next step.",
      };
    }
    const next = [tip, ...existing];
    fs.mkdirSync(path.dirname(tipsPath), { recursive: true });
    const payload = `${JSON.stringify(next, null, 2)}\n`;
    const tempPath = `${tipsPath}.tmp`;
    fs.writeFileSync(tempPath, payload, "utf8");
    fs.renameSync(tempPath, tipsPath);
    return { ok: true, storage: "file" };
  } catch {
    tip.storage = "memory";
    memoryTips.unshift(tip);
    return { ok: true, storage: "memory" };
  }
}
