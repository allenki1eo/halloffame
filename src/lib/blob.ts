import { put } from "@vercel/blob";
import { DeskError } from "@/lib/desk-error";
import type { MediaKind } from "@/lib/types";

export const imageLimit = 8 * 1024 * 1024;
export const videoLimit = 45 * 1024 * 1024;

export const uploadFolders = ["portraits", "work"] as const;

export type UploadFolder = (typeof uploadFolders)[number];

/**
 * A file the browser already sent to Blob arrives as a URL plus its media type.
 * Only accept links that point at a Vercel Blob store.
 */
export function uploadedBlob(url: string, contentType: string, folder: UploadFolder) {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new DeskError("The uploaded file link could not be read. Upload it again.");
  }
  if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(".blob.vercel-storage.com")) {
    throw new DeskError("The uploaded file link could not be read. Upload it again.");
  }
  const isVideo = contentType.startsWith("video/");
  if (folder === "portraits" && isVideo) throw new DeskError("A portrait file needs to be an image.");
  const kind: MediaKind = isVideo ? "video" : "image";
  return { url: parsed.toString(), kind };
}

export function blobStoreId() {
  return process.env.BLOB_STORE_ID?.trim() || "";
}

export function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim() || blobStoreId());
}

export async function storeUpload(file: File, folder: UploadFolder) {
  if (!blobConfigured()) {
    throw new DeskError(
      "File upload needs BLOB_READ_WRITE_TOKEN. Create a Vercel Blob store and paste the token, or paste a link instead of a file.",
    );
  }

  const type = file.type || "";
  const isImage = type.startsWith("image/");
  const isVideo = type.startsWith("video/");
  if (folder === "portraits" && !isImage) {
    throw new DeskError("A portrait file needs to be an image.");
  }
  if (!isImage && !isVideo) {
    throw new DeskError("Upload an image or a video, or paste a link.");
  }

  const limit = isVideo ? videoLimit : imageLimit;
  if (file.size > limit) {
    throw new DeskError(isVideo ? "Video files need to be under 45 MB." : "Image files need to be under 8 MB.");
  }

  const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "file";
  const storeId = blobStoreId();
  const blob = await put(`shukran/${folder}/${crypto.randomUUID()}-${safe}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    ...(storeId ? { storeId } : {}),
    contentType: type || undefined,
  });

  const kind: MediaKind = isVideo ? "video" : "image";
  return { url: blob.url, kind };
}
