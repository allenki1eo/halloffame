# Shukran TZ

Working title. A living tribute to Tanzanians and the work they are making.

Editors publish each page. A visitor may suggest someone; that note stays on the desk. Pages sit side by side, in the order of the record. Production starts with an empty record. The eight fictional pages live in `data/demo-profiles.json` for a local preview and are not the public site.

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

## Language

The public addresses stay as they are (`/`, `/profiles/amina-juma`, `/categories/tech`). English and Kiswahili share those URLs. A visitor chooses **EN** or **SW** in the header. The choice is stored in the cookie `shukran_lang` for a year and is available on a phone without opening the menu.

Chrome (navigation, home, categories, suggest, and the desk labels) comes from dictionaries in `src/lib/messages.ts`. Tribute copy stays in English on each record. Kiswahili is an optional overlay (`sw` on a person, and on each piece of work). An empty Kiswahili field falls back to the English. Years that say “ongoing” read as “inaendelea” on the Kiswahili page. `html lang` follows the cookie (`en-TZ` or `sw-TZ`).

## Reach them

A person may have up to eight links: X, Instagram, LinkedIn, Facebook, YouTube, WhatsApp, a website, or email. The public profile shows them as a short **Reach them** / **Wafikie** row. Each link opens in a new tab. An empty list hides the row. Editors add and remove the links on the person form. Demo links use `example.com` and example addresses.

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

Copy `.env.example` if you want to override the defaults. The app builds with no secrets. In production the public record is empty until Turso has real pages. Do not commit real tokens.

| Variable | Purpose |
| --- | --- |
| `TURSO_DATABASE_URL` | Turso Cloud database URL, for example `libsql://your-database.turso.io`. |
| `TURSO_AUTH_TOKEN` | Token for that database. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read-write token. Portrait, image, and video uploads call `@vercel/blob` `put` with this token. |
| `BLOB_STORE_ID` | Blob store id Vercel attaches to the project. Passed through on upload, and used with Vercel OIDC when the token is not the credential. |
| `ADMIN_PIN` | Pin for `/admin`. Falls back to `tribute` when unset. Set a private pin in production. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, Open Graph, and the sitemap. |
| `ALLOW_DEMO_SEED` | Local only. Must be `1` before `npm run db:seed` will copy fictional pages into Turso. Never set this on Vercel. |
| `CONFIRM_CLEAR_DEMOS` | Must be `1` before `npm run db:clear-demos` deletes the eight fictional slugs from Turso. |

## Production checklist

Do these on the live project. Do not seed the fictional pages.

1. Turso database exists. `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set on Vercel.
2. Blob store is connected. `BLOB_READ_WRITE_TOKEN` and `BLOB_STORE_ID` are set on Vercel. Do not copy those values into the repo.
3. `ADMIN_PIN` is a private pin, not the local fallback.
4. `NEXT_PUBLIC_SITE_URL` is the public origin, such as `https://halloffame-nine.vercel.app`.
5. From a machine that has the Turso variables, apply the schema. Do not set `ALLOW_DEMO_SEED`.

```bash
npm run db:migrate
```

6. Redeploy. An empty database is an empty public site. Create the first real page from `/admin`.
7. If an earlier seed already put the fictional people in Turso, remove them once:

```bash
CONFIRM_CLEAR_DEMOS=1 npm run db:clear-demos
```

`db:migrate` applies `drizzle/0000_phase1.sql`, `drizzle/0001_traffic.sql`, and `drizzle/0002_i18n_socials.sql` in order. Run it again after pulling Kiswahili and social links so the new columns exist. A second run skips a column that is already there. Language and social links do not need a new environment variable.

A portrait, image, or video file is stored in Blob. A pasted link is stored as media metadata and does not need Blob.

`npm run db:seed` refuses to run unless `ALLOW_DEMO_SEED=1`. That flag is for a local database only. It copies `data/demo-profiles.json` and replaces work and media for those eight slugs. Production must not set the flag and must not run the seed.

