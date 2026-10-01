import fs from "node:fs";
import path from "node:path";
import { and, count, desc, eq, gte, ne } from "drizzle-orm";
import { getDb, tursoConfigured } from "@/lib/db/client";
import { clickEvents, pageViews } from "@/lib/db/schema";
import { siteUrl } from "@/lib/site";

const trafficPath = path.join(process.cwd(), "data", "traffic.json");
const cap = 2000;

export const trackedClicks = ["read_work", "open_profile", "open_category", "suggest", "share"] as const;

export type TrackedClick = (typeof trackedClicks)[number];

export const clickLabel: Record<TrackedClick, string> = {
  read_work: "Read the work",
  open_profile: "Open a page",
  open_category: "Open a category",
  suggest: "Suggest someone",
  share: "Pass a page on",
};

type ViewRow = {
  id: string;
  path: string;
  referrerHost: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  device: string;
  createdAt: string;
};

type ClickRow = {
  id: string;
  path: string;
  event: string;
  target: string;
  referrerHost: string;
  utmSource: string;
  createdAt: string;
};

type TrafficFile = {
  views: ViewRow[];
  clicks: ClickRow[];
};

export type TrafficReport = {
  storage: "turso" | "file";
  unavailable: boolean;
  today: { views: number; clicks: number };
  week: { views: number; clicks: number };
  month: { views: number; clicks: number };
  devices: { mobile: number; desktop: number };
  topPages: { path: string; views: number }[];
  topReferrers: { host: string; views: number }[];
  topClicks: { event: string; label: string; clicks: number }[];
  recentClicks: { event: string; label: string; path: string; target: string; createdAt: string }[];
};

export type TrafficInput = {
  kind?: unknown;
  path?: unknown;
  referrer?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  event?: unknown;
  target?: unknown;
};

function emptyReport(storage: TrafficReport["storage"], unavailable = false): TrafficReport {
  return {
    storage,
    unavailable,
    today: { views: 0, clicks: 0 },
    week: { views: 0, clicks: 0 },
    month: { views: 0, clicks: 0 },
    devices: { mobile: 0, desktop: 0 },
    topPages: [],
    topReferrers: [],
    topClicks: [],
    recentClicks: [],
  };
}

function darDayStart() {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Dar_es_Salaam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return new Date(`${day}T00:00:00+03:00`).toISOString();
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safePath(value: unknown) {
  const raw = clip(value, 180);
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("..")) return "";
  if (raw.startsWith("/admin") || raw.startsWith("/api")) return "";
  return raw;
}

function safeUtm(value: unknown) {
  const raw = clip(value, 80);
  if (!raw || !/^[\w .:@+/-]+$/.test(raw)) return "";
  return raw;
}

function referrerHost(value: unknown) {
  const raw = clip(value, 300);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    const site = new URL(siteUrl());
    if (url.host === site.host) return "";
    return url.host.slice(0, 120);
  } catch {
    return "";
  }
}

function isTrackedClick(value: string): value is TrackedClick {
  return (trackedClicks as readonly string[]).includes(value);
}

export function deviceFromUserAgent(userAgent: string) {
  return /Mobi|Android|iPhone|iPad/i.test(userAgent) ? "mobile" : "desktop";
}

export function isLikelyBot(userAgent: string) {
  return !userAgent || /bot|crawl|spider|slurp|headless|preview|facebookexternalhit/i.test(userAgent);
}

function readFileStore(): TrafficFile {
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(trafficPath, "utf8"));
    if (!parsed || typeof parsed !== "object") return { views: [], clicks: [] };
    const row = parsed as Partial<TrafficFile>;
    return {
      views: Array.isArray(row.views) ? row.views : [],
      clicks: Array.isArray(row.clicks) ? row.clicks : [],
    };
  } catch {
    return { views: [], clicks: [] };
  }
}

function writeFileStore(data: TrafficFile) {
  const payload = `${JSON.stringify(
    {
      views: data.views.slice(-cap),
      clicks: data.clicks.slice(-cap),
    },
    null,
    2,
  )}\n`;
  const tempPath = `${trafficPath}.tmp`;
  fs.writeFileSync(tempPath, payload, "utf8");
  fs.renameSync(tempPath, trafficPath);
}

function labelFor(event: string) {
  return isTrackedClick(event) ? clickLabel[event] : event;
}

export async function recordTraffic(input: TrafficInput, userAgent: string) {
  const pathName = safePath(input.path);
  if (!pathName) return;
  const now = new Date().toISOString();
  const host = referrerHost(input.referrer);
  const utmSource = safeUtm(input.utmSource);
  const utmMedium = safeUtm(input.utmMedium);
  const utmCampaign = safeUtm(input.utmCampaign);
  const device = deviceFromUserAgent(userAgent);

  if (input.kind === "view") {
    const row: ViewRow = {
      id: crypto.randomUUID(),
      path: pathName,
      referrerHost: host,
      utmSource,
      utmMedium,
      utmCampaign,
      device,
      createdAt: now,
    };
    if (tursoConfigured()) {
      const db = await getDb();
      if (!db) return;
      await db.insert(pageViews).values(row);
      return;
    }
    const data = readFileStore();
    data.views.push(row);
    writeFileStore(data);
    return;
  }

  if (input.kind !== "click") return;
  const event = clip(input.event, 40);
  if (!isTrackedClick(event)) return;
  const row: ClickRow = {
    id: crypto.randomUUID(),
    path: pathName,
    event,
    target: clip(input.target, 180),
    referrerHost: host,
    utmSource,
    createdAt: now,
  };
  if (tursoConfigured()) {
    const db = await getDb();
    if (!db) return;
    await db.insert(clickEvents).values(row);
    return;
  }
  const data = readFileStore();
  data.clicks.push(row);
  writeFileStore(data);
}

