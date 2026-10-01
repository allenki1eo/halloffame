CREATE TABLE IF NOT EXISTS people (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tech', 'science', 'arts', 'community')),
  place TEXT NOT NULL,
  role TEXT NOT NULL,
  one_liner TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  photo_alt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  honor_medal TEXT NOT NULL CHECK (honor_medal IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  journey_json TEXT NOT NULL DEFAULT '[]',
  why_json TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS work_items (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  years TEXT NOT NULL,
  summary TEXT NOT NULL,
  outcome TEXT NOT NULL,
  medal TEXT NOT NULL CHECK (medal IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS work_items_person_idx ON work_items(person_id, sort_order);

CREATE TABLE IF NOT EXISTS work_media (
  id TEXT PRIMARY KEY,
  work_item_id TEXT NOT NULL REFERENCES work_items(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('image', 'video', 'link')),
  url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  alt TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS work_media_work_idx ON work_media(work_item_id, sort_order);
