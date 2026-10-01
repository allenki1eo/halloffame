import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/categories";
import { getPublishedByCategory, getPublishedProfiles } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const accentClass = {
  pine: "bg-pine",
  clay: "bg-clay",
  plum: "bg-plum",
  gold: "bg-gold",
} as const;

export default function HomePage() {
  const published = getPublishedProfiles();
  const opening = published[0];
  const rest = published.slice(1);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Shukran TZ",
    url: absoluteUrl("/"),
    description:
      "A living tribute to Tanzanians and their work. Editors publish each page.",
    inLanguage: "en-TZ",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto max-w-6xl px-5">
        <section className="grid gap-8 pb-14 pt-12 md:grid-cols-12 md:pt-20">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.2em] text-pine">Karibu · Tanzania</p>
            <h1 className="mt-4 max-w-[12ch] font-display text-[3.1rem] leading-[0.92] tracking-tight sm:text-7xl">
              The work is the tribute.
            </h1>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-muted md:col-span-4 md:pt-16">
            Shukran TZ is a living tribute: a place to find Tanzanians, well known and still unsung,
            and to spend time with what they have made. Editors publish each page.
          </p>
        </section>

        {opening ? (
          <section aria-labelledby="opening-heading" className="border-t border-line py-12">
            <article className="grid items-end gap-8 lg:grid-cols-12">
              <figure className="order-2 lg:order-1 lg:col-span-7">
                <div className="relative aspect-[3/4] overflow-hidden bg-line sm:aspect-[4/5]">
                  <Image
                    src={opening.photo}
                    alt={opening.photoAlt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </figure>
              <div className="order-1 lg:order-2 lg:col-span-5">
                <p className="text-xs uppercase tracking-[0.18em] text-pine">Opening page</p>
                <h2
                  id="opening-heading"
                  className="mt-3 font-display text-5xl leading-none tracking-tight"
                >
                  <Link href={`/profiles/${opening.slug}`} className="hover:text-pine">
                    {opening.name}
                  </Link>
                </h2>
                <p className="mt-4 text-xl leading-snug">{opening.oneLiner}</p>
                <p className="mt-3 text-sm text-muted">
                  {opening.role} · {opening.place}
                </p>
                {opening.work[0] ? (
                  <p className="mt-6 border-l-2 border-pine pl-4">
                    <span className="block text-xs uppercase tracking-[0.16em] text-pine">Their work</span>
                    <span className="mt-2 block font-display text-2xl">{opening.work[0].title}</span>
                    <span className="mt-2 block leading-relaxed text-muted">{opening.work[0].outcome}</span>
                  </p>
                ) : null}
                <Link
                  href={`/profiles/${opening.slug}`}
                  className="mt-8 inline-flex min-h-11 items-center rounded-full bg-pine px-5 text-paper hover:bg-pine-deep"
                >
                  Read the work
                </Link>
              </div>
            </article>
          </section>
        ) : (
          <p className="border-t border-line py-16 text-lg text-muted">
            The public record is empty. Editors publish pages from the desk.
          </p>
        )}

        {rest.length > 0 ? (
          <section aria-labelledby="record-heading" className="py-8">
            <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
              <h2 id="record-heading" className="font-display text-4xl tracking-tight">
                On the record
              </h2>
              <p className="text-sm text-muted">{published.length} pages</p>
            </div>
            <ol className="divide-y divide-line">
              {rest.map((profile) => (
                <li key={profile.slug}>
                  <article className="py-6">
                    <div className="grid items-center gap-5 sm:grid-cols-[5.5rem_1fr]">
                      <Link href={`/profiles/${profile.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-line" tabIndex={-1} aria-hidden="true">
                        <Image
                          src={profile.photo}
                          alt=""
                          fill
                          sizes="88px"
                          className="object-cover"
                        />
                      </Link>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted">
                          {categories.find((item) => item.slug === profile.category)?.name}
                        </p>
                        <h3 className="mt-1 font-display text-3xl tracking-tight">
                          <Link href={`/profiles/${profile.slug}`} className="hover:text-pine">
                            {profile.name}
                          </Link>
                        </h3>
                        <p className="mt-2 max-w-xl text-muted">{profile.oneLiner}</p>
                        {profile.work[0] ? (
                          <p className="mt-2 text-sm">
                            <span className="text-pine">{profile.work[0].title}.</span>{" "}
                            {profile.work[0].outcome}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section aria-labelledby="categories-heading" className="py-12">
          <h2 id="categories-heading" className="font-display text-4xl tracking-tight">
            Four ways in
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {categories.map((category) => {
              const count = getPublishedByCategory(category.slug).length;
              return (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex h-full flex-col border border-line bg-paper-raised p-6 hover:border-ink"
                  >
                    <span className={`h-1.5 w-12 ${accentClass[category.accent]}`} aria-hidden="true" />
                    <span className="mt-5 font-display text-3xl tracking-tight">{category.name}</span>
                    <span className="mt-3 flex-1 leading-relaxed text-muted">{category.blurb}</span>
                    <span className="mt-6 text-sm uppercase tracking-[0.14em]">
                      {count} {count === 1 ? "page" : "pages"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="arrive-heading" className="grid gap-8 border-t border-line py-14 md:grid-cols-3">
          <div className="md:col-span-3">
            <h2 id="arrive-heading" className="font-display text-4xl tracking-tight">
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
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
          <div className="md:col-span-3">
            <Link
              href="/suggest"
              className="inline-flex min-h-11 items-center rounded-full border border-ink px-5 hover:bg-ink hover:text-paper"
            >
              Suggest someone
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
