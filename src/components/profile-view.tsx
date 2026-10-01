import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/lib/categories";
import { ShareBar } from "@/components/share-bar";
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
        <p className="bg-ink px-5 py-3 text-center text-sm text-paper">
          {profile.status === "published"
            ? "Desk preview. This page is on the public site."
            : "Desk preview. Editors have not published this page yet."}
        </p>
      ) : null}

      <div className="mx-auto max-w-6xl px-5 pb-8 pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline decoration-line underline-offset-4 hover:decoration-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              {category ? (
                <Link
                  href={`/categories/${category.slug}`}
                  className="underline decoration-line underline-offset-4 hover:decoration-ink"
                >
                  {category.name}
                </Link>
              ) : (
                "Category"
              )}
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {profile.name}
            </li>
          </ol>
        </nav>

        <header className="mt-8 grid items-start gap-8 lg:grid-cols-12">
          <figure className="order-2 lg:order-1 lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden bg-line">
              <Image
                src={profile.photo}
                alt={profile.photoAlt}
                fill
                priority
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted">
              {profile.place}. Portrait for this tribute page.
            </figcaption>
          </figure>

          <div className="order-1 lg:order-2 lg:col-span-7 lg:pt-4">
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted">
              <span className={`inline-block h-2.5 w-2.5 ${accent}`} aria-hidden="true" />
              {category?.name}
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-5 max-w-xl text-xl leading-snug text-ink sm:text-2xl">{profile.oneLiner}</p>
            <p className="mt-4 text-muted">
              {profile.role}
              <span className="px-2 text-line" aria-hidden="true">
                ·
              </span>
              {profile.place}
            </p>
            <a
              href="#work"
              className="mt-8 inline-flex min-h-11 items-center text-sm uppercase tracking-[0.16em] text-pine underline decoration-pine/30 underline-offset-4"
            >
              Their work
            </a>
          </div>
        </header>

        <section id="work" aria-labelledby="work-heading" className="mt-16 scroll-mt-24 border-t border-line pt-10">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-pine">Portfolio</p>
            <h2 id="work-heading" className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
              Their work
            </h2>
            <p className="mt-4 text-lg text-muted">
              The record starts here: projects, what they asked of people, and what changed.
            </p>
          </div>
          <ol className="mt-10 divide-y divide-line border-y border-line">
            {profile.work.map((item) => (
              <li key={item.title} className="py-8">
                <div>
                  <h3 className="font-display text-3xl tracking-tight">{item.title}</h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.14em] text-muted">{item.years}</p>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed">{item.summary}</p>
                  <p className="mt-4 max-w-2xl border-l-2 border-pine pl-4 leading-relaxed">
                    <span className="mb-1 block text-xs uppercase tracking-[0.16em] text-pine">
                      What changed
                    </span>
                    {item.outcome}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="journey-heading" className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.18em] text-pine">Open letter</p>
            <h2 id="journey-heading" className="mt-2 font-display text-4xl tracking-tight">
              The journey
            </h2>
          </div>
          <div className="letter max-w-2xl space-y-5 text-lg leading-relaxed lg:col-span-8">
            {profile.journey.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="why-heading"
          className="mt-16 bg-ink px-6 py-10 text-paper sm:px-10 sm:py-14"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-paper/70">For the country</p>
          <h2 id="why-heading" className="mt-3 max-w-3xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Why this matters for Tanzania
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-paper/90">
            {profile.whyItMatters.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="share-heading" className="mt-14">
          <h2 id="share-heading" className="font-display text-3xl tracking-tight">
            Pass this page on
          </h2>
          {profile.status === "published" ? (
            <>
              <p className="mt-3 max-w-xl text-muted">
                Share the work with someone who should read it. The link opens this tribute.
              </p>
              <div className="mt-6">
                <ShareBar name={profile.name} oneLiner={profile.oneLiner} path={publicPath} />
              </div>
            </>
          ) : (
            <p className="mt-3 max-w-xl text-muted">
              Sharing opens once editors publish this page.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
