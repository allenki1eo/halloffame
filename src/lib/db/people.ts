import { asc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { people, workItems, workMedia } from "@/lib/db/schema";
import { DeskError, missingDatabaseMessage } from "@/lib/desk-error";
import { isMedal } from "@/lib/medals";
import type { PersonDraft, WorkDraft, MediaDraft } from "@/lib/record";
import { parseSocialList } from "@/lib/socials";
import { mergeWorkSw, parseSwCopy, parseSwWork, personSwJson, safeJson } from "@/lib/sw-copy";
import { categorySlugs, type CategorySlug, type Medal, type MediaKind, type Profile, type ProfileStatus, type SwahiliCopy, type WorkItem, type WorkMedia } from "@/lib/types";

type PersonRow = typeof people.$inferSelect;
type WorkRow = typeof workItems.$inferSelect;
type MediaRow = typeof workMedia.$inferSelect;

async function database() {
  const db = await getDb();
  if (!db) throw new DeskError(missingDatabaseMessage);
  return db;
}

function asCategory(value: string): CategorySlug {
  if ((categorySlugs as readonly string[]).includes(value)) return value as CategorySlug;
  return "community";
}

function asStatus(value: string): ProfileStatus {
  return value === "draft" ? "draft" : "published";
}

function asMedal(value: string): Medal {
  return isMedal(value) ? value : "bronze";
}

function asKind(value: string): MediaKind {
  if (value === "image" || value === "video" || value === "link") return value;
  return "link";
}

function parseList(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function toProfile(row: PersonRow, works: WorkRow[], media: MediaRow[]): Profile {
  const items: WorkItem[] = works
    .filter((work) => work.personId === row.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((work) => ({
      id: work.id,
      title: work.title,
      years: work.years,
      summary: work.summary,
      outcome: work.outcome,
      medal: asMedal(work.medal),
      media: media
        .filter((item) => item.workItemId === work.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(
          (item): WorkMedia => ({
            id: item.id,
            kind: asKind(item.kind),
            url: item.url,
            title: item.title,
            caption: item.caption,
            alt: item.alt,
          }),
        ),
    }));

  return {
    slug: row.slug,
    name: row.name,
    category: asCategory(row.category),
    place: row.place,
    role: row.role,
    oneLiner: row.oneLiner,
    photo: row.photoUrl,
    photoAlt: row.photoAlt,
    status: asStatus(row.status),
    honorMedal: asMedal(row.honorMedal),
    work: items,
    journey: parseList(row.journeyJson),
    whyItMatters: parseList(row.whyJson),
    socials: parseSocialList(safeJson(row.socialsJson)),
    sw: profileSw(
      row.swJson,
      works.filter((work) => work.personId === row.id),
    ),
    updatedAt: row.updatedAt,
  };
}

function profileSw(personJson: string, works: WorkRow[]): SwahiliCopy {
  const copy = parseSwCopy(safeJson(personJson));
  const work = { ...(copy.work ?? {}) };
  for (const item of works) {
    const parsed = parseSwWork(safeJson(item.swJson));
    if (Object.keys(parsed).length > 0) work[item.id] = parsed;
  }
  if (Object.keys(work).length === 0) {
    const rest = { ...copy };
    delete rest.work;
    return rest;
  }
  return { ...copy, work };
}

async function hydrate(rows: PersonRow[]) {
  const db = await database();
  if (rows.length === 0) return [];
  const personIds = rows.map((row) => row.id);
  const works = await db
    .select()
    .from(workItems)
    .where(inArray(workItems.personId, personIds))
    .orderBy(asc(workItems.sortOrder));
  const workIds = works.map((work) => work.id);
  const media =
    workIds.length === 0
      ? []
      : await db
          .select()
          .from(workMedia)
          .where(inArray(workMedia.workItemId, workIds))
          .orderBy(asc(workMedia.sortOrder));
  return rows.map((row) => toProfile(row, works, media));
}

export async function listPeople() {
  const db = await database();
  const rows = await db.select().from(people).orderBy(asc(people.sortOrder), asc(people.name));
  return hydrate(rows);
}

export async function findPerson(slug: string) {
  const db = await database();
  const rows = await db.select().from(people).where(eq(people.slug, slug)).limit(1);
  const row = rows[0];
  if (!row) return null;
  const [profile] = await hydrate([row]);
  return profile ?? null;
}

async function personRow(slug: string) {
  const db = await database();
  const rows = await db.select().from(people).where(eq(people.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function setPersonStatus(slug: string, status: ProfileStatus) {
  const db = await database();
  const current = await personRow(slug);
  if (!current) return null;
  const updatedAt = new Date().toISOString();
  await db.update(people).set({ status, updatedAt }).where(eq(people.id, current.id));
  return findPerson(slug);
}

export async function savePerson(draft: PersonDraft, photoUrl: string) {
  const db = await database();
  const now = new Date().toISOString();
  const current = draft.originalSlug ? await personRow(draft.originalSlug) : null;
  if (draft.originalSlug && !current) throw new DeskError("That page is no longer on the desk.");

  const slugOwner = await personRow(draft.slug);
  if (slugOwner && slugOwner.id !== current?.id) {
    throw new DeskError("Another page already uses that address.");
  }

  if (!photoUrl) throw new DeskError("Add a portrait file or a portrait URL.");

  if (!current) {
    const existing = await db.select({ sortOrder: people.sortOrder }).from(people);
    const sortOrder = existing.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;
    const id = crypto.randomUUID();
    await db.insert(people).values({
      id,
      slug: draft.slug,
      name: draft.name,
      category: draft.category,
      place: draft.place,
      role: draft.role,
      oneLiner: draft.oneLiner,
      photoUrl,
      photoAlt: draft.photoAlt,
      status: draft.status,
      honorMedal: draft.honorMedal,
      journeyJson: JSON.stringify(draft.journey),
      whyJson: JSON.stringify(draft.whyItMatters),
      swJson: personSwJson(draft.sw),
      socialsJson: JSON.stringify(draft.socials),
      sortOrder,
      createdAt: now,
      updatedAt: now,
    });
    return draft.slug;
  }

  await db
    .update(people)
    .set({
      slug: draft.slug,
      name: draft.name,
      category: draft.category,
      place: draft.place,
      role: draft.role,
      oneLiner: draft.oneLiner,
      photoUrl,
      photoAlt: draft.photoAlt,
      status: draft.status,
      honorMedal: draft.honorMedal,
      journeyJson: JSON.stringify(draft.journey),
      whyJson: JSON.stringify(draft.whyItMatters),
      swJson: personSwJson(draft.sw),
      socialsJson: JSON.stringify(draft.socials),
      updatedAt: now,
    })
    .where(eq(people.id, current.id));
  return draft.slug;
}

export async function removePerson(slug: string) {
  const db = await database();
  const current = await personRow(slug);
  if (!current) return null;
  const works = await db.select({ id: workItems.id }).from(workItems).where(eq(workItems.personId, current.id));
  const workIds = works.map((work) => work.id);
  if (workIds.length > 0) {
    await db.delete(workMedia).where(inArray(workMedia.workItemId, workIds));
    await db.delete(workItems).where(eq(workItems.personId, current.id));
  }
  await db.delete(people).where(eq(people.id, current.id));
  return current.name;
}

async function workRow(personId: string, workId: string) {
  const db = await database();
  const rows = await db
    .select()
    .from(workItems)
    .where(eq(workItems.id, workId))
    .limit(1);
  const row = rows[0];
  if (!row || row.personId !== personId) return null;
  return row;
}

export async function saveWork(draft: WorkDraft) {
  const db = await database();
  const person = await personRow(draft.personSlug);
  if (!person) throw new DeskError("That page is no longer on the desk.");
  const now = new Date().toISOString();

  if (!draft.workId) {
    const existing = await db
      .select({ sortOrder: workItems.sortOrder })
      .from(workItems)
      .where(eq(workItems.personId, person.id));
    const sortOrder = existing.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;
    await db.insert(workItems).values({
      id: crypto.randomUUID(),
      personId: person.id,
      title: draft.title,
      years: draft.years,
      summary: draft.summary,
      outcome: draft.outcome,
      medal: draft.medal,
      swJson: mergeWorkSw("{}", draft.sw),
      sortOrder,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    const current = await workRow(person.id, draft.workId);
    if (!current) throw new DeskError("That work is no longer on the page.");
    await db
      .update(workItems)
      .set({
        title: draft.title,
        years: draft.years,
        summary: draft.summary,
        outcome: draft.outcome,
        medal: draft.medal,
        swJson: mergeWorkSw(current.swJson, draft.sw),
        updatedAt: now,
      })
      .where(eq(workItems.id, current.id));
  }

  await db.update(people).set({ updatedAt: now }).where(eq(people.id, person.id));
  return person.slug;
}

export async function removeWork(personSlug: string, workId: string) {
  const db = await database();
  const person = await personRow(personSlug);
  if (!person) throw new DeskError("That page is no longer on the desk.");
  const current = await workRow(person.id, workId);
  if (!current) throw new DeskError("That work is no longer on the page.");
  await db.delete(workMedia).where(eq(workMedia.workItemId, current.id));
  await db.delete(workItems).where(eq(workItems.id, current.id));
  await db.update(people).set({ updatedAt: new Date().toISOString() }).where(eq(people.id, person.id));
  return person.slug;
}

export async function saveMedia(draft: MediaDraft) {
  const db = await database();
  const person = await personRow(draft.personSlug);
  if (!person) throw new DeskError("That page is no longer on the desk.");
  const work = await workRow(person.id, draft.workId);
  if (!work) throw new DeskError("That work is no longer on the page.");
  const now = new Date().toISOString();

  if (!draft.mediaId) {
    const existing = await db
      .select({ sortOrder: workMedia.sortOrder })
      .from(workMedia)
      .where(eq(workMedia.workItemId, work.id));
    const sortOrder = existing.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;
    await db.insert(workMedia).values({
      id: crypto.randomUUID(),
      workItemId: work.id,
      kind: draft.kind,
      url: draft.url,
      title: draft.title,
      caption: draft.caption,
      alt: draft.alt,
      sortOrder,
      createdAt: now,
    });
  } else {
    const rows = await db.select().from(workMedia).where(eq(workMedia.id, draft.mediaId)).limit(1);
    const current = rows[0];
    if (!current || current.workItemId !== work.id) throw new DeskError("That media is no longer on the work.");
    await db
      .update(workMedia)
      .set({
        kind: draft.kind,
        url: draft.url,
        title: draft.title,
        caption: draft.caption,
        alt: draft.alt,
      })
      .where(eq(workMedia.id, current.id));
  }

  await db.update(people).set({ updatedAt: now }).where(eq(people.id, person.id));
  return person.slug;
}

export async function removeMedia(personSlug: string, workId: string, mediaId: string) {
  const db = await database();
  const person = await personRow(personSlug);
  if (!person) throw new DeskError("That page is no longer on the desk.");
  const work = await workRow(person.id, workId);
  if (!work) throw new DeskError("That work is no longer on the page.");
  const rows = await db.select().from(workMedia).where(eq(workMedia.id, mediaId)).limit(1);
  const current = rows[0];
  if (!current || current.workItemId !== work.id) throw new DeskError("That media is no longer on the work.");
  await db.delete(workMedia).where(eq(workMedia.id, current.id));
  await db.update(people).set({ updatedAt: new Date().toISOString() }).where(eq(people.id, person.id));
  return person.slug;
}

export async function replaceSeedPerson(profile: Profile, sortOrder: number) {
  const db = await database();
  const now = profile.updatedAt || new Date().toISOString();
  const existing = await personRow(profile.slug);
  const id = existing?.id ?? profile.slug;

  if (!existing) {
    await db.insert(people).values({
      id,
      slug: profile.slug,
      name: profile.name,
      category: profile.category,
      place: profile.place,
      role: profile.role,
      oneLiner: profile.oneLiner,
      photoUrl: profile.photo,
      photoAlt: profile.photoAlt,
      status: profile.status,
      honorMedal: profile.honorMedal,
      journeyJson: JSON.stringify(profile.journey),
      whyJson: JSON.stringify(profile.whyItMatters),
      swJson: personSwJson(profile.sw),
      socialsJson: JSON.stringify(profile.socials ?? []),
      sortOrder,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await db
      .update(people)
      .set({
        name: profile.name,
        category: profile.category,
        place: profile.place,
        role: profile.role,
        oneLiner: profile.oneLiner,
        photoUrl: profile.photo,
        photoAlt: profile.photoAlt,
        status: profile.status,
        honorMedal: profile.honorMedal,
        journeyJson: JSON.stringify(profile.journey),
        whyJson: JSON.stringify(profile.whyItMatters),
        swJson: personSwJson(profile.sw),
        socialsJson: JSON.stringify(profile.socials ?? []),
        sortOrder,
        updatedAt: now,
      })
      .where(eq(people.id, id));
  }

  const previous = await db.select({ id: workItems.id }).from(workItems).where(eq(workItems.personId, id));
  const previousIds = previous.map((work) => work.id);
  if (previousIds.length > 0) {
    await db.delete(workMedia).where(inArray(workMedia.workItemId, previousIds));
    await db.delete(workItems).where(eq(workItems.personId, id));
  }

  for (const [index, work] of profile.work.entries()) {
    await db.insert(workItems).values({
      id: work.id,
      personId: id,
      title: work.title,
      years: work.years,
      summary: work.summary,
      outcome: work.outcome,
      medal: work.medal,
      swJson: JSON.stringify(profile.sw?.work?.[work.id] ?? {}),
      sortOrder: index,
      createdAt: now,
      updatedAt: now,
    });
    for (const [mediaIndex, item] of work.media.entries()) {
      await db.insert(workMedia).values({
        id: item.id,
        workItemId: work.id,
        kind: item.kind,
        url: item.url,
        title: item.title,
        caption: item.caption,
        alt: item.alt,
        sortOrder: mediaIndex,
        createdAt: now,
      });
    }
  }
}
