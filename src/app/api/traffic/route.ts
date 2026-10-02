import { isAdmin } from "@/lib/admin-auth";
import { isLikelyBot, recordTraffic, type TrafficInput } from "@/lib/traffic";

export const dynamic = "force-dynamic";

const windowMs = 60_000;
const perWindow = 60;
const hits = new Map<string, { count: number; reset: number }>();

function allowed(ip: string) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [key, value] of hits) if (value.reset < now) hits.delete(key);
  }
  const current = hits.get(ip);
  if (!current || current.reset < now) {
    hits.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  current.count += 1;
  return current.count <= perWindow;
}

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (isLikelyBot(userAgent)) return new Response(null, { status: 204 });
    // Editors checking their own pages should not inflate the record.
    if (await isAdmin()) return new Response(null, { status: 204 });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!allowed(ip)) return new Response(null, { status: 204 });
    const body: unknown = JSON.parse(await request.text());
    if (!body || typeof body !== "object") return new Response(null, { status: 204 });
    await recordTraffic(body as TrafficInput, userAgent);
  } catch (error) {
    // A missed beacon must not surface on the public page.
    console.error("[traffic] beacon failed", error);
  }
  return new Response(null, { status: 204 });
}
