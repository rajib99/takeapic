// Uploads public/media/** to Vercel Blob and writes src/lib/media-manifest.json
// ({ key: { url, w, h } }) which the site reads. Commit the manifest afterwards.
//   BLOB_READ_WRITE_TOKEN=... npm run media:upload
//   npm run media:local   -> manifest points at /media/* for local preview only
import { put } from "@vercel/blob";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DIR = join(ROOT, "public/media");
const local = process.argv.includes("--local");
// Auth: BLOB_READ_WRITE_TOKEN, or OIDC (VERCEL_OIDC_TOKEN + BLOB_STORE_ID, both from `vercel env pull`).
const { BLOB_READ_WRITE_TOKEN, VERCEL_OIDC_TOKEN, BLOB_STORE_ID } = process.env;
if (!local && !BLOB_READ_WRITE_TOKEN && !(VERCEL_OIDC_TOKEN && BLOB_STORE_ID)) {
  console.error("Missing Blob credentials. Connect the Blob store to the Development environment, then run `npx vercel env pull .env.local`.");
  process.exit(1);
}

const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
const dims = (f) => {
  const [w, h] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", f])
    .toString().trim().split(",").map(Number);
  return { w, h };
};

const manifest = {};
for (const file of walk(DIR).filter((f) => !f.endsWith(".DS_Store")).sort()) {
  const key = relative(DIR, file);
  let url = `/media/${key}`;
  if (!local) {
    // Content hash in the name: a replaced file gets a new URL, so the 1-year cache never serves stale media.
    const body = readFileSync(file);
    const hash = createHash("sha256").update(body).digest("hex").slice(0, 8);
    ({ url } = await put(`takeapic/${key.replace(/(\.[^.]+)$/, `-${hash}$1`)}`, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 31536000,
    }));
  }
  manifest[key] = { url, ...dims(file) };
  console.log(key, "->", url);
}
writeFileSync(join(ROOT, "src/lib/media-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${Object.keys(manifest).length} files. Wrote src/lib/media-manifest.json`);
