import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "shukran_desk";

function editorPin() {
  return process.env.ADMIN_PIN?.trim() || "tribute";
}

function digest(value: string) {
  return createHmac("sha256", "shukran-tz-desk").update(value).digest();
}

export function pinMatches(input: string) {
  const left = digest(input);
  const right = digest(editorPin());
  return timingSafeEqual(left, right);
}

function sessionValue() {
  return createHmac("sha256", editorPin()).update("shukran-desk-session").digest("hex");
}

export async function isAdmin() {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return false;
  const left = Buffer.from(value);
  const right = Buffer.from(sessionValue());
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