function tally(rows: { createdAt: string }[], since: string) {
  return rows.filter((row) => row.createdAt >= since).length;
}

function topCounts(rows: { key: string; createdAt: string }[], since: string, limit: number) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (row.createdAt < since || !row.key) continue;
    counts.set(row.key, (counts.get(row.key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, value }));
}

function reportFromFile(data: TrafficFile): TrafficReport {
  const today = darDayStart();
  const week = daysAgo(7);
  const month = daysAgo(30);
  const weekViews = data.views.filter((row) => row.createdAt >= week);
  return {
    storage: "file",
    unavailable: false,
    today: { views: tally(data.views, today), clicks: tally(data.clicks, today) },
    week: { views: weekViews.length, clicks: tally(data.clicks, week) },
    month: { views: tally(data.views, month), clicks: tally(data.clicks, month) },
    devices: {
      mobile: weekViews.filter((row) => row.device === "mobile").length,
      desktop: weekViews.filter((row) => row.device === "desktop").length,
    },
    topPages: topCounts(
      data.views.map((row) => ({ key: row.path, createdAt: row.createdAt })),
      month,
      8,
    ).map((row) => ({ path: row.key, views: row.value })),
    topReferrers: topCounts(
      data.views.map((row) => ({ key: row.referrerHost, createdAt: row.createdAt })),
      month,
      8,
    ).map((row) => ({ host: row.key, views: row.value })),
    topClicks: topCounts(
      data.clicks.map((row) => ({ key: row.event, createdAt: row.createdAt })),
      month,
      8,
    ).map((row) => ({ event: row.key, label: labelFor(row.key), clicks: row.value })),
    recentClicks: [...data.clicks]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 12)
      .map((row) => ({
        event: row.event,
        label: labelFor(row.event),
        path: row.path,
        target: row.target,
        createdAt: row.createdAt,
      })),
  };
}

function asNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}

export async function getTrafficReport(): Promise<TrafficReport> {
  if (!tursoConfigured()) return reportFromFile(readFileStore());

  try {
    const db = await getDb();
    if (!db) return emptyReport("turso", true);
    const today = darDayStart();
    const week = daysAgo(7);
    const month = daysAgo(30);

    const [todayViews, todayClicks, weekViews, weekClicks, monthViews, monthClicks, pages, referrers, clicks, recent, mobile, desktop] =
      await Promise.all([
        db.select({ value: count() }).from(pageViews).where(gte(pageViews.createdAt, today)),
        db.select({ value: count() }).from(clickEvents).where(gte(clickEvents.createdAt, today)),
        db.select({ value: count() }).from(pageViews).where(gte(pageViews.createdAt, week)),
        db.select({ value: count() }).from(clickEvents).where(gte(clickEvents.createdAt, week)),
        db.select({ value: count() }).from(pageViews).where(gte(pageViews.createdAt, month)),
        db.select({ value: count() }).from(clickEvents).where(gte(clickEvents.createdAt, month)),
        db
          .select({ path: pageViews.path, views: count() })
          .from(pageViews)
          .where(gte(pageViews.createdAt, month))
          .groupBy(pageViews.path)
          .orderBy(desc(count()))
          .limit(8),
        db
          .select({ host: pageViews.referrerHost, views: count() })
          .from(pageViews)
          .where(and(gte(pageViews.createdAt, month), ne(pageViews.referrerHost, "")))
          .groupBy(pageViews.referrerHost)
          .orderBy(desc(count()))
          .limit(8),
        db
          .select({ event: clickEvents.event, clicks: count() })
          .from(clickEvents)
          .where(gte(clickEvents.createdAt, month))
          .groupBy(clickEvents.event)
          .orderBy(desc(count()))
          .limit(8),
        db.select().from(clickEvents).orderBy(desc(clickEvents.createdAt)).limit(12),
        db
          .select({ value: count() })
          .from(pageViews)
          .where(and(gte(pageViews.createdAt, week), eq(pageViews.device, "mobile"))),
        db
          .select({ value: count() })
          .from(pageViews)
          .where(and(gte(pageViews.createdAt, week), eq(pageViews.device, "desktop"))),
      ]);

    return {
      storage: "turso",
      unavailable: false,
      today: { views: asNumber(todayViews[0]?.value), clicks: asNumber(todayClicks[0]?.value) },
      week: { views: asNumber(weekViews[0]?.value), clicks: asNumber(weekClicks[0]?.value) },
      month: { views: asNumber(monthViews[0]?.value), clicks: asNumber(monthClicks[0]?.value) },
      devices: { mobile: asNumber(mobile[0]?.value), desktop: asNumber(desktop[0]?.value) },
      topPages: pages.map((row) => ({ path: row.path, views: asNumber(row.views) })),
      topReferrers: referrers.map((row) => ({ host: row.host, views: asNumber(row.views) })),
      topClicks: clicks.map((row) => ({
        event: row.event,
        label: labelFor(row.event),
        clicks: asNumber(row.clicks),
      })),
      recentClicks: recent.map((row) => ({
        event: row.event,
        label: labelFor(row.event),
        path: row.path,
        target: row.target,
        createdAt: row.createdAt,
      })),
    };
  } catch {
    return emptyReport("turso", true);
  }
}
