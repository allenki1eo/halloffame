import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/admin-login";
import { logoutAdmin, setProfileStatus } from "@/lib/actions";
import { isAdmin } from "@/lib/admin-auth";
import { blobConfigured } from "@/lib/blob";
import { getCategory } from "@/lib/categories";
import { categoryCopy } from "@/lib/i18n";
import { getAllProfiles, getProfile } from "@/lib/content";
import { tursoConfigured } from "@/lib/db/client";
import { getLocale } from "@/lib/i18n";
import { messages } from "@/lib/messages";
import { medalLabel } from "@/lib/medals";
import { getTips } from "@/lib/tips";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrafficDesk } from "@/components/traffic-desk";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Editorial desk",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ updated?: string; status?: string; error?: string; removed?: string }>;
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
  const locale = await getLocale();
  const copy = messages[locale];

  if (!admin) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">{copy.editorialDesk}</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">{copy.editorialDesk}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{copy.deskIntro}</p>
        <div className="mt-8">
          <AdminLogin locale={locale} />
        </div>
      </div>
    );
  }

  const profiles = await getAllProfiles();
  const drafts = profiles.filter((profile) => profile.status === "draft");
  const published = profiles.filter((profile) => profile.status === "published");
  const ordered = [...drafts, ...published];
  const tips = getTips();
  const updated = query.updated ? await getProfile(query.updated) : null;
  const database = tursoConfigured();
  const uploads = blobConfigured();
  const notice =
    updated && query.status === "published"
      ? `${updated.name} is on the public site.`
      : updated && query.status === "draft"
        ? `${updated.name} is back on the desk.`
        : "";

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">{copy.editorialDesk}</p>
          <h1 className="mt-2 font-display text-5xl tracking-tight sm:text-6xl">{copy.editorialDesk}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/people/new">{copy.newPage}</Link>
          </Button>
          <form action={logoutAdmin}>
            <Button type="submit" variant="outline">
              {copy.lockDesk}
            </Button>
          </form>
        </div>
      </div>

      <Alert className="mt-8">
        <AlertTitle>{database ? "Turso is connected" : "Demo record"}</AlertTitle>
        <AlertDescription>
          {database
            ? uploads
              ? "Pages, work, medals, and media notes are stored in Turso. Image and video files go to Vercel Blob."
              : "Pages are stored in Turso. File uploads need BLOB_READ_WRITE_TOKEN. You can still paste an image, video, or link URL."
            : "This desk is reading data/profiles.json. Publish and unpublish update that file. Creating and editing people, work, and media needs TURSO_DATABASE_URL and TURSO_AUTH_TOKEN. Uploads also need BLOB_READ_WRITE_TOKEN."}
          {database && profiles.length === 0
            ? " The database has no pages yet. Run npm run db:seed, or create a page."
            : ""}
        </AlertDescription>
      </Alert>

      {query.error ? (
        <Alert className="mt-4" variant="destructive" role="alert">
          <AlertTitle>The desk could not save that</AlertTitle>
          <AlertDescription>{query.error}</AlertDescription>
        </Alert>
      ) : null}
      {query.removed ? (
        <Alert className="mt-4" role="status">
          <AlertTitle>Removed</AlertTitle>
          <AlertDescription>{query.removed} is off the record.</AlertDescription>
        </Alert>
      ) : null}

      {notice ? (
        <Alert className="mt-8" role="status">
          <AlertTitle>Updated</AlertTitle>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}

      <TrafficDesk />

      <section aria-labelledby="pages-heading" className="mt-16">
        <h2 id="pages-heading" className="font-display text-3xl">
          {copy.pages}
        </h2>
        <Separator className="mt-4" />
        <ul>
          {ordered.map((profile) => {
            const category = categoryCopy(profile.category, locale);
            const nextStatus = profile.status === "published" ? "draft" : "published";
            return (
              <li
                key={profile.slug}
                className="flex flex-col gap-4 border-b border-border py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{category.name}</p>
                  <h3 className="font-display text-2xl">{profile.name}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={profile.status === "published" ? "default" : "secondary"}>
                      {profile.status === "published" ? copy.onTheSite : copy.deskDraft}
                    </Badge>
                    <span>
                      {copy.honor} · {copy.medals[profile.honorMedal] ?? medalLabel[profile.honorMedal]}
                    </span>
                    <span>{profile.place}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href={`/admin/people/${profile.slug}`}>{copy.edit}</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/admin/preview/${profile.slug}`}>{copy.preview}</Link>
                  </Button>
                  {profile.status === "published" ? (
                    <Button asChild variant="ghost">
                      <Link href={`/profiles/${profile.slug}`}>{copy.publicPage}</Link>
                    </Button>
                  ) : null}
                  <form action={setProfileStatus}>
                    <input type="hidden" name="slug" value={profile.slug} />
                    <input type="hidden" name="status" value={nextStatus} />
                    <Button type="submit" variant={profile.status === "published" ? "secondary" : "default"}>
                      {profile.status === "published" ? copy.unpublish : copy.publish}
                    </Button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="tips-heading" className="mt-16">
        <h2 id="tips-heading" className="font-display text-3xl">
          {copy.suggestions}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Private notes for editors. They stay in a file on this preview and they are not part of the public record.
        </p>
        {tips.length === 0 ? (
          <Card className="mt-6 rounded-md border-dashed shadow-none">
            <CardContent className="py-8 text-muted-foreground">{copy.noSuggestions}</CardContent>
          </Card>
        ) : (
          <ul className="mt-6 space-y-4">
            {tips.map((tip) => (
              <li key={tip.id}>
                <Card className="rounded-md shadow-none">
                  <CardHeader>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {formatWhen(tip.createdAt)} · {getCategory(tip.category)?.name} ·{" "}
                      {tip.storage === "memory" ? "Held in memory" : "Saved to file"}
                    </p>
                    <CardTitle className="font-display text-2xl font-normal">{tip.personName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tip.place}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="leading-relaxed">{tip.workSummary}</p>
                    <p className="leading-relaxed text-muted-foreground">{tip.why}</p>
                    <p className="text-sm">
                      From {tip.suggesterName || "someone who left no name"}
                      {tip.contact ? ` · ${tip.contact}` : ""}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
