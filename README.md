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

**Access.** Email + password. Set these in Vercel (Settings → Environment Variables, Production), then redeploy:

| Variable | Value |
|---|---|
| `ADMIN_EMAILS` | Comma-separated emails allowed in. Remove one to revoke that person at once. |
| `ADMIN_SECRET` | The admin password, 16+ chars (`openssl rand -base64 18`). Also signs the session cookie; changing it signs everyone out. |

Go to `/admin` and sign in with an allowed email and the `ADMIN_SECRET` value. The browser then stays signed in for 90 days. Five wrong attempts lock that client out for 15 minutes. No email service is needed.

**Where edits live.** Each save writes `takeapic/content/<timestamp>.json` to Vercel Blob; the newest wins and the last 20 are kept as history (to roll back, delete the newest file in the Blob dashboard). Photos/videos the admin uploads go to `takeapic/uploads/`. With no saved file the site shows the defaults in `src/lib/text.ts`, `src/lib/config.ts` and the media manifest.
Set `CONTENT_DIR` to point a preview deployment at its own folder.

**Adding editable text.** Add an entry to `src/lib/text.ts`, then use `const { t, r } = await getSite()` and `t("your.key")` (`r` for `*accent*` markup).
