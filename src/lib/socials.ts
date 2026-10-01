import type { SocialKind, SocialLink } from "@/lib/types";
import { socialKinds } from "@/lib/types";

export function isSocialKind(value: string): value is SocialKind {
  return (socialKinds as readonly string[]).includes(value);
}

export function socialHref(link: SocialLink) {
  if (link.kind === "email") {
    const address = link.url.replace(/^mailto:/i, "").trim();
    return `mailto:${address}`;
  }
  if (link.kind === "whatsapp") {
    if (/^https?:\/\//i.test(link.url)) return link.url;
    const digits = link.url.replace(/\D/g, "");
    return `https://wa.me/${digits}`;
  }
  return link.url;
}

export function parseSocialList(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  const links: SocialLink[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const kind = typeof row.kind === "string" ? row.kind : "";
    const url = typeof row.url === "string" ? row.url.trim() : "";
    if (!isSocialKind(kind) || !url) continue;
    links.push({ kind, url });
  }
  return links.slice(0, 8);
}
