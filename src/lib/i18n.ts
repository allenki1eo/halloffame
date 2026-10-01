import { cookies } from "next/headers";
import { messages, type Locale } from "@/lib/messages";
import type { CategorySlug } from "@/lib/types";

export const localeCookie = "shukran_lang";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  return jar.get(localeCookie)?.value === "sw" ? "sw" : "en";
}

export function htmlLang(locale: Locale) {
  return locale === "sw" ? "sw-TZ" : "en-TZ";
}

export function categoryCopy(slug: CategorySlug, locale: Locale) {
  return messages[locale].category[slug];
}
