export const siteName = "Shukran TZ";

export const siteDescription =
  "A living tribute to Tanzanians and the work they are making. Editors publish each page. Visitors read, share, and may suggest someone for the desk.";

export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${normalized}`;
}
