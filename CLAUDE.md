# Blood Donation Registry

Next.js 16 (App Router, TypeScript, Tailwind v4) + Supabase (Postgres + Storage).
Live at **donations-for-noa.org**, deployed on Vercel (auto-deploys on push to `main`).

## Stack
- **Framework:** Next.js 16, App Router, React 19, `force-dynamic` on the homepage
- **Database:** Supabase Postgres (free tier — 500 MB storage limit, be mindful)
- **Storage:** Supabase Storage bucket `donation-photos` (public)
- **Fonts:** Cormorant Garamond (display) + Lora (body) via `next/font/google`
- **Styling:** Tailwind v4 with custom tokens in `app/globals.css` — crimson/cream palette

## Key files
| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage — fetches donations, composes all sections |
| `app/actions.ts` | Server actions: `getDonations()` and `submitDonation(formData)` |
| `app/components/StatsSection.tsx` | Hero: site title + donation count (with optional JustGiving total) + blood drop graphic |
| `app/components/AboutSection.tsx` | Reads `content/about.md`, renders as HTML |
| `app/components/DonationCard.tsx` | Server component card for a single donation |
| `app/components/DonationForm.tsx` | `"use client"` form with live photo preview + client-side compression |
| `app/components/GoodCauseSection.tsx` | Reads `content/good-cause.md`, renders as HTML |
| `app/components/FAQSection.tsx` | Accordion FAQ, questions/answers defined inline |
| `app/globals.css` | Tailwind v4 theme tokens (colours, fonts, animations) |
| `lib/supabase.ts` | Lazy Supabase client via `getSupabase()` — throws if env vars missing |
| `lib/justgiving.ts` | Cached scrape of total raised on the matching JustGiving page; 1-hour TTL via `unstable_cache` |
| `types/donation.ts` | `Donation` interface |
| `supabase/schema.sql` | Full DB + storage setup — run once in Supabase SQL editor |
| `content/about.md` | About section copy (markdown, no frontmatter) |
| `content/good-cause.md` | Good cause section copy (markdown, no frontmatter; inline HTML allowed) |

## Database schema
```sql
donations (
  id         uuid primary key,
  name       text not null,
  donated_at date not null,
  location   varchar not null,
  message    text,           -- optional
  photo_url  text,           -- optional, public URL from Supabase Storage
  created_at timestamptz default now()
)
```

## Package manager
Use **bun** for all package operations (`bun add`, `bun dev`, `bunx tsc`, etc.). Do not use npm or npx.

## Local dev
1. Copy `.env.local.example` → `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
2. `bun dev`

`supabase/schema.sql` is for reference — the DB is already provisioned.

## Photo uploads
Photos are compressed **client-side** before upload (in `DonationForm.tsx`):
- Max 1200px on longest side, re-encoded as JPEG at 80% quality
- Typical mobile photo: ~5 MB → ~150 KB
- This is intentional to stay within Supabase's 500 MB free tier
- Do not remove or bypass this compression

The server action (`submitDonation`) receives the compressed file, converts to `ArrayBuffer`, and uploads to the `donation-photos` Supabase Storage bucket, storing the public URL in `photo_url`.

## Design tokens (Tailwind v4)
```
cream         #FDF6EE   page background
crimson       #C0392B   primary accent
crimson-dark  #96211A   hover states
crimson-mid   #E74C3C   blockquote border
crimson-light #FEF2F2   error backgrounds
warm-ink      #1A0505   body text
warm-muted    #7C4040   secondary text
warm-border   #E8CFCF   card borders
```

## Page structure (in order)
1. Sticky nav header
2. `StatsSection` — site title ("Donations for Noa") + donation count + equivalence line + blood drop grid
3. `AboutSection` — rendered from `content/about.md`
4. Donation form (`id="record"`)
5. Donations grid (`id="donations"`)
6. `GoodCauseSection` — rendered from `content/good-cause.md`; includes link to https://www.justgiving.com/page/donations-for-noa
7. `FAQSection`
8. Footer

## Content
- `content/about.md` — About section copy. Parsed with `remark` + `remark-html`, rendered via `dangerouslySetInnerHTML`. No frontmatter.
- `content/good-cause.md` — Good cause section copy. Same pipeline as About, but rendered with `remark-html`'s `{ sanitize: false }` so the JustGiving link can keep its raw `<a target="_blank">` markup.
- `FAQSection.tsx` has its copy written inline (no markdown file) — edit the component directly.

## Notes
- After a successful form submission, `revalidatePath('/')` refreshes the feed
- The photo upload button uses a `<label htmlFor="photo-input">` to trigger the file input — this is intentional for mobile browser compatibility (programmatic `.click()` on hidden inputs is unreliable on Android)
- Paragraph text in About and Good Cause sections uses `text-warm-ink`; FAQ answer text also uses `text-warm-ink`
