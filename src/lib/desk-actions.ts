"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { storeUpload, uploadedBlob } from "@/lib/blob";
import { removeMedia, removePerson, removeWork, saveMedia, savePerson, saveWork } from "@/lib/db/people";
import { deskErrorMessage, DeskError, logDeskError } from "@/lib/desk-error";
import { assertHttpUrl, field, parseMedia, parsePerson, parseWork, uploadFile } from "@/lib/record";

async function requireDesk() {
  if (!(await isAdmin())) redirect("/admin");
}

function editorPath(slug: string) {
  return slug ? `/admin/people/${slug}` : "/admin/people/new";
}

export async function savePersonAction(formData: FormData) {
  await requireDesk();
  const fallback = field(formData, "originalSlug").trim();
  let slug = "";
  try {
    const draft = parsePerson(formData);
    const portrait = uploadFile(formData, "portrait");
    const uploaded = uploadedBlob(field(formData, "portraitBlobUrl"), field(formData, "portraitBlobType"), "portraits");
    let photoUrl = draft.photoUrl;
    if (uploaded) {
      photoUrl = uploaded.url;
    } else if (portrait) {
      const stored = await storeUpload(portrait, "portraits");
      photoUrl = stored.url;
    }
    if (!photoUrl) throw new DeskError("Add a portrait file or a portrait URL.");
    assertHttpUrl(photoUrl);
    slug = await savePerson(draft, photoUrl);
  } catch (error) {
    unstable_rethrow(error);
    logDeskError(error);
    redirect(`${editorPath(fallback)}?error=${encodeURIComponent(deskErrorMessage(error))}`);
  }
  revalidatePath("/", "layout");
  redirect(`/admin/people/${slug}?saved=page`);
}

export async function deletePersonAction(formData: FormData) {
  await requireDesk();
  const slug = field(formData, "personSlug").trim();
  let name = "";
  try {
    if (field(formData, "confirm") !== "delete") {
      throw new DeskError("Confirm before removing this page.");
    }
    const removed = await removePerson(slug);
    if (!removed) throw new DeskError("That page is no longer on the desk.");
    name = removed;
  } catch (error) {
    unstable_rethrow(error);
    logDeskError(error);
    redirect(`${editorPath(slug)}?error=${encodeURIComponent(deskErrorMessage(error))}`);
  }
  revalidatePath("/", "layout");
  redirect(`/admin?removed=${encodeURIComponent(name)}`);
}

export async function saveWorkAction(formData: FormData) {
  await requireDesk();
  const personSlug = field(formData, "personSlug").trim();
  try {
    const draft = parseWork(formData);
    await saveWork(draft);
  } catch (error) {
    unstable_rethrow(error);
    logDeskError(error);
    redirect(`${editorPath(personSlug)}?error=${encodeURIComponent(deskErrorMessage(error))}`);
  }
  revalidatePath("/", "layout");
  redirect(`${editorPath(personSlug)}?saved=work`);
}

export async function deleteWorkAction(formData: FormData) {
  await requireDesk();
  const personSlug = field(formData, "personSlug").trim();
  try {
    if (field(formData, "confirm") !== "delete") {
      throw new DeskError("Confirm before removing this work.");
    }
    await removeWork(personSlug, field(formData, "workId").trim());
  } catch (error) {
    unstable_rethrow(error);
    logDeskError(error);
    redirect(`${editorPath(personSlug)}?error=${encodeURIComponent(deskErrorMessage(error))}`);
  }
  revalidatePath("/", "layout");
  redirect(`${editorPath(personSlug)}?saved=work-removed`);
}

export async function saveMediaAction(formData: FormData) {
  await requireDesk();
  const personSlug = field(formData, "personSlug").trim();
  try {
    const draft = parseMedia(formData);
    const file = uploadFile(formData, "file");
    const uploaded = uploadedBlob(field(formData, "fileBlobUrl"), field(formData, "fileBlobType"), "work");
    const stored = uploaded ?? (file ? await storeUpload(file, "work") : null);
    if (stored) {
      draft.url = stored.url;
      draft.kind = stored.kind;
      if (!draft.alt && stored.kind === "image") {
        draft.alt = draft.title || "Photograph kept with this work.";
      }
    }
    if (!draft.url) throw new DeskError("Add a file or a link.");
    assertHttpUrl(draft.url);
    await saveMedia(draft);
  } catch (error) {
    unstable_rethrow(error);
    logDeskError(error);
    redirect(`${editorPath(personSlug)}?error=${encodeURIComponent(deskErrorMessage(error))}`);
  }
  revalidatePath("/", "layout");
  redirect(`${editorPath(personSlug)}?saved=media`);
}

export async function deleteMediaAction(formData: FormData) {
  await requireDesk();
  const personSlug = field(formData, "personSlug").trim();
  try {
    if (field(formData, "confirm") !== "delete") {
      throw new DeskError("Confirm before removing this media.");
    }
    await removeMedia(personSlug, field(formData, "workId").trim(), field(formData, "mediaId").trim());
  } catch (error) {
    unstable_rethrow(error);
    logDeskError(error);
    redirect(`${editorPath(personSlug)}?error=${encodeURIComponent(deskErrorMessage(error))}`);
  }
  revalidatePath("/", "layout");
  redirect(`${editorPath(personSlug)}?saved=media-removed`);
}
