import { isLikelyBot, recordTraffic, type TrafficInput } from "@/lib/traffic";

export const dynamic = "force-dynamic";

const hits = new Map<string, { count: number; reset: number }>();

function allowed(ip: string) {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || current.reset < now) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  current.count += 1;
  return current.count <= 60;
}

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (isLikelyBot(userAgent)) return new Response(null, { status: 204 });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!allowed(ip)) return new Response(null, { status: 204 });
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return new Response(null, { status: 204 });
    await recordTraffic(body as TrafficInput, userAgent);
  } catch {
    // A missed beacon must not surface on the public page.
  }
  return new Response(null, { status: 204 });
}
