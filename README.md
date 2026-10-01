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
| `/admin` | Editorial desk: publish or return a page to draft |
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

Copy `.env.example` if you want to override the defaults.

| Variable | Purpose |
| --- | --- |
| `ADMIN_PIN` | Pin for `/admin`. Falls back to `tribute` when unset. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, Open Graph, and the sitemap. |

## Editorial desk

1. Open `/admin`.
2. Enter the pin (`tribute`, unless `ADMIN_PIN` is set).
3. Publish a draft, or return a public page to the desk.
4. Preview reads the page before it is public. A draft address on the public site stays off the record.

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

Published pages and drafts live in `data/profiles.json`. Portrait files live in `public/portraits/`. Editorial order is the order of that file: the first published page is the opening page.

`data/tips.json` starts empty. The desk appends suggestions there.

## Production

This preview stores pages and suggestions as JSON files on the server. That is enough to run and review the product. A public deployment needs a database (and real stories, with consent). If the disk is read-only, a suggestion is held in memory for that server process only, and the confirmation says so.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS.
