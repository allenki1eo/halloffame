import type { Metadata } from "next";
import { SuggestForm } from "@/components/suggest-form";
import { getLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";

export async function generateMetadata(): Promise<Metadata> {
  const copy = messages[await getLocale()];
  return {
    title: copy.suggestSomeone,
    description: copy.suggestDek,
    alternates: { canonical: "/suggest" },
  };
}

export default async function SuggestPage() {
  const copy = messages[await getLocale()];
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-pine">{copy.suggestKicker}</p>
      <h1 className="mt-4 font-display text-5xl leading-[0.92] tracking-tight sm:text-7xl">{copy.suggestSomeone}</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{copy.suggestDek}</p>
      <div className="mt-10">
        <SuggestForm locale={await getLocale()} />
      </div>
    </div>
  );
}
