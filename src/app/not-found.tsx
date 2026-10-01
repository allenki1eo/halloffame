import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";

export default async function NotFound() {
  const copy = messages[await getLocale()];
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">404</p>
      <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">{copy.notOnRecord}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">{copy.notOnRecordBody}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">{copy.home}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/categories">{copy.browseCategories}</Link>
        </Button>
      </div>
    </div>
  );
}
