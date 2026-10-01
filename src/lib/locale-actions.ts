"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { localeCookie } from "@/lib/i18n";

export async function setLocale(formData: FormData) {
  const requested = formData.get("locale");
  const locale = requested === "sw" ? "sw" : "en";
  const jar = await cookies();
  jar.set(localeCookie, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });
  revalidatePath("/", "layout");
  const next = formData.get("next");
  const path = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  redirect(path);
}
