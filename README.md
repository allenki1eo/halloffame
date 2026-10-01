# Shukran TZ

Working title. A living tribute to Tanzanians and the work they are making.

Editors publish each page. A visitor may suggest someone; that note stays on the desk. Pages sit side by side, in the order of the record. The people in this preview are fictional, so the form of a page can be read before real stories are published with consent.

## Routes

| Path | What it is |
| --- | --- |
| `/` | Opening page, the public record, and the four categories |
| `/categories` | Category index |
| `/categories/[slug]` | Work-first browse for one category |
| `/profiles/[slug]` | Tribute page: work, then journey, then why it matters, then share |
| `/suggest` | Private suggestion for the editors |
| `/admin` | Editorial desk: publish, unpublish, and open a page for editing |
| `/admin/people/new` | Create a person, honor medal, and portrait |
| `/admin/people/[slug]` | Edit a person, work, medals, and media |
| `/admin/preview/[slug]` | Desk preview, including drafts |
| `POST /api/tips` | Same suggestion, as JSON |

Categories: Tech & innovation, Science & health, Arts & culture, Community & service.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

Copy `.env.example` if you want to override the defaults. The app builds and the public pages render from `data/profiles.json` when the Turso variables are absent. Do not commit real tokens.

| Variable | Purpose |
| --- | --- |
| `TURSO_DATABASE_URL` | Turso Cloud database URL, for example `libsql://your-database.turso.io`. |
| `TURSO_AUTH_TOKEN` | Token for that database. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token used by `@vercel/blob` for image and video uploads. |
| `ADMIN_PIN` | Pin for `/admin`. Falls back to `tribute` when unset. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, Open Graph, and the sitemap. |

## Connect Turso and Blob

These are the steps to move the live site off the demo file.

1. Create a Turso Cloud database. The default libSQL engine is the one this app uses with Drizzle and `@libsql/client`. Copy the database URL and the auth token.
2. Create a Blob store on the Vercel project (Storage → Blob). Copy `BLOB_READ_WRITE_TOKEN`.
3. On the Vercel project, open Settings → Environment Variables and paste:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `BLOB_READ_WRITE_TOKEN`
   - `ADMIN_PIN` (choose a pin; if you leave it unset the desk uses `tribute`)
   - `NEXT_PUBLIC_SITE_URL` (the public origin, such as `https://halloffame-nine.vercel.app`)
4. Redeploy so the app can see those variables.
5. On a machine that has the same `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`, apply the schema and copy the demo pages in:

```bash
npm run db:migrate
npm run db:seed
```

`db:migrate` runs `drizzle/0000_phase1.sql`. `db:seed` upserts the people in `data/profiles.json`, including honor medals, work medals, and sample media. Running the seed again replaces work and media for those demo slugs.

6. Open `/admin`, enter the pin, and edit. A portrait, image, or video file is stored in Blob. A pasted link is stored as media metadata and does not need Blob.

Without the Turso variables, `npm run db:migrate` and `npm run db:seed` stop with a message, and the site keeps reading `data/profiles.json`.

## Schema

Medals are `bronze`, `silver`, `gold`, `platinum`, or `diamond`. A person has one honor medal. Each work item has its own medal. Editorial order is `sort_order`, then the order in the demo file. Medals are not used to arrange the public lists.

| Table | What it holds |
| --- | --- |
| `people` | Slug, name, category, place, role, one line, portrait URL and description, `published` or `draft`, `honor_medal`, journey and why-it-matters as JSON text, `sort_order` |
| `work_items` | Belongs to a person. Title, years, summary, outcome, `medal`, `sort_order` |
| `work_media` | Belongs to a work item. `kind` is `image`, `video`, or `link`, plus URL, title, caption, and alt text |

Drizzle schema: `src/lib/db/schema.ts`. Migration: `drizzle/0000_phase1.sql`.

## Editorial desk

1. Open `/admin`.
2. Enter the pin (`tribute`, unless `ADMIN_PIN` is set).
3. Publish a draft, or return a public page to the desk.
4. With Turso connected, use New page or Edit to set the honor medal, add work, set each work medal, and upload an image or video or paste a link.
5. Preview reads the page before it is public. A draft address on the public site stays off the record.

The session is an HTTP-only cookie, kept for twelve hours.

## Suggestions

The form at `/suggest` and `POST /api/tips` write the same note.

```bash
curl -s -X POST http://localhost:3000/api/tips \
  -H 'content-type: application/json' \
  -d '{
    "personName": "Asha Ngonyani",
    "category": "community",
    "place": "Lindi",
    "workSummary": "Runs an evening repair hour for school uniforms at the ward office.",
    "why": "Pupils stay in class because the uniform is mended in the neighbourhood.",
    "suggesterName": "Juma",
    "contact": "0712000000"
  }'
```

A successful response confirms the note and says where this preview stored it. `category` is one of `tech`, `science`, `arts`, `community`.

Notes are not listed in public. On the desk they appear after you sign in.

## Content

When `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are both set, people, work, medals, and media metadata are read from Turso. Otherwise the site reads `data/profiles.json`, which already includes honor medals, work medals, and sample images and links so the pages can be previewed with no secrets.

Portrait files for the demo live in `public/portraits/`. Editorial order is file order, or `sort_order` in Turso. The first published page is the opening page.

`data/tips.json` starts empty. The desk appends suggestions there. If the disk is read-only, a suggestion is held in memory for that server process only, and the confirmation says so.

## Production

Set the environment variables in [Connect Turso and Blob](#connect-turso-and-blob), migrate, and seed once. Real stories still need consent before they replace the fictional demo pages. Uploaded files live in the Blob store. The database stores the URL, not the file bytes.

## Design

The public site is an editorial layout: warm paper, a deep green, Fraunces for display type, and Source Sans 3 for reading. Photography is full-bleed. Motion is a short rise as a section enters, and a slight scale on a portrait, both dropped when reduced motion is requested. Interface pieces (buttons, sheets, dialogs, fields, cards, badges) come from shadcn/ui and are tuned so the pages do not look like a default dashboard.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM, Turso (libSQL via `@libsql/client`), and `@vercel/blob`.
