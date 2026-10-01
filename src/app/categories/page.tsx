import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { getPublishedProfiles } from "@/lib/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse living tributes by Tech & innovation, Science & health, Arts & culture, and Community & service.",
  alternates: { canonical: "/categories" },
};

const accentClass = {
  pine: "bg-pine",
  clay: "bg-clay",
  plum: "bg-plum",
  gold: "bg-gold",
} as const;

export default async function CategoriesPage() {
  const published = await getPublishedProfiles();
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <p className="text-xs uppercase tracking-[0.22em] text-primary">Browse</p>
      <h1 className="mt-4 max-w-[12ch] font-display text-5xl leading-[0.92] tracking-tight sm:text-7xl">
        Four rooms, one record.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        Choose a category and read the work. Pages are published by editors and offered side by side.
      </p>
      <ul className="mt-14 grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const count = published.filter((profile) => profile.category === category.slug).length;
          return (
            <li key={category.slug}>
              <Card className="relative h-full rounded-md shadow-none transition-colors hover:bg-secondary">
                <CardHeader>
                  <span className={`h-1.5 w-12 ${accentClass[category.accent]}`} aria-hidden="true" />
                  <CardTitle className="mt-5 font-display text-4xl font-normal tracking-tight">
                    <Link href={`/categories/${category.slug}`} className="after:absolute after:inset-0">
                      {category.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">{category.blurb}</p>
                  <p className="mt-6 text-xs uppercase tracking-[0.16em]">
                    {count} {count === 1 ? "public page" : "public pages"}
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
