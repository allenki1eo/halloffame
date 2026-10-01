import type { Metadata } from "next";
import Link from "next/link";
import { CoverImage } from "@/components/cover-image";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { getPublishedByCategory } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const profiles = await getPublishedByCategory(category.slug);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/categories" className="underline decoration-border underline-offset-4">
              Categories
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{category.name}</li>
        </ol>
      </nav>
      <p className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span className={`inline-block h-2.5 w-2.5 ${accentClass[category.accent]}`} aria-hidden="true" />
        Category
      </p>
      <h1 className="mt-4 font-display text-5xl leading-none tracking-tight sm:text-7xl">{category.name}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{category.blurb}</p>

      {profiles.length === 0 ? (
        <p className="mt-14 border-t border-border py-12 text-lg">
          No public page in this category yet. Editors publish from the desk, and anyone may{" "}
          <Link href="/suggest" className="underline decoration-primary underline-offset-4">
            suggest someone
          </Link>
          .
        </p>
      ) : (
        <ol className="mt-14 space-y-8">
          {profiles.map((profile) => (
            <li key={profile.slug}>
              <article className="grid gap-6 border-t border-border pt-8 md:grid-cols-[11rem_1fr] md:items-start">
                <Link
                  href={`/profiles/${profile.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="frame relative block aspect-[3/4] overflow-hidden bg-muted"
                >
                  <CoverImage src={profile.photo} alt="" sizes="176px" />
                </Link>
                <div>
                  <Badge variant="outline">{profile.place}</Badge>
                  <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                    <Link href={`/profiles/${profile.slug}`} className="hover:text-primary">
                      {profile.name}
                    </Link>
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {profile.role}
                  </p>
                  <p className="mt-4 max-w-2xl text-lg">{profile.oneLiner}</p>
                  {profile.work[0] ? (
                    <Card className="mt-6 max-w-2xl rounded-md bg-secondary shadow-none ring-0">
                      <CardContent className="pt-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-primary">Their work</p>
                        <p className="mt-2 font-display text-2xl">{profile.work[0].title}</p>
                        <p className="mt-2 leading-relaxed text-muted-foreground">{profile.work[0].summary}</p>
                        <p className="mt-3">{profile.work[0].outcome}</p>
                      </CardContent>
                    </Card>
                  ) : null}
                  <Button asChild variant="link" className="mt-4 px-0">
                    <Link href={`/profiles/${profile.slug}#work`}>Read the full record</Link>
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
