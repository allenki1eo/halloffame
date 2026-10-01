import Link from "next/link";
import { Mark } from "@/components/mark";
import { Separator } from "@/components/ui/separator";
import { getLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";

export async function SiteFooter() {
  const locale = await getLocale();
  const m = messages[locale];

  return (
    <footer className="mt-8 bg-pine-deep text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-center gap-3">
          <Mark />
          <p className="font-display text-4xl tracking-tight">Shukran TZ</p>
        </div>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85">{m.footerLine}</p>
        <Separator className="my-8 bg-primary-foreground/20" />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3 text-sm leading-relaxed text-primary-foreground/80">
            <p>{m.footerFictional}</p>
            <p>{m.footerEditors}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-3 text-lg">
            <Link
              href="/categories"
              data-track="open_category"
              className="inline-flex min-h-11 items-center underline decoration-primary-foreground/30 underline-offset-4"
            >
              {m.categories}
            </Link>
            <Link
              href="/suggest"
              data-track="suggest"
              className="inline-flex min-h-11 items-center underline decoration-primary-foreground/30 underline-offset-4"
            >
              {m.suggestSomeone}
            </Link>
            <Link href="/admin" className="underline decoration-primary-foreground/30 underline-offset-4">
              {m.editorialDesk}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
