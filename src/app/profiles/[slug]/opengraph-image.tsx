import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getPublishedProfile } from "@/lib/content";
import { categoryCopy, getLocale } from "@/lib/i18n";
import { localizeProfile } from "@/lib/localize";
import { messages } from "@/lib/messages";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portrait and name on a Shukran TZ tribute page.";

export default async function ProfileOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const copy = messages[locale];
  const source = await getPublishedProfile(slug);
  const profile = source ? localizeProfile(source, locale) : null;

  if (!profile) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f4efe6",
            color: "#1b1814",
            fontSize: 56,
          }}
        >
          {copy.notOnRecord}
        </div>
      ),
      { ...size },
    );
  }

  const src = await portraitDataUrl(profile.photo);
  const category = categoryCopy(profile.category, locale);
  const honor = copy.medals[profile.honorMedal];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f4efe6",
          color: "#1b1814",
        }}
      >
        {src ? (
          <img src={src} alt="" width={500} height={630} style={{ width: 500, height: 630, objectFit: "cover" }} />
        ) : (
          <div style={{ width: 500, height: 630, background: "#1c5c44" }} />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "56px 52px",
            width: 700,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#1c5c44" }}>SHUKRAN TZ</div>
          <div style={{ display: "flex", fontSize: 64, lineHeight: 1.02, marginTop: 28 }}>{profile.name}</div>
          <div style={{ display: "flex", fontSize: 28, lineHeight: 1.35, marginTop: 24, color: "#514b43" }}>
            {profile.oneLiner}
          </div>
          <div style={{ display: "flex", marginTop: "auto", fontSize: 22 }}>
            {category.name} · {profile.place} · {copy.honor} {honor}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

async function portraitDataUrl(photo: string) {
  try {
    if (photo.startsWith("/")) {
      const bytes = await readFile(path.join(process.cwd(), "public", photo.replace(/^\//, "")));
      const ext = path.extname(photo).toLowerCase();
      const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
      return `data:${mime};base64,${bytes.toString("base64")}`;
    }
    if (photo.startsWith("https://")) {
      const response = await fetch(photo);
      if (!response.ok) return null;
      const bytes = Buffer.from(await response.arrayBuffer());
      const mime = response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
      return `data:${mime};base64,${bytes.toString("base64")}`;
    }
  } catch {
    return null;
  }
  return null;
}
