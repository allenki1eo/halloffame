import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/admin-login";
import { logoutAdmin, setProfileStatus } from "@/lib/actions";
import { isAdmin } from "@/lib/admin-auth";
import { getCategory } from "@/lib/categories";
import { getAllProfiles, getProfile } from "@/lib/content";
import { getTips } from "@/lib/tips";

export const metadata: Metadata = {
  title: "Editorial desk",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ updated?: string; status?: string }>;
};

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Dar_es_Salaam",
  }).format(new Date(iso));
}

export default async function AdminPage({ searchParams }: PageProps) {
  const admin = await isAdmin();
  const query = await searchParams;

  if (!admin) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-xs uppercase tracking-[0.18em] text-pine">Editors</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">Editorial desk</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Publish a page onto the public site, or return it to the desk. Suggestions stay here.
        </p>
        <div className="mt-8">
          <AdminLogin />
        </div>
      </div>
    );
  }

  const profiles = getAllProfiles();
  const drafts = profiles.filter((profile) => profile.status === "draft");
  const published = profiles.filter((profile) => profile.status === "published");
  const ordered = [...drafts, ...published];
  const tips = getTips();
  const updated = query.updated ? getProfile(query.updated) : null;
  const notice =
    updated && query.status === "published"
      ? `${updated.name} is on the public site.`
      : updated && query.status === "draft"
        ? `${updated.name} is back on the desk.`
        : "";

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-pine">Editors</p>
          <h1 className="mt-2 font-display text-5xl tracking-tight">Editorial desk</h1>
        </div>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm"
          >
            Lock the desk
          </button>
        </form>
      </div>

      {notice ? (
        <p role="status" className="mt-6 border border-pine bg-paper-raised px-4 py-3">
          {notice}
        </p>
      ) : null}

      <section aria-labelledby="pages-heading" className="mt-10">
        <h2 id="pages-heading" className="font-display text-3xl">
          Pages
        </h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {ordered.map((profile) => {
            const category = getCategory(profile.category);
            const nextStatus = profile.status === "published" ? "draft" : "published";
            return (
              <li key={profile.slug} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">{category?.name}</p>
                  <h3 className="font-display text-2xl">{profile.name}</h3>
                  <p className="text-sm text-muted">
                    {profile.status === "published" ? "On the public site" : "Desk draft"} · {profile.place}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/preview/${profile.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm"
                  >
                    Preview
                  </Link>
                  {profile.status === "published" ? (
                    <Link
                      href={`/profiles/${profile.slug}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm"
                    >
                      Public page
                    </Link>
                  ) : null}
                  <form action={setProfileStatus}>
                    <input type="hidden" name="slug" value={profile.slug} />
                    <input type="hidden" name="status" value={nextStatus} />
                    <button
                      type="submit"
                      className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-pine px-4 text-sm text-paper hover:bg-pine-deep"
                    >
                      {profile.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="tips-heading" className="mt-14">
        <h2 id="tips-heading" className="font-display text-3xl">
          Suggestions
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Private notes for editors. They are not published and they are not counted in public.
          This preview keeps them in a file. Production needs a database.
        </p>
        {tips.length === 0 ? (
          <p className="mt-6 border border-dashed border-line px-4 py-6 text-muted">
            No suggestions yet.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {tips.map((tip) => (
              <li key={tip.id} className="border border-line bg-paper-raised p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  {formatWhen(tip.createdAt)} · {getCategory(tip.category)?.name} ·{" "}
                  {tip.storage === "memory" ? "Held in memory" : "Saved to file"}
                </p>
                <h3 className="mt-2 font-display text-2xl">{tip.personName}</h3>
                <p className="text-sm text-muted">{tip.place}</p>
                <p className="mt-3 leading-relaxed">{tip.workSummary}</p>
                <p className="mt-3 leading-relaxed text-muted">{tip.why}</p>
                <p className="mt-3 text-sm">
                  From {tip.suggesterName || "someone who left no name"}
                  {tip.contact ? ` · ${tip.contact}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
