import { readFileSync } from "node:fs";

// public/media is not deployed, so a manifest built with `media:local` would 404 in production.
const manifest = JSON.parse(readFileSync(new URL("./src/lib/media-manifest.json", import.meta.url), "utf8"));
if (process.env.VERCEL && Object.values(manifest).some((m) => m.url.startsWith("/media/"))) {
  throw new Error("src/lib/media-manifest.json has local URLs. Run `npm run media:upload` and commit the manifest.");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
};
export default nextConfig;
