import Link from "next/link";
import { getCategory } from "@/lib/categories";
import { CoverImage } from "@/components/cover-image";
import { MedalMark } from "@/components/medal-mark";
import { ReachThem } from "@/components/reach-them";
import { ShareBar } from "@/components/share-bar";
import { WorkMediaList } from "@/components/work-media-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { categoryCopy, getLocale } from "@/lib/i18n";
import { localizeProfile } from "@/lib/localize";
import { messages } from "@/lib/messages";
import type { Profile } from "@/lib/types";

const accentClass = {
  pine: "bg-pine",
  clay: "bg-clay",
  plum: "bg-plum",
  gold: "bg-gold",
} as const;

export async function ProfileView({
  profile: source,
  mode = "public",
}: {
  profile: Profile;
  mode?: "public" | "preview";
}) {
  const locale = await getLocale();
  const copy = messages[locale];
  const profile = localizeProfile(source, locale);
  const category = getCategory(profile.category);
  const categoryName = categoryCopy(profile.category, locale).name;
  const accent = category ? accentClass[category.accent] : "bg-pine";
  const publicPath = `/profiles/${profile.slug}`;

  return (
    <article>
      {mode === "preview" ? (
        <p className="bg-foreground px-5 py-3 text-center text-sm text-background">
          {profile.status === "published" ? copy.previewPublic : copy.previewDraft}
        </p>
      ) : null}

      <div className="mx-auto max-w-6xl px-5 pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline decoration-border underline-offset-4 hover:decoration-foreground">
                {copy.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              {category ? (
                <Link
                  href={`/categories/${category.slug}`}
                  className="underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  {categoryName}
                </Link>
              ) : (
                copy.categoryLabel
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
          <CoverImage
            src={profile.photo}
            alt={profile.photoAlt}
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover object-[center_20%]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-5 pb-8 pt-28 text-white sm:px-10 sm:pb-12">
            <div className="flex flex-wrap items-center gap-3">
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/85">
                <span className={`inline-block h-2.5 w-2.5 ${accent}`} aria-hidden="true" />
                {categoryName}
              </p>
              <MedalMark
                medal={profile.honorMedal}
                kind="honor"
                tone="overlay"
                honor={copy.honor}
                medalName={copy.medals[profile.honorMedal]}
              />
            </div>
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
              <a href="#work" data-track="read_work">
                {copy.theirWork}
              </a>
            </Button>
          </figcaption>
        </figure>
        <p className="mt-3 text-sm text-muted-foreground">
          {profile.place}. {copy.portraitNote}
        </p>
      </header>

      <ReachThem links={profile.socials} messages={copy} />

      <section id="work" aria-labelledby="work-heading" className="rise scroll-mt-24 pt-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">{copy.portfolio}</p>
          <h2 id="work-heading" className="mt-3 max-w-3xl font-display text-5xl leading-none tracking-tight sm:text-7xl">
            {copy.theirWork}
          </h2>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{copy.workIntro}</p>
        </div>
        <ol className="mt-12">
          {profile.work.map((item) => (
            <li key={item.id} className="border-t border-border">
              <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-12 md:py-20">
                <div className="md:col-span-4">
                  <p className="font-display text-3xl tracking-tight text-primary">{item.years}</p>
                  <div className="mt-4">
                    <MedalMark medal={item.medal} kind="work" honor={copy.honor} medalName={copy.medals[item.medal]} />
                  </div>
                </div>
                <div className="md:col-span-8">
                  <h3 className="font-display text-4xl leading-none tracking-tight sm:text-6xl">{item.title}</h3>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed">{item.summary}</p>
                  <Card className="mt-8 max-w-2xl rounded-md bg-secondary shadow-none ring-0">
                    <CardHeader>
                      <CardDescription className="text-xs uppercase tracking-[0.16em] text-primary">
                        {copy.whatChanged}
                      </CardDescription>
                      <CardTitle className="font-display text-2xl font-normal leading-snug">{item.outcome}</CardTitle>
                    </CardHeader>
                  </Card>
                  <WorkMediaList media={item.media} copy={copy} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="journey-heading" className="rise mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">{copy.openLetter}</p>
          <h2 id="journey-heading" className="mt-3 font-display text-5xl tracking-tight">
            {copy.journey}
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
          <p className="text-xs uppercase tracking-[0.2em] text-background/70">{copy.forTheCountry}</p>
          <h2 id="why-heading" className="mt-4 max-w-4xl font-display text-4xl leading-tight tracking-tight sm:text-6xl">
            {copy.whyHeading}
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
              {copy.passOn}
            </h2>
            {profile.status === "published" ? (
              <p className="mt-3 max-w-xl text-muted-foreground">{copy.sharePublished}</p>
            ) : (
              <p className="mt-3 max-w-xl text-muted-foreground">{copy.shareDraft}</p>
            )}
          </div>
          {profile.status === "published" ? (
            <ShareBar name={profile.name} oneLiner={profile.oneLiner} path={publicPath} copy={copy} />
          ) : null}
        </div>
        <Badge variant="outline" className="mt-8 h-7 px-3">
          {categoryName}
        </Badge>
      </section>
    </article>
  );
}
