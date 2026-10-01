import { put } from "@vercel/blob";
import { DeskError } from "@/lib/desk-error";
import type { MediaKind } from "@/lib/types";

const imageLimit = 8 * 1024 * 1024;
const videoLimit = 45 * 1024 * 1024;

export function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export async function storeUpload(file: File, folder: "portraits" | "work") {
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
  const blob = await put(`shukran/${folder}/${crypto.randomUUID()}-${safe}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: type || undefined,
  });

  const kind: MediaKind = isVideo ? "video" : "image";
  return { url: blob.url, kind };
}
