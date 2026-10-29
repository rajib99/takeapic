# Take a pic

Robot photo booth rental site. Next.js (App Router) + Stripe Checkout, built for Vercel.

## Run
    cp .env.example .env.local   # fill in Stripe keys
    npm run dev

## Deploy
1. Push to GitHub, import in Vercel, add the env vars from `.env.example`.
2. Add domain takeabic.biz in Vercel > Settings > Domains.
3. Stripe Dashboard > Developers > Webhooks: add `https://takeabic.biz/api/webhook`, event `checkout.session.completed`, copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
   Local testing: `stripe listen --forward-to localhost:3000/api/webhook`

## Edit content
Prices, packages, FAQs, testimonials: `src/lib/config.ts` (prices are placeholders).

## Media (Vercel Blob)
Client photos/videos are not in git. They're optimized, uploaded to Vercel Blob, and
referenced through `src/lib/media-manifest.json` (key -> URL + size).

1. `npm run media:prepare -- "/path/to/take a pic photos"` (needs ffmpeg) -> writes `public/media/` (gitignored)
2. Create a Blob store in Vercel (Storage tab), connect it to the project including the Development environment, then `npx vercel env pull .env.local`
3. `npm run media:upload` -> uploads and rewrites the manifest with Blob URLs. Commit the manifest.

`npm run media:local` writes a manifest pointing at `public/media/` for local preview only;
a Vercel build refuses to deploy with that manifest.

## Admin (`/admin`)

Edit all copy, photos, videos, prices, add-ons, FAQ and testimonials without a deploy. Layout, styles and code are not editable there.

**Access.** Passwordless. Set these in Vercel (Settings → Environment Variables, Production), then redeploy:

| Variable | Value |
|---|---|
| `ADMIN_EMAILS` | Comma-separated emails allowed in. Only these can request a link. Remove one to revoke that person at once. |
| `ADMIN_SECRET` | Random string, 24+ chars (`openssl rand -base64 32`). Signs links and sessions; changing it signs everyone out. |
| `RESEND_API_KEY`, `LEADS_FROM_EMAIL` | Already used for lead emails; the sign-in link is sent the same way. The sender domain must be verified in Resend to email addresses other than your own. |

Go to `/admin`, enter an allowed email, open the emailed link (valid 15 minutes). The browser then stays signed in for 90 days.
Locally (`npm run dev`) without Resend, the link is printed in the terminal.

**Where edits live.** Each save writes `takeapic/content/<timestamp>.json` to Vercel Blob; the newest wins and the last 20 are kept as history (to roll back, delete the newest file in the Blob dashboard). Photos/videos the admin uploads go to `takeapic/uploads/`. With no saved file the site shows the defaults in `src/lib/text.ts`, `src/lib/config.ts` and the media manifest.
Set `CONTENT_DIR` to point a preview deployment at its own folder.

**Adding editable text.** Add an entry to `src/lib/text.ts`, then use `const { t, r } = await getSite()` and `t("your.key")` (`r` for `*accent*` markup).
