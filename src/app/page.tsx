import Link from "next/link";
import { categories } from "@/lib/categories";
import { CoverImage } from "@/components/cover-image";
import { getPublishedProfiles } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

const accentClass = {
  pine: "bg-pine",
  clay: "bg-clay",
  plum: "bg-plum",
  gold: "bg-gold",
} as const;

const gutter = "px-5 sm:px-8 lg:pl-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] lg:pr-12";

export default async function HomePage() {
  const published = await getPublishedProfiles();
  const opening = published[0];
  const featured = published.slice(1, 3);
  const rest = published.slice(3);
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

      <section className="lg:grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:grid-rows-[1fr_auto]">
        <div className={`order-1 flex flex-col justify-end pt-8 lg:col-start-1 lg:row-start-1 lg:pb-6 ${gutter}`}>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Karibu · Tanzania</p>
          <h1 className="mt-4 max-w-[11ch] font-display text-[3.4rem] leading-[0.88] tracking-tight sm:text-7xl lg:text-[5.4rem]">
            The work is the tribute.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            A living tribute to Tanzanians, well known and still unsung. Begin with the opening page, then
            walk the record.
          </p>
        </div>

        <article className="relative order-2 mt-8 min-h-[72vh] sm:min-h-[78vh] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:h-auto lg:min-h-full">
          {opening ? (
            <figure className="frame absolute inset-0 overflow-hidden bg-muted">
              <CoverImage
                src={opening.photo}
                alt={opening.photoAlt}
                priority
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover object-[center_18%]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-5 pb-6 pt-28 text-white sm:px-8 sm:pb-8">
                <p className="text-xs uppercase tracking-[0.18em] text-white/80">Opening page</p>
                <h2 className="mt-2 max-w-xl font-display text-5xl leading-none tracking-tight sm:text-6xl">
                  <Link href={`/profiles/${opening.slug}`} data-track="open_profile" className="text-white">
                    {opening.name}
                  </Link>
                </h2>
                <p className="mt-3 max-w-md text-lg text-white/92">{opening.oneLiner}</p>
                <p className="mt-2 text-sm text-white/75">
                  {opening.role}
                  <span className="px-2" aria-hidden="true">
                    ·
                  </span>
                  {opening.place}
                </p>
                <Button asChild size="lg" variant="secondary" className="mt-5">
                  <Link href={`/profiles/${opening.slug}#work`} data-track="read_work">
                    Read the work
                  </Link>
                </Button>
              </figcaption>
            </figure>
          ) : (
            <div className="absolute inset-0 flex items-end bg-secondary px-5 py-10">
              <p className="max-w-sm text-lg text-muted-foreground">
                The public record is empty. Editors publish pages from the desk.
              </p>
            </div>
          )}
        </article>

        <nav
          aria-label="Enter the record"
          className={`order-3 border-t border-border lg:col-start-1 lg:row-start-2 ${gutter}`}
        >
          <ul>
            <li>
              <Link href="#record" className="flex min-h-12 items-center justify-between gap-4 py-3">
                <span className="font-display text-2xl tracking-tight">The record</span>
                <span className="text-sm text-muted-foreground">{published.length} pages</span>
              </Link>
            </li>
            <li className="border-t border-border">
              <Link
                href="#categories"
                data-track="open_category"
                className="flex min-h-12 items-center justify-between gap-4 py-3"
              >
                <span className="font-display text-2xl tracking-tight">Categories</span>
                <span className="text-sm text-muted-foreground">Four ways in</span>
              </Link>
            </li>
            <li className="border-t border-border">
              <Link
                href="/suggest"
                data-track="suggest"
                className="flex min-h-12 items-center justify-between gap-4 py-3"
              >
                <span className="font-display text-2xl tracking-tight">Suggest someone</span>
                <span className="text-sm text-muted-foreground">A private note</span>
              </Link>
            </li>
          </ul>
        </nav>
      </section>

      <section id="record" aria-labelledby="record-heading" className="rise scroll-mt-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Side by side</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <h2 id="record-heading" className="font-display text-5xl tracking-tight sm:text-6xl">
              On the record
            </h2>
          </div>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Editors publish each page. The order is the order of the record.
          </p>

          {featured.length > 0 ? (
            <ul className="mt-12 grid gap-8 md:grid-cols-2">
              {featured.map((profile) => {
                const category = categories.find((item) => item.slug === profile.category);
                return (
                  <li key={profile.slug}>
                    <article className="group">
                      <Link
                        href={`/profiles/${profile.slug}`}
                        data-track="open_profile"
                        className="frame relative block aspect-[4/5] overflow-hidden bg-muted"
                      >
                        <CoverImage src={profile.photo} alt={profile.photoAlt} sizes="(min-width: 768px) 40vw, 100vw" />
                      </Link>
                      <Badge variant="outline" className="mt-4 h-6">
                        {category?.name}
                      </Badge>
                      <h3 className="mt-2 font-display text-4xl tracking-tight">
                        <Link href={`/profiles/${profile.slug}`} data-track="open_profile" className="hover:text-primary">
                          {profile.name}
                        </Link>
                      </h3>
                      <p className="mt-2 max-w-md text-muted-foreground">{profile.oneLiner}</p>
                      {profile.work[0] ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                          <span className="text-primary">{profile.work[0].title}.</span> {profile.work[0].outcome}
                        </p>
                      ) : null}
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {rest.length > 0 ? (
            <ol className="mt-14">
              <Separator />
              {rest.map((profile) => {
                const category = categories.find((item) => item.slug === profile.category);
                return (
                  <li key={profile.slug} className="border-b border-border">
                    <article className="group grid items-center gap-5 py-6 sm:grid-cols-[7rem_1fr_auto]">
                      <Link
                        href={`/profiles/${profile.slug}`}
                        data-track="open_profile"
                        tabIndex={-1}
                        aria-hidden="true"
                        className="frame relative block aspect-[3/4] overflow-hidden bg-muted"
                      >
                        <CoverImage src={profile.photo} alt="" sizes="112px" />
                      </Link>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{category?.name}</p>
                        <h3 className="mt-1 font-display text-3xl tracking-tight">
                          <Link href={`/profiles/${profile.slug}`} data-track="open_profile" className="hover:text-primary">
                            {profile.name}
                          </Link>
                        </h3>
                        <p className="mt-2 max-w-xl text-muted-foreground">{profile.oneLiner}</p>
                      </div>
                      <Button asChild variant="ghost" className="hidden sm:inline-flex">
                        <Link href={`/profiles/${profile.slug}#work`} data-track="read_work">
                          Read
                        </Link>
                      </Button>
                    </article>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </div>
      </section>

      <section id="categories" aria-labelledby="categories-heading" className="rise scroll-mt-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Browse</p>
          <h2 id="categories-heading" className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
            Four ways in
          </h2>
          <ol className="mt-10 border-t border-border">
            {categories.map((category, index) => {
              const count = published.filter((profile) => profile.category === category.slug).length;
              return (
                <li key={category.slug} className="border-b border-border">
                  <Link
                    href={`/categories/${category.slug}`}
                    data-track="open_category"
                    className="group flex min-h-16 items-center gap-4 py-5 sm:gap-8"
                  >
                    <span className={`h-10 w-1 shrink-0 ${accentClass[category.accent]}`} aria-hidden="true" />
                    <span className="w-8 text-sm text-muted-foreground">0{index + 1}</span>
                    <span className="font-display text-3xl tracking-tight transition-colors group-hover:text-primary sm:text-5xl">
                      {category.name}
                    </span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      {count} {count === 1 ? "page" : "pages"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section aria-labelledby="arrive-heading" className="rise border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3">
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
              <Link href="/suggest" data-track="suggest">
                Suggest someone
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
