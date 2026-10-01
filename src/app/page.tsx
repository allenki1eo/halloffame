import Link from "next/link";
import { categories } from "@/lib/categories";
import { CoverImage } from "@/components/cover-image";
import { getPublishedProfiles } from "@/lib/content";
import { categoryCopy, getLocale, htmlLang } from "@/lib/i18n";
import { localizeProfile } from "@/lib/localize";
import { messages } from "@/lib/messages";
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
  const locale = await getLocale();
  const copy = messages[locale];
  const published = (await getPublishedProfiles()).map((profile) => localizeProfile(profile, locale));
  const opening = published[0];
  const featured = published.slice(1, 3);
  const rest = published.slice(3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Shukran TZ",
    url: absoluteUrl("/"),
    description: copy.siteDescription,
    inLanguage: htmlLang(locale),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="lg:grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:grid-rows-[1fr_auto]">
        <div className={`order-1 flex flex-col justify-end pt-8 lg:col-start-1 lg:row-start-1 lg:pb-6 ${gutter}`}>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">{copy.karibu}</p>
          <h1 className="mt-4 max-w-[12ch] font-display text-[3.4rem] leading-[0.88] tracking-tight sm:text-7xl lg:text-[5.4rem]">
            {copy.headline}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">{copy.dek}</p>
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
                <p className="text-xs uppercase tracking-[0.18em] text-white/80">{copy.openingPage}</p>
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
                    {copy.readTheWork}
                  </Link>
                </Button>
              </figcaption>
            </figure>
          ) : (
            <div className="absolute inset-0 flex items-end bg-secondary px-5 py-10">
              <p className="max-w-sm text-lg text-muted-foreground">
                {copy.emptyRecord}
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
                <span className="font-display text-2xl tracking-tight">{copy.theRecord}</span>
                <span className="text-sm text-muted-foreground">
                  {published.length} {published.length === 1 ? copy.page : copy.pages}
                </span>
              </Link>
            </li>
            <li className="border-t border-border">
              <Link
                href="#categories"
                data-track="open_category"
                className="flex min-h-12 items-center justify-between gap-4 py-3"
              >
                <span className="font-display text-2xl tracking-tight">{copy.categories}</span>
                <span className="text-sm text-muted-foreground">{copy.fourWays}</span>
              </Link>
            </li>
            <li className="border-t border-border">
              <Link
                href="/suggest"
                data-track="suggest"
                className="flex min-h-12 items-center justify-between gap-4 py-3"
              >
                <span className="font-display text-2xl tracking-tight">{copy.suggestSomeone}</span>
                <span className="text-sm text-muted-foreground">{copy.privateNote}</span>
              </Link>
            </li>
          </ul>
        </nav>
      </section>

      <section id="record" aria-labelledby="record-heading" className="rise scroll-mt-20 border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">{copy.sideBySide}</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <h2 id="record-heading" className="font-display text-5xl tracking-tight sm:text-6xl">
              {copy.onTheRecord}
            </h2>
          </div>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">{copy.recordDek}</p>

          {featured.length > 0 ? (
            <ul className="mt-12 grid gap-8 md:grid-cols-2">
              {featured.map((profile) => {
                const category = categoryCopy(profile.category, locale);
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
                        {category.name}
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
                const category = categoryCopy(profile.category, locale);
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
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{category.name}</p>
                        <h3 className="mt-1 font-display text-3xl tracking-tight">
                          <Link href={`/profiles/${profile.slug}`} data-track="open_profile" className="hover:text-primary">
                            {profile.name}
                          </Link>
                        </h3>
                        <p className="mt-2 max-w-xl text-muted-foreground">{profile.oneLiner}</p>
                      </div>
                      <Button asChild variant="ghost" className="hidden sm:inline-flex">
                        <Link href={`/profiles/${profile.slug}#work`} data-track="read_work">
                          {copy.read}
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
          <p className="text-xs uppercase tracking-[0.2em] text-primary">{copy.browse}</p>
          <h2 id="categories-heading" className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
            {copy.fourWays}
          </h2>
          <ol className="mt-10 border-t border-border">
            {categories.map((category, index) => {
              const count = published.filter((profile) => profile.category === category.slug).length;
              const name = categoryCopy(category.slug, locale).name;
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
                      {name}
                    </span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      {count} {count === 1 ? copy.page : copy.pages}
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
              {copy.howArrives}
            </h2>
          </div>
          {[
            { title: copy.arriveEditorsTitle, body: copy.arriveEditors },
            { title: copy.arriveSuggestTitle, body: copy.arriveSuggest },
            { title: copy.arriveShareTitle, body: copy.arriveShare },
          ].map((step) => (
            <div key={step.title}>
              <h3 className="font-display text-2xl">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
          <div className="md:col-span-3">
            <Button asChild variant="outline" size="lg">
              <Link href="/suggest" data-track="suggest">
                {copy.suggestSomeone}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
