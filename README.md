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
2. Create a Blob store in Vercel (Storage tab), copy `BLOB_READ_WRITE_TOKEN` into `.env.local`
3. `npm run media:upload` -> uploads and rewrites the manifest with Blob URLs. Commit the manifest.

`npm run media:local` writes a manifest pointing at `public/media/` for local preview only;
a Vercel build refuses to deploy with that manifest.
