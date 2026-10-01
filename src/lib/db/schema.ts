import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const people = sqliteTable("people", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  place: text("place").notNull(),
  role: text("role").notNull(),
  oneLiner: text("one_liner").notNull(),
  photoUrl: text("photo_url").notNull(),
  photoAlt: text("photo_alt").notNull(),
  status: text("status").notNull().default("draft"),
  honorMedal: text("honor_medal").notNull(),
  journeyJson: text("journey_json").notNull().default("[]"),
  whyJson: text("why_json").notNull().default("[]"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const workItems = sqliteTable(
  "work_items",
  {
    id: text("id").primaryKey(),
    personId: text("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    years: text("years").notNull(),
    summary: text("summary").notNull(),
    outcome: text("outcome").notNull(),
    medal: text("medal").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("work_items_person_idx").on(table.personId, table.sortOrder)],
);

export const pageViews = sqliteTable(
  "page_views",
  {
    id: text("id").primaryKey(),
    path: text("path").notNull(),
    referrerHost: text("referrer_host").notNull().default(""),
    utmSource: text("utm_source").notNull().default(""),
    utmMedium: text("utm_medium").notNull().default(""),
    utmCampaign: text("utm_campaign").notNull().default(""),
    device: text("device").notNull().default(""),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("page_views_created_idx").on(table.createdAt), index("page_views_path_idx").on(table.path)],
);

export const clickEvents = sqliteTable(
  "click_events",
  {
    id: text("id").primaryKey(),
    path: text("path").notNull(),
    event: text("event").notNull(),
    target: text("target").notNull().default(""),
    referrerHost: text("referrer_host").notNull().default(""),
    utmSource: text("utm_source").notNull().default(""),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("click_events_created_idx").on(table.createdAt), index("click_events_event_idx").on(table.event)],
);

export const workMedia = sqliteTable(
  "work_media",
  {
    id: text("id").primaryKey(),
    workItemId: text("work_item_id")
      .notNull()
      .references(() => workItems.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    url: text("url").notNull(),
    title: text("title").notNull().default(""),
    caption: text("caption").notNull().default(""),
    alt: text("alt").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("work_media_work_idx").on(table.workItemId, table.sortOrder)],
);
