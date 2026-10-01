import Link from "next/link";
import { categories } from "@/lib/categories";
import { CoverImage } from "@/components/cover-image";
import { getPublishedProfiles } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

const accentClass = {
  pine: "bg-pine",
  clay: "bg-clay",
  plum: "bg-plum",
  gold: "bg-gold",
} as const;

export default async function HomePage() {
  const published = await getPublishedProfiles();
  const opening = published[0];
  const rest = published.slice(1);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Shukran TZ",
    url: absoluteUrl("/"),
    description: "A living tribute to Tanzanians and their work. Editors publish each page.",
    inLanguage: "en-TZ",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="mx-auto grid max-w-6xl items-end gap-10 px-5 py-12 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-5 lg:pb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Karibu · Tanzania</p>
          <h1 className="mt-5 max-w-[11ch] font-display text-[3.2rem] leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
            The work is the tribute.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Shukran TZ is a living tribute: a place to find Tanzanians, well known and still unsung,
            and to spend time with what they have made. Editors publish each page.
          </p>
        </div>

        {opening ? (
          <article className="lg:col-span-7">
            <figure className="frame relative aspect-[4/5] overflow-hidden bg-muted sm:aspect-[5/6]">
              <CoverImage
                src={opening.photo}
                alt={opening.photoAlt}
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-[center_18%]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-6 pt-24 text-white sm:px-7 sm:pb-8">
                <p className="text-xs uppercase tracking-[0.18em] text-white/80">Opening page</p>
                <h2 className="mt-2 font-display text-4xl leading-none tracking-tight sm:text-6xl">
                  <Link href={`/profiles/${opening.slug}`} className="text-white">
                    {opening.name}
                  </Link>
                </h2>
                <p className="mt-3 max-w-md text-white/90">{opening.oneLiner}</p>
                <p className="mt-2 text-sm text-white/75">
                  {opening.role} · {opening.place}
                </p>
              </figcaption>
            </figure>
            {opening.work[0] ? (
              <div className="mt-6 border-l-2 border-primary pl-4">
                <p className="text-xs uppercase tracking-[0.16em] text-primary">Their work</p>
                <p className="mt-2 font-display text-2xl">{opening.work[0].title}</p>
                <p className="mt-2 text-muted-foreground">{opening.work[0].outcome}</p>
              </div>
            ) : null}
            <Button asChild size="lg" className="mt-6">
              <Link href={`/profiles/${opening.slug}`}>Read the work</Link>
            </Button>
          </article>
        ) : (
          <p className="text-lg text-muted-foreground lg:col-span-7">
            The public record is empty. Editors publish pages from the desk.
          </p>
        )}
      </section>

      {rest.length > 0 ? (
        <section aria-labelledby="record-heading" className="rise border-t border-border">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="flex items-end justify-between gap-4">
              <h2 id="record-heading" className="font-display text-4xl tracking-tight sm:text-5xl">
                On the record
              </h2>
              <p className="text-sm text-muted-foreground">{published.length} pages</p>
            </div>
            <Separator className="mt-6" />
            <ol>
              {rest.map((profile) => {
                const category = categories.find((item) => item.slug === profile.category);
                return (
                  <li key={profile.slug} className="border-b border-border">
                    <article className="group grid items-center gap-5 py-6 sm:grid-cols-[5.5rem_1fr_auto]">
                      <Link
                        href={`/profiles/${profile.slug}`}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="frame relative block aspect-[3/4] overflow-hidden bg-muted"
                      >
                        <CoverImage src={profile.photo} alt="" sizes="88px" />
                      </Link>
                      <div>
                        <Badge variant="outline" className="h-6">
                          {category?.name}
                        </Badge>
                        <h3 className="mt-2 font-display text-3xl tracking-tight">
                          <Link href={`/profiles/${profile.slug}`} className="hover:text-primary">
                            {profile.name}
                          </Link>
                        </h3>
                        <p className="mt-2 max-w-xl text-muted-foreground">{profile.oneLiner}</p>
                        {profile.work[0] ? (
                          <p className="mt-2 max-w-xl text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                            <span className="text-primary">{profile.work[0].title}.</span> {profile.work[0].outcome}
                          </p>
                        ) : null}
                      </div>
                      <Button asChild variant="ghost" className="hidden sm:inline-flex">
                        <Link href={`/profiles/${profile.slug}`}>Read</Link>
                      </Button>
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="categories-heading" className="rise mx-auto max-w-6xl px-5 py-8">
        <h2 id="categories-heading" className="font-display text-4xl tracking-tight sm:text-5xl">
          Four ways in
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {categories.map((category) => {
            const count = published.filter((profile) => profile.category === category.slug).length;
            return (
              <li key={category.slug}>
                <Card className="relative h-full rounded-md shadow-none transition-colors hover:bg-secondary">
                  <CardHeader>
                    <span className={`h-1.5 w-12 ${accentClass[category.accent]}`} aria-hidden="true" />
                    <CardTitle className="mt-4 font-display text-3xl font-normal tracking-tight">
                      <Link href={`/categories/${category.slug}`} className="after:absolute after:inset-0">
                        {category.name}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="leading-relaxed text-muted-foreground">{category.blurb}</p>
                    <p className="mt-6 text-xs uppercase tracking-[0.16em]">
                      {count} {count === 1 ? "page" : "pages"}
                    </p>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="arrive-heading" className="rise border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
          <div className="md:col-span-3">
            <h2 id="arrive-heading" className="font-display text-4xl tracking-tight sm:text-5xl">
              How a page arrives
            </h2>
          </div>
          {[
            {
              title: "Editors publish",
              body: "A page is prepared with the work first, then the journey, then why it matters for Tanzania.",
            },
            {
              title: "Anyone may suggest",
              body: "If you know someone the record should hold, send a private note. It stays with the editors.",
            },
            {
              title: "Readers share",
              body: "Pass a page to a classroom, a newsroom, or a cousin abroad. The link is the introduction.",
            },
          ].map((step) => (
            <div key={step.title}>
              <h3 className="font-display text-2xl">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
          <div className="md:col-span-3">
            <Button asChild variant="outline" size="lg">
              <Link href="/suggest">Suggest someone</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
