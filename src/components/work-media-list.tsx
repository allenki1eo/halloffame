import { CoverImage } from "@/components/cover-image";
import type { WorkMedia } from "@/lib/types";

function playableVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || url.includes(".blob.vercel-storage.com");
}

export function WorkMediaList({ media }: { media: WorkMedia[] }) {
  if (media.length === 0) return null;

  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {media.map((item) => (
        <li key={item.id} className="overflow-hidden rounded-md border border-border bg-card">
          {item.kind === "image" ? (
            <div className="relative aspect-[4/3] bg-muted">
              <CoverImage src={item.url} alt={item.alt || item.title || "Photograph of the work"} sizes="(min-width: 768px) 28rem, 100vw" />
            </div>
          ) : null}
          {item.kind === "video" && playableVideo(item.url) ? (
            <video controls preload="metadata" className="aspect-video w-full bg-foreground" src={item.url} />
          ) : null}
          <div className="space-y-2 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-primary">
              {item.kind === "image" ? "Image" : item.kind === "video" ? "Video" : "Link"}
            </p>
            {item.title ? <p className="font-display text-2xl leading-tight">{item.title}</p> : null}
            {item.caption ? <p className="text-sm leading-relaxed text-muted-foreground">{item.caption}</p> : null}
            {item.kind !== "image" ? (
              <a
                href={item.url}
                className="inline-flex min-h-11 items-center text-sm underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                {item.kind === "video" ? "Open the video" : "Open the link"}
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
