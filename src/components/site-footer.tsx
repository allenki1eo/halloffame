import Link from "next/link";
import { Mark } from "@/components/mark";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-pine-deep text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Mark />
            <p className="font-display text-2xl">Shukran TZ</p>
          </div>
          <p className="mt-4 max-w-md text-paper/85">
            A living tribute. Working title. Shukran is a word of thanks.
          </p>
        </div>
        <div className="text-sm leading-relaxed text-paper/85">
          <p>
            The people in this preview are fictional, written so the form of a page can be read
            before real stories are published with consent.
          </p>
          <p className="mt-3">
            Editors prepare each page. A suggestion is a private note for the desk. Pages sit side
            by side, in the order of the record.
          </p>
          <nav aria-label="Footer" className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/categories" className="underline decoration-paper/40 underline-offset-4">
              Categories
            </Link>
            <Link href="/suggest" className="underline decoration-paper/40 underline-offset-4">
              Suggest someone
            </Link>
            <Link href="/admin" className="underline decoration-paper/40 underline-offset-4">
              Editorial desk
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
