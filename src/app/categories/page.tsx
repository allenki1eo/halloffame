import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { getPublishedByCategory } from "@/lib/content";

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

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-pine">Browse</p>
      <h1 className="mt-3 max-w-[14ch] font-display text-5xl leading-none tracking-tight sm:text-6xl">
        Four rooms, one record.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted">
        Choose a category and read the work. Pages are published by editors and offered side by side.
      </p>
      <ul className="mt-12 grid gap-5 md:grid-cols-2">
        {categories.map((category, index) => {
          const count = getPublishedByCategory(category.slug).length;
          return (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="block h-full border border-line bg-paper-raised p-7 hover:border-ink"
              >
                <span className="font-display text-2xl text-pine">{String(index + 1).padStart(2, "0")}</span>
                <span className={`mt-6 block h-1.5 w-12 ${accentClass[category.accent]}`} aria-hidden="true" />
                <span className="mt-4 block font-display text-4xl tracking-tight">{category.name}</span>
                <span className="mt-3 block leading-relaxed text-muted">{category.blurb}</span>
                <span className="mt-6 block text-sm uppercase tracking-[0.14em]">
                  {count} {count === 1 ? "public page" : "public pages"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
