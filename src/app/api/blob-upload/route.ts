import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/admin-auth";
import { imageLimit, uploadFolders, videoLimit } from "@/lib/blob";

export const dynamic = "force-dynamic";

/**
 * Issues short-lived client tokens so the editor's browser can send files straight
 * to Vercel Blob. Server actions on Vercel cap request bodies at 4.5 MB, which is
 * smaller than most photographs and every video kept with a piece of work.
 */
export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return Response.json({ error: "That upload request could not be read." }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("Unlock the editorial desk before uploading.");
        const folder = uploadFolders.find((name) => pathname.startsWith(`shukran/${name}/`));
        if (!folder) throw new Error("That upload path is not allowed.");
        const videos = folder === "work";
        return {
          allowedContentTypes: videos ? ["image/*", "video/*"] : ["image/*"],
          maximumSizeInBytes: videos ? videoLimit : imageLimit,
          addRandomSuffix: true,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The upload could not start.";
    console.error("[blob-upload]", error);
    return Response.json({ error: message }, { status: 400 });
  }
}
