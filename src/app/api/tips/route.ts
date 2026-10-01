import { headers } from "next/headers";
import { parseTipInput, saveTip } from "@/lib/tips";

export const dynamic = "force-dynamic";

const successMessage =
  "Thank you. Editors have your suggestion. It is a private note for the desk.";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json(
      { ok: false, message: "Send a JSON body with Content-Type application/json." },
      { status: 415 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "That was not valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, message: "Send a JSON object." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  if (typeof record.company === "string" && record.company.trim()) {
    return Response.json({ ok: true, message: successMessage, storage: "file" });
  }

  const asText = (key: string) => (typeof record[key] === "string" ? record[key] : "");
  const parsed = parseTipInput({
    personName: asText("personName"),
    category: asText("category"),
    place: asText("place"),
    workSummary: asText("workSummary"),
    why: asText("why"),
    suggesterName: asText("suggesterName"),
    contact: asText("contact"),
  });

  if (!parsed.ok) {
    return Response.json(
      { ok: false, message: parsed.formError, errors: parsed.fieldErrors },
      { status: 400 },
    );
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const saved = saveTip(parsed.value, `api:${ip}`);
  if (!saved.ok) {
    return Response.json({ ok: false, message: saved.message }, { status: 429 });
  }

  return Response.json({
    ok: true,
    message: successMessage,
    storage: saved.storage,
    persistence:
      saved.storage === "file"
        ? "Saved to data/tips.json for this preview. Use a database in production."
        : "Held in server memory because the disk was not writable. Use a database in production.",
  });
}
