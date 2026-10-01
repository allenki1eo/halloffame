CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  referrer_host TEXT NOT NULL DEFAULT '',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_medium TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  device TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS page_views_created_idx ON page_views(created_at);
CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views(path);

CREATE TABLE IF NOT EXISTS click_events (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  event TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT '',
  referrer_host TEXT NOT NULL DEFAULT '',
  utm_source TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS click_events_created_idx ON click_events(created_at);
CREATE INDEX IF NOT EXISTS click_events_event_idx ON click_events(event);
