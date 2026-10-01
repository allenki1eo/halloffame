import type { ReactNode } from "react";
import Link from "next/link";
import { categories } from "@/lib/categories";
import {
  deleteMediaAction,
  deletePersonAction,
  deleteWorkAction,
  saveMediaAction,
  savePersonAction,
  saveWorkAction,
} from "@/lib/desk-actions";
import { medalLabel } from "@/lib/medals";
import { medalTiers, mediaKinds, type Profile } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const selectClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const savedCopy: Record<string, string> = {
  page: "The page is saved.",
  work: "The work is saved.",
  "work-removed": "The work is removed.",
  media: "The media is saved.",
  "media-removed": "The media is removed.",
};

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function DeskEditor({
  profile,
  error,
  saved,
}: {
  profile?: Profile;
  error?: string;
  saved?: string;
}) {
  const notice = saved ? savedCopy[saved] : "";

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-sm text-muted-foreground">
        <Link href="/admin" className="underline decoration-border underline-offset-4 hover:decoration-foreground">
          Editorial desk
        </Link>
      </p>
      <h1 className="mt-3 font-display text-5xl tracking-tight">
        {profile ? profile.name : "New page"}
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Set one honor for the person, then a medal and media for each piece of work. Pages stay in editorial order.
      </p>

      {notice ? (
        <Alert className="mt-8" role="status">
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}
      {error ? (
        <Alert className="mt-8" variant="destructive" role="alert">
          <AlertTitle>The desk could not save that</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <form action={savePersonAction} className="mt-10 space-y-6">
        <input type="hidden" name="originalSlug" value={profile?.slug ?? ""} />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="name" label="Name">
            <Input id="name" name="name" required defaultValue={profile?.name ?? ""} autoComplete="name" />
          </Field>
          <Field id="slug" label="Address" hint="Leave blank to build it from the name.">
            <Input id="slug" name="slug" defaultValue={profile?.slug ?? ""} autoComplete="off" spellCheck={false} />
          </Field>
          <Field id="category" label="Category">
            <select id="category" name="category" className={selectClass} defaultValue={profile?.category ?? "tech"}>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="honorMedal" label="Honor medal" hint="An editor’s honor for the body of work.">
            <select id="honorMedal" name="honorMedal" className={selectClass} defaultValue={profile?.honorMedal ?? "bronze"}>
              {medalTiers.map((medal) => (
                <option key={medal} value={medal}>
                  {medalLabel[medal]}
                </option>
              ))}
            </select>
          </Field>
          <Field id="place" label="Place">
            <Input id="place" name="place" required defaultValue={profile?.place ?? ""} />
          </Field>
          <Field id="role" label="Role">
            <Input id="role" name="role" required defaultValue={profile?.role ?? ""} />
          </Field>
        </div>
        <Field id="oneLiner" label="One line">
          <Input id="oneLiner" name="oneLiner" required defaultValue={profile?.oneLiner ?? ""} />
        </Field>
        <Field id="status" label="On the public site">
          <select id="status" name="status" className={selectClass} defaultValue={profile?.status ?? "draft"}>
            <option value="draft">Desk draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field id="photoUrl" label="Portrait URL" hint="A site path such as /portraits/name.jpg, or a public link. A file replaces this.">
          <Input id="photoUrl" name="photoUrl" defaultValue={profile?.photo ?? ""} spellCheck={false} />
        </Field>
        <Field id="portrait" label="Portrait file">
          <Input id="portrait" name="portrait" type="file" accept="image/*" />
        </Field>
        <Field id="photoAlt" label="Portrait description">
          <Input id="photoAlt" name="photoAlt" defaultValue={profile?.photoAlt ?? ""} />
        </Field>
        <Field id="journey" label="Journey" hint="Blank line between paragraphs.">
          <Textarea id="journey" name="journey" defaultValue={profile?.journey.join("\n\n") ?? ""} />
        </Field>
        <Field id="whyItMatters" label="Why it matters for Tanzania" hint="Blank line between paragraphs.">
          <Textarea id="whyItMatters" name="whyItMatters" defaultValue={profile?.whyItMatters.join("\n\n") ?? ""} />
        </Field>
        <Button type="submit">Save page</Button>
      </form>

      {profile ? (
        <>
          <Separator className="my-14" />
          <section aria-labelledby="works-heading">
            <h2 id="works-heading" className="font-display text-4xl tracking-tight">
              Work
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Each piece has its own medal, plus images, videos, or links.
            </p>
            <ul className="mt-8 space-y-10">
              {profile.work.map((item) => (
                <li key={item.id} id={`work-${item.id}`} className="border border-border bg-card px-4 py-5 sm:px-6">
                  <form action={saveWorkAction} className="space-y-5">
                    <input type="hidden" name="personSlug" value={profile.slug} />
                    <input type="hidden" name="workId" value={item.id} />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id={`title-${item.id}`} label="Title">
                        <Input id={`title-${item.id}`} name="title" required defaultValue={item.title} />
                      </Field>
                      <Field id={`years-${item.id}`} label="Years">
                        <Input id={`years-${item.id}`} name="years" defaultValue={item.years} />
                      </Field>
                    </div>
                    <Field id={`medal-${item.id}`} label="Medal for this work">
                      <select id={`medal-${item.id}`} name="medal" className={selectClass} defaultValue={item.medal}>
                        {medalTiers.map((medal) => (
                          <option key={medal} value={medal}>
                            {medalLabel[medal]}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field id={`summary-${item.id}`} label="Summary">
                      <Textarea id={`summary-${item.id}`} name="summary" defaultValue={item.summary} />
                    </Field>
                    <Field id={`outcome-${item.id}`} label="What changed">
                      <Textarea id={`outcome-${item.id}`} name="outcome" defaultValue={item.outcome} />
                    </Field>
                    <Button type="submit">Save this work</Button>
                  </form>

                  {item.media.length > 0 ? (
                    <ul className="mt-6 space-y-3">
                      {item.media.map((media) => (
                        <li key={media.id} className="flex flex-col gap-3 border-t border-border py-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{media.kind}</p>
                            <p className="font-display text-xl">{media.title || media.url}</p>
                            {media.caption ? <p className="text-sm text-muted-foreground">{media.caption}</p> : null}
                          </div>
                          <form action={deleteMediaAction} className="flex flex-wrap items-center gap-3">
                            <input type="hidden" name="personSlug" value={profile.slug} />
                            <input type="hidden" name="workId" value={item.id} />
                            <input type="hidden" name="mediaId" value={media.id} />
                            <label className="flex min-h-11 items-center gap-2 text-sm">
                              <input type="checkbox" name="confirm" value="delete" required />
                              Remove
                            </label>
                            <Button type="submit" variant="outline">
                              Remove media
                            </Button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-6 text-sm text-muted-foreground">No image, video, or link on this work yet.</p>
                  )}

                  <form action={saveMediaAction} className="mt-6 space-y-5 border-t border-border pt-5">
                    <input type="hidden" name="personSlug" value={profile.slug} />
                    <input type="hidden" name="workId" value={item.id} />
                    <h3 className="font-display text-2xl">Add media</h3>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id={`kind-${item.id}`} label="Kind">
                        <select id={`kind-${item.id}`} name="kind" className={selectClass} defaultValue="link">
                          {mediaKinds.map((kind) => (
                            <option key={kind} value={kind}>
                              {kind === "image" ? "Image" : kind === "video" ? "Video" : "Link"}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field id={`media-title-${item.id}`} label="Title">
                        <Input id={`media-title-${item.id}`} name="title" />
                      </Field>
                    </div>
                    <Field id={`media-url-${item.id}`} label="Link" hint="Used when you are not uploading a file.">
                      <Input id={`media-url-${item.id}`} name="url" spellCheck={false} placeholder="https://" />
                    </Field>
                    <Field id={`media-file-${item.id}`} label="Image or video file">
                      <Input id={`media-file-${item.id}`} name="file" type="file" accept="image/*,video/*" />
                    </Field>
                    <Field id={`media-caption-${item.id}`} label="Caption">
                      <Input id={`media-caption-${item.id}`} name="caption" />
                    </Field>
                    <Field id={`media-alt-${item.id}`} label="Image description">
                      <Input id={`media-alt-${item.id}`} name="alt" />
                    </Field>
                    <Button type="submit" variant="secondary">
                      Add media
                    </Button>
                  </form>

                  <form action={deleteWorkAction} className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                    <input type="hidden" name="personSlug" value={profile.slug} />
                    <input type="hidden" name="workId" value={item.id} />
                    <label className="flex min-h-11 items-center gap-2 text-sm">
                      <input type="checkbox" name="confirm" value="delete" required />
                      Remove this work
                    </label>
                    <Button type="submit" variant="outline">
                      Remove work
                    </Button>
                  </form>
                </li>
              ))}
            </ul>

            <form action={saveWorkAction} className="mt-10 space-y-5 border border-dashed border-border px-4 py-5 sm:px-6">
              <input type="hidden" name="personSlug" value={profile.slug} />
              <h3 className="font-display text-3xl">Add work</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="new-title" label="Title">
                  <Input id="new-title" name="title" required />
                </Field>
                <Field id="new-years" label="Years">
                  <Input id="new-years" name="years" />
                </Field>
              </div>
              <Field id="new-medal" label="Medal for this work">
                <select id="new-medal" name="medal" className={selectClass} defaultValue="bronze">
                  {medalTiers.map((medal) => (
                    <option key={medal} value={medal}>
                      {medalLabel[medal]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="new-summary" label="Summary">
                <Textarea id="new-summary" name="summary" />
              </Field>
              <Field id="new-outcome" label="What changed">
                <Textarea id="new-outcome" name="outcome" />
              </Field>
              <Button type="submit">Add work</Button>
            </form>
          </section>

          <form action={deletePersonAction} className="mt-16 space-y-4 border border-border px-4 py-5 sm:px-6">
            <h2 className="font-display text-3xl">Remove this page</h2>
            <p className="text-sm text-muted-foreground">
              This removes the person, their work, and the media notes. Uploaded files stay in Blob.
            </p>
            <input type="hidden" name="personSlug" value={profile.slug} />
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" name="confirm" value="delete" required />
              I want this page removed from the record
            </label>
            <Button type="submit" variant="outline">
              Remove page
            </Button>
          </form>
        </>
      ) : (
        <p className="mt-10 text-muted-foreground">Save the page first, then add work, medals, and media.</p>
      )}
    </div>
  );
}
