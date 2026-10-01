"use server";

import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearAdminCookie, isAdmin, pinMatches, setAdminCookie } from "@/lib/admin-auth";
import { updateProfileStatus } from "@/lib/content";
import { deskErrorMessage } from "@/lib/desk-error";
import { parseTipInput, saveTip, type TipField } from "@/lib/tips";

export type TipFormState = {
  success?: boolean;
  storage?: "file" | "memory";
  formError?: string;
  fieldErrors?: Partial<Record<TipField, string>>;
};

export type LoginState = {
  formError?: string;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function submitTip(_prev: TipFormState, formData: FormData): Promise<TipFormState> {
  if (text(formData, "company").trim()) {
    return { success: true, storage: "file" };
  }

  const parsed = parseTipInput({
    personName: text(formData, "personName"),
    category: text(formData, "category"),
    place: text(formData, "place"),
    workSummary: text(formData, "workSummary"),
    why: text(formData, "why"),
    suggesterName: text(formData, "suggesterName"),
    contact: text(formData, "contact"),
  });

  if (!parsed.ok) {
    return { formError: parsed.formError, fieldErrors: parsed.fieldErrors };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const saved = saveTip(parsed.value, ip);
  if (!saved.ok) return { formError: saved.message };
  return { success: true, storage: saved.storage };
}

export async function loginAdmin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const pin = text(formData, "pin");
  if (!pinMatches(pin)) {
    return { formError: "That pin was not recognised." };
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminCookie();
  redirect("/admin");
}

export async function setProfileStatus(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");

  const slug = text(formData, "slug");
  const status = text(formData, "status");
  if (status !== "published" && status !== "draft") redirect("/admin");

  try {
    const updated = await updateProfileStatus(slug, status);
    revalidatePath("/", "layout");
    if (!updated) redirect("/admin?error=That+page+is+no+longer+on+the+desk.");
    redirect(`/admin?updated=${encodeURIComponent(slug)}&status=${status}`);
  } catch (error) {
    unstable_rethrow(error);
    redirect(`/admin?error=${encodeURIComponent(deskErrorMessage(error))}`);
  }
}
