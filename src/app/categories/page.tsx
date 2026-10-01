import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { getPublishedProfiles } from "@/lib/content";
import { categoryCopy, getLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const copy = messages[await getLocale()];
  return {
    title: copy.categories,
    description: copy.categoriesDek,
    alternates: { canonical: "/categories" },
  };
}

const accentClass = {
  pine: "bg-pine",
  clay: "bg-clay",
  plum: "bg-plum",
  gold: "bg-gold",
} as const;

export default async function CategoriesPage() {
  const locale = await getLocale();
  const copy = messages[locale];
  const published = await getPublishedProfiles();
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <p className="text-xs uppercase tracking-[0.22em] text-primary">{copy.browse}</p>
      <h1 className="mt-4 max-w-[14ch] font-display text-5xl leading-[0.92] tracking-tight sm:text-7xl">
        {copy.fourRooms}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{copy.categoriesDek}</p>
      <ul className="mt-14 grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const count = published.filter((profile) => profile.category === category.slug).length;
          const text = categoryCopy(category.slug, locale);
          return (
            <li key={category.slug}>
              <Card className="relative h-full rounded-md shadow-none transition-colors hover:bg-secondary">
                <CardHeader>
                  <span className={`h-1.5 w-12 ${accentClass[category.accent]}`} aria-hidden="true" />
                  <CardTitle className="mt-5 font-display text-4xl font-normal tracking-tight">
                    <Link
                      href={`/categories/${category.slug}`}
                      data-track="open_category"
                      className="after:absolute after:inset-0"
                    >
                      {text.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">{text.blurb}</p>
                  <p className="mt-6 text-xs uppercase tracking-[0.16em]">
                    {count} {count === 1 ? copy.listedPage : copy.listedPages}
                  </p>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
