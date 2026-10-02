"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { CircleCheck, CircleAlert, LoaderCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Vercel rejects function request bodies over 4.5 MB; leave headroom for the other fields. */
const formBodyLimit = 4 * 1024 * 1024;
const imageLimit = 8 * 1024 * 1024;
const videoLimit = 45 * 1024 * 1024;

type Status =
  | { state: "idle" }
  | { state: "uploading"; name: string; percent: number }
  | { state: "done"; name: string; url: string; contentType: string }
  | { state: "fallback"; name: string; message: string }
  | { state: "error"; message: string };

function megabytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "file";
}

/**
 * A file field that sends the file straight from the browser to Vercel Blob, then
 * hands the form only the resulting link. Large photographs and videos never pass
 * through the server action, so they are not stopped by the platform body limit.
 */
export function DirectUpload({
  id,
  name,
  folder,
  accept,
  uploadsEnabled,
}: {
  id: string;
  name: string;
  folder: "portraits" | "work";
  accept: string;
  uploadsEnabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const busy = useRef(false);

  useEffect(() => {
    busy.current = status.state === "uploading";
  }, [status.state]);

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    function onSubmit(event: SubmitEvent) {
      if (!busy.current) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    form.addEventListener("submit", onSubmit, { capture: true });
    return () => form.removeEventListener("submit", onSubmit, { capture: true });
  }, []);

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    setStatus({ state: "idle" });
  }

  async function onChange() {
    const input = inputRef.current;
    const file = input?.files?.[0];
    if (!input || !file) {
      setStatus({ state: "idle" });
      return;
    }

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isImage && !(isVideo && folder === "work")) {
      input.value = "";
      setStatus({ state: "error", message: folder === "work" ? "Choose an image or a video." : "Choose an image." });
      return;
    }
    const limit = isVideo ? videoLimit : imageLimit;
    if (file.size > limit) {
      input.value = "";
      setStatus({
        state: "error",
        message: `${file.name} is ${megabytes(file.size)}. ${isVideo ? "Videos" : "Images"} need to be under ${megabytes(limit)}.`,
      });
      return;
    }

    if (!uploadsEnabled) {
      if (file.size > formBodyLimit) {
        input.value = "";
        setStatus({ state: "error", message: "Uploads need a Vercel Blob store. Paste a link instead." });
        return;
      }
      setStatus({ state: "fallback", name: file.name, message: "This file will be sent with the form." });
      return;
    }

    setStatus({ state: "uploading", name: file.name, percent: 0 });
    try {
      const blob = await upload(`shukran/${folder}/${safeName(file.name)}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob-upload",
        contentType: file.type,
        multipart: file.size > 8 * 1024 * 1024,
        onUploadProgress: ({ percentage }) =>
          setStatus((current) =>
            current.state === "uploading" ? { ...current, percent: Math.round(percentage) } : current,
          ),
      });
      input.value = "";
      setStatus({ state: "done", name: file.name, url: blob.url, contentType: blob.contentType || file.type });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "";
      if (file.size <= formBodyLimit) {
        setStatus({
          state: "fallback",
          name: file.name,
          message: "The direct upload did not go through, so this file will be sent with the form.",
        });
        return;
      }
      input.value = "";
      setStatus({
        state: "error",
        message: reason ? `The upload did not go through: ${reason}` : "The upload did not go through. Try again, or paste a link.",
      });
    }
  }

  const done = status.state === "done" ? status : null;

  return (
    <div className="space-y-3">
      <input type="hidden" name={`${name}BlobUrl`} value={done?.url ?? ""} />
      <input type="hidden" name={`${name}BlobType`} value={done?.contentType ?? ""} />

      <label
        htmlFor={id}
        className="group flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-input bg-background px-4 py-5 text-center transition-colors hover:border-primary hover:bg-secondary/40 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
      >
        <Upload aria-hidden="true" className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
        <span className="text-sm">
          <span className="font-medium text-primary underline decoration-primary/30 underline-offset-4">Choose a file</span>
          <span className="text-muted-foreground"> to upload</span>
        </span>
        <span className="text-xs text-muted-foreground">
          {folder === "work" ? "Images up to 8 MB · videos up to 45 MB" : "Images up to 8 MB"}
        </span>
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          onChange={onChange}
          disabled={status.state === "uploading"}
          className="sr-only"
        />
      </label>

      <div aria-live="polite">
        {status.state === "uploading" ? (
          <div className="border border-border bg-card px-4 py-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <LoaderCircle aria-hidden="true" className="size-4 shrink-0 animate-spin text-primary" />
                <span className="truncate">Uploading {status.name}</span>
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">{status.percent}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden bg-secondary" aria-hidden="true">
              <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${status.percent}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Keep this page open. Saving waits for the upload.</p>
          </div>
        ) : null}

        {status.state === "done" ? (
          <div className="flex items-center justify-between gap-3 border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-primary" />
              <span className="truncate">{status.name} is uploaded. Save to keep it.</span>
            </span>
            <Button type="button" variant="ghost" size="icon" onClick={clear} aria-label={`Remove ${status.name}`}>
              <X aria-hidden="true" />
            </Button>
          </div>
        ) : null}

        {status.state === "fallback" ? (
          <div className="flex items-center justify-between gap-3 border border-border bg-card px-4 py-3 text-sm">
            <span className="min-w-0">
              <span className="block truncate">{status.name}</span>
              <span className="block text-xs text-muted-foreground">{status.message}</span>
            </span>
            <Button type="button" variant="ghost" size="icon" onClick={clear} aria-label={`Remove ${status.name}`}>
              <X aria-hidden="true" />
            </Button>
          </div>
        ) : null}

        {status.state === "error" ? (
          <p role="alert" className="flex items-start gap-2 text-sm text-destructive">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {status.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
