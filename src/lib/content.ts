import { del, list, put } from "@vercel/blob";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { catalog, DEFAULT_DATA, type CatalogData } from "./config";
import { buildMedia, type MediaOverride } from "./media";
import { rich } from "./rich";
import { fill, TEXT } from "./text";

// Admin edits live in a JSON file on Vercel Blob. The site layers it over the defaults in
// config.ts / text.ts / media-manifest.json, so with no file (or no Blob access) it shows the defaults.
export type Stored = {
  text?: Record<string, string>;
  media?: Record<string, MediaOverride>;
  data?: Partial<CatalogData>;
};

// Each save is a new file, `<DIR>/<timestamp>.json`, and the newest one wins. A fresh URL every time means
// no CDN or cache can serve an older copy, and the last KEEP versions double as a rollback history.
// CONTENT_DIR lets a preview/test environment use its own folder without touching the live site's edits.
const DIR = process.env.CONTENT_DIR || "takeapic/content";
const KEEP = 20;
const hasBlobAccess = () => !!(process.env.BLOB_READ_WRITE_TOKEN || (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID));

const versions = async () => (await list({ prefix: `${DIR}/` })).blobs.sort((a, b) => a.pathname.localeCompare(b.pathname));

/** Bypasses every cache. Used by the admin so it never edits stale data. */
export async function readStored(): Promise<Stored> {
  if (!hasBlobAccess()) return {};
  const newest = (await versions()).at(-1);
  if (!newest) return {};
  const res = await fetch(newest.url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Saved content responded ${res.status}`); // keep serving the last good page rather than silently showing defaults
  const json = await res.json();
  return json && typeof json === "object" ? (json as Stored) : {};
}

const readCached = unstable_cache(readStored, ["site-content"], { tags: ["content"], revalidate: 3600 });

/** Read-modify-write, then refresh every page. Callers must have checked the admin session. */
export async function updateStored(change: (s: Stored) => void): Promise<void> {
  if (!hasBlobAccess()) throw new Error("Vercel Blob is not configured, so edits cannot be saved.");
  const stored = await readStored();
  change(stored);
  await put(`${DIR}/${String(Date.now()).padStart(15, "0")}.json`, JSON.stringify(stored), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 31536000,
  });
  const all = await versions();
  if (all.length > KEEP) await del(all.slice(0, all.length - KEEP).map((b) => b.url)).catch(() => {});
  revalidateTag("content", { expire: 0 });
  revalidatePath("/", "layout");
}

export const mergeData = (stored: Partial<CatalogData> = {}): CatalogData => ({
  site: { ...DEFAULT_DATA.site, ...stored.site },
  depositPct: stored.depositPct ?? DEFAULT_DATA.depositPct,
  booths: stored.booths ?? DEFAULT_DATA.booths,
  addons: stored.addons ?? DEFAULT_DATA.addons,
  faqs: stored.faqs ?? DEFAULT_DATA.faqs,
  testimonials: stored.testimonials ?? DEFAULT_DATA.testimonials,
});

/** Everything a page needs: copy, media, pricing. One call per component: `const { t, media } = await getSite()`. */
export const getSite = cache(async () => {
  const stored = await readCached();
  const text = stored.text ?? {};
  const t = (key: string, vars?: Record<string, string | number>) => {
    const def = TEXT[key];
    if (!def) throw new Error(`Unknown text key "${key}". Add it to lib/text.ts.`);
    return fill(text[key] || def.value, vars);
  };
  const r = (key: string, vars?: Record<string, string | number>) => rich(t(key, vars));
  const data = mergeData(stored.data);
  return { t, r, ...buildMedia(stored.media), data, cat: catalog(data), site: data.site };
});
export type Site = Awaited<ReturnType<typeof getSite>>;
