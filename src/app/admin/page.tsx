import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/admin-login";
import { logoutAdmin, setProfileStatus } from "@/lib/actions";
import { isAdmin } from "@/lib/admin-auth";
import { getCategory } from "@/lib/categories";
import { getAllProfiles, getProfile } from "@/lib/content";
import { getTips } from "@/lib/tips";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <div className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Editors</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Editorial desk</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
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
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Editors</p>
          <h1 className="mt-2 font-display text-5xl tracking-tight sm:text-6xl">Editorial desk</h1>
        </div>
        <form action={logoutAdmin}>
          <Button type="submit" variant="outline">
            Lock the desk
          </Button>
        </form>
      </div>

      {notice ? (
        <Alert className="mt-8" role="status">
          <AlertTitle>Updated</AlertTitle>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}

      <section aria-labelledby="pages-heading" className="mt-12">
        <h2 id="pages-heading" className="font-display text-3xl">
          Pages
        </h2>
        <Separator className="mt-4" />
        <ul>
          {ordered.map((profile) => {
            const category = getCategory(profile.category);
            const nextStatus = profile.status === "published" ? "draft" : "published";
            return (
              <li
                key={profile.slug}
                className="flex flex-col gap-4 border-b border-border py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{category?.name}</p>
                  <h3 className="font-display text-2xl">{profile.name}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={profile.status === "published" ? "default" : "secondary"}>
                      {profile.status === "published" ? "On the public site" : "Desk draft"}
                    </Badge>
                    <span>{profile.place}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/admin/preview/${profile.slug}`}>Preview</Link>
                  </Button>
                  {profile.status === "published" ? (
                    <Button asChild variant="ghost">
                      <Link href={`/profiles/${profile.slug}`}>Public page</Link>
                    </Button>
                  ) : null}
                  <form action={setProfileStatus}>
                    <input type="hidden" name="slug" value={profile.slug} />
                    <input type="hidden" name="status" value={nextStatus} />
                    <Button type="submit" variant={profile.status === "published" ? "secondary" : "default"}>
                      {profile.status === "published" ? "Unpublish" : "Publish"}
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
          Suggestions
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Private notes for editors. They are not published and they are not counted in public. This
          preview keeps them in a file. Production needs a database.
        </p>
        {tips.length === 0 ? (
          <Card className="mt-6 rounded-md border-dashed shadow-none">
            <CardContent className="py-8 text-muted-foreground">No suggestions yet.</CardContent>
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
