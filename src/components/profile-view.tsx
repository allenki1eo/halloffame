import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/lib/categories";
import { ShareBar } from "@/components/share-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/lib/types";

const accentClass = {
  pine: "bg-pine",
  clay: "bg-clay",
  plum: "bg-plum",
  gold: "bg-gold",
} as const;

export function ProfileView({
  profile,
  mode = "public",
}: {
  profile: Profile;
  mode?: "public" | "preview";
}) {
  const category = getCategory(profile.category);
  const accent = category ? accentClass[category.accent] : "bg-pine";
  const publicPath = `/profiles/${profile.slug}`;

  return (
    <article>
      {mode === "preview" ? (
        <p className="bg-foreground px-5 py-3 text-center text-sm text-background">
          {profile.status === "published"
            ? "Desk preview. This page is on the public site."
            : "Desk preview. Editors have not published this page yet."}
        </p>
      ) : null}

      <div className="mx-auto max-w-6xl px-5 pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline decoration-border underline-offset-4 hover:decoration-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              {category ? (
                <Link
                  href={`/categories/${category.slug}`}
                  className="underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  {category.name}
                </Link>
              ) : (
                "Category"
              )}
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">
              {profile.name}
            </li>
          </ol>
        </nav>
      </div>

      <header className="mx-auto mt-6 max-w-6xl px-5">
        <figure className="frame relative min-h-[70vh] overflow-hidden bg-muted lg:min-h-[82vh]">
          <Image
            src={profile.photo}
            alt={profile.photoAlt}
            fill
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover object-[center_20%]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-5 pb-8 pt-28 text-white sm:px-10 sm:pb-12">
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/85">
              <span className={`inline-block h-2.5 w-2.5 ${accent}`} aria-hidden="true" />
              {category?.name}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.92] tracking-tight text-white sm:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-snug text-white/95 sm:text-2xl">{profile.oneLiner}</p>
            <p className="mt-3 text-sm text-white/80">
              {profile.role}
              <span className="px-2" aria-hidden="true">
                ·
              </span>
              {profile.place}
            </p>
            <Button asChild variant="secondary" className="mt-6">
              <a href="#work">Their work</a>
            </Button>
          </figcaption>
        </figure>
        <p className="mt-3 text-sm text-muted-foreground">{profile.place}. Portrait for this tribute page.</p>
      </header>

      <section id="work" aria-labelledby="work-heading" className="rise scroll-mt-24 pt-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Portfolio</p>
          <h2 id="work-heading" className="mt-3 max-w-3xl font-display text-5xl leading-none tracking-tight sm:text-7xl">
            Their work
          </h2>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            The record starts here: projects, what they asked of people, and what changed.
          </p>
        </div>
        <ol className="mt-12">
          {profile.work.map((item) => (
            <li key={item.title} className="border-t border-border">
              <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-12 md:py-20">
                <p className="font-display text-3xl tracking-tight text-primary md:col-span-4">{item.years}</p>
                <div className="md:col-span-8">
                  <h3 className="font-display text-4xl leading-none tracking-tight sm:text-6xl">{item.title}</h3>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed">{item.summary}</p>
                  <Card className="mt-8 max-w-2xl rounded-md bg-secondary shadow-none ring-0">
                    <CardHeader>
                      <CardDescription className="text-xs uppercase tracking-[0.16em] text-primary">
                        What changed
                      </CardDescription>
                      <CardTitle className="font-display text-2xl font-normal leading-snug">{item.outcome}</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="journey-heading" className="rise mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Open letter</p>
          <h2 id="journey-heading" className="mt-3 font-display text-5xl tracking-tight">
            The journey
          </h2>
        </div>
        <div className="letter max-w-2xl space-y-6 text-lg leading-relaxed lg:col-span-8">
          {profile.journey.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section aria-labelledby="why-heading" className="rise bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-background/70">For the country</p>
          <h2 id="why-heading" className="mt-4 max-w-4xl font-display text-4xl leading-tight tracking-tight sm:text-6xl">
            Why this matters for Tanzania
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-background/90">
            {profile.whyItMatters.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="share-heading" className="mx-auto max-w-6xl px-5 py-16">
        <Separator className="mb-10" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="share-heading" className="font-display text-4xl tracking-tight">
              Pass this page on
            </h2>
            {profile.status === "published" ? (
              <p className="mt-3 max-w-xl text-muted-foreground">
                Share the work with a classroom, a newsroom, or someone far from home.
              </p>
            ) : (
              <p className="mt-3 max-w-xl text-muted-foreground">Sharing opens once editors publish this page.</p>
            )}
          </div>
          {profile.status === "published" ? (
            <ShareBar name={profile.name} oneLiner={profile.oneLiner} path={publicPath} />
          ) : null}
        </div>
        <Badge variant="outline" className="mt-8 h-7 px-3">
          {category?.name}
        </Badge>
      </section>
    </article>
  );
}
