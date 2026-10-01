import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { getPublishedByCategory } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.blurb,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} — Shukran TZ`,
      description: category.blurb,
      url: `/categories/${category.slug}`,
    },
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

const accentClass = {
  pine: "bg-pine",
  clay: "bg-clay",
  plum: "bg-plum",
  gold: "bg-gold",
} as const;

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const profiles = getPublishedByCategory(category.slug);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/categories" className="underline decoration-line underline-offset-4">
              Categories
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{category.name}</li>
        </ol>
      </nav>
      <p className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted">
        <span className={`inline-block h-2.5 w-2.5 ${accentClass[category.accent]}`} aria-hidden="true" />
        Category
      </p>
      <h1 className="mt-3 font-display text-5xl leading-none tracking-tight sm:text-6xl">{category.name}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{category.blurb}</p>

      {profiles.length === 0 ? (
        <p className="mt-12 border-t border-line py-10 text-lg">
          No public page in this category yet. Editors publish from the desk, and anyone may{" "}
          <Link href="/suggest" className="underline decoration-pine underline-offset-4">
            suggest someone
          </Link>
          .
        </p>
      ) : (
        <ol className="mt-12 divide-y divide-line border-t border-line">
          {profiles.map((profile) => (
            <li key={profile.slug} className="grid gap-6 py-8 md:grid-cols-[9rem_1fr] md:items-start">
              <Link href={`/profiles/${profile.slug}`} tabIndex={-1} aria-hidden="true" className="relative block aspect-[3/4] overflow-hidden bg-line">
                <Image src={profile.photo} alt="" fill sizes="144px" className="object-cover" />
              </Link>
              <article>
                <p className="text-sm text-muted">
                  {profile.role} · {profile.place}
                </p>
                <h2 className="mt-1 font-display text-4xl tracking-tight">
                  <Link href={`/profiles/${profile.slug}`} className="hover:text-pine">
                    {profile.name}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl text-lg">{profile.oneLiner}</p>
                {profile.work[0] ? (
                  <p className="mt-5 max-w-2xl border-l-2 border-line pl-4">
                    <span className="text-xs uppercase tracking-[0.16em] text-pine">Their work</span>
                    <span className="mt-2 block font-display text-2xl">{profile.work[0].title}</span>
                    <span className="mt-2 block leading-relaxed text-muted">{profile.work[0].summary}</span>
                    <span className="mt-2 block">{profile.work[0].outcome}</span>
                  </p>
                ) : null}
                <Link
                  href={`/profiles/${profile.slug}#work`}
                  className="mt-5 inline-flex min-h-11 items-center text-sm uppercase tracking-[0.14em] underline decoration-pine/40 underline-offset-4"
                >
                  Read the full record
                </Link>
              </article>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
