import Link from "next/link";
import { Mark } from "@/components/mark";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="mt-8 bg-pine-deep text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-center gap-3">
          <Mark />
          <p className="font-display text-4xl tracking-tight">Shukran TZ</p>
        </div>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85">
          A living tribute. Working title. Shukran is a word of thanks.
        </p>
        <Separator className="my-8 bg-primary-foreground/20" />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3 text-sm leading-relaxed text-primary-foreground/80">
            <p>
              The people in this preview are fictional, written so the form of a page can be read
              before real stories are published with consent.
            </p>
            <p>
              Editors prepare each page. A suggestion is a private note for the desk. Pages sit side
              by side, in the order of the record.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-3 text-lg">
            <Link
              href="/categories"
              data-track="open_category"
              className="inline-flex min-h-11 items-center underline decoration-primary-foreground/30 underline-offset-4"
            >
              Categories
            </Link>
            <Link
              href="/suggest"
              data-track="suggest"
              className="inline-flex min-h-11 items-center underline decoration-primary-foreground/30 underline-offset-4"
            >
              Suggest someone
            </Link>
            <Link href="/admin" className="underline decoration-primary-foreground/30 underline-offset-4">
              Editorial desk
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