## Schema

Medals are `bronze`, `silver`, `gold`, `platinum`, or `diamond`. A person has one honor medal. Each work item has its own medal. Editorial order is `sort_order`, then the order in the demo file. Medals are not used to arrange the public lists.

| Table | What it holds |
| --- | --- |
| `people` | Slug, name, category, place, role, one line, portrait URL and description, `published` or `draft`, `honor_medal`, journey and why-it-matters as JSON text, `sw_json` (Kiswahili overlay), `socials_json` (optional links), `sort_order` |
| `work_items` | Belongs to a person. Title, years, summary, outcome, `medal`, `sw_json`, `sort_order` |
| `work_media` | Belongs to a work item. `kind` is `image`, `video`, or `link`, plus URL, title, caption, and alt text |
| `page_views` | Public path, referrer host, `utm_source`, `utm_medium`, `utm_campaign`, coarse device (`mobile` or `desktop`), `created_at` |
| `click_events` | `read_work`, `open_profile`, `open_category`, `suggest`, or `share`, plus path, target, referrer host, `utm_source` |

Drizzle schema: `src/lib/db/schema.ts`. Migrations: `drizzle/0000_phase1.sql`, `drizzle/0001_traffic.sql`, `drizzle/0002_i18n_socials.sql`.

Allen: if Turso is already connected, run `npm run db:migrate` again for `0002_i18n_socials.sql`. Do not seed the fictional pages into that database. If they are already there, run `CONFIRM_CLEAR_DEMOS=1 npm run db:clear-demos`. Without the Turso variables, production renders an empty record. `next dev` on a laptop can still preview `data/demo-profiles.json`.

## Traffic

Public pages send a small beacon to `POST /api/traffic` after they load, and again when someone uses Read the work, a profile link, a category link, Suggest someone, or Pass this page on. There is no cookie and no account. The editorial desk is not counted. A missed beacon does not change the page.

With `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` set, rows go to `page_views` and `click_events`. Without them, the server appends `data/traffic.json` (kept out of git). If that write fails, the event is dropped.

`/admin` shows today, 7 days, and 30 days, top pages, referrer hosts, and recent clicks. Allen: after this deploy, run `npm run db:migrate` once against the existing Turso database. No extra Vercel product is required.

## Editorial desk

1. Open `/admin`.
2. Enter the pin (`tribute`, unless `ADMIN_PIN` is set).
3. Publish a draft, or return a public page to the desk.
4. With Turso connected, use New page or Edit to set the honor medal, add work, set each work medal, upload an image or video or paste a link, add Reach them links, and fill optional Kiswahili fields.
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

When `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are both set, people, work, medals, and media metadata are read from Turso only. An empty table is an empty site. The app does not fill that gap from a JSON file.

In production, the eight fictional slugs stay off the public site even if an older seed left them in Turso. `next dev` without Turso reads `data/demo-profiles.json` so the page form can be previewed locally. `data/profiles.json` is an empty array and is not the public record.

Portrait files for that local preview live in `public/portraits/`. Editorial order is `sort_order` in Turso. The first published page that is allowed on the public site is the opening page.

`data/tips.json` starts empty. The desk appends suggestions there. If the disk is read-only, a suggestion is held in memory for that server process only, and the confirmation says so.

Uploaded files live in the Blob store. The database stores the URL, not the file bytes.

## Design

The public site is an editorial layout: warm paper, a deep green, Fraunces for display type, and Source Sans 3 for reading. Photography is full-bleed. Motion is a short rise as a section enters, and a slight scale on a portrait, both dropped when reduced motion is requested. Interface pieces (buttons, sheets, dialogs, fields, cards, badges) come from shadcn/ui and are tuned so the pages do not look like a default dashboard.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM, Turso (libSQL via `@libsql/client`), and `@vercel/blob`.
