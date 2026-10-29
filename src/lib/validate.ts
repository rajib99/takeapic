import { DEFAULT_BOOTHS, type AddOn, type Booth, type CatalogData, type Faq, type SiteInfo, type Testimonial, type Tier } from "./config";
import { TEXT } from "./text";

// Runs on the server for everything the admin saves. The checkout route prices orders from
// this data, so it has to be well-formed, not just typed.
type Result<T> = { ok: true; value: T } | { ok: false; error: string };
const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const arr = (v: unknown, max: number): unknown[] => (Array.isArray(v) ? v.slice(0, max) : []);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});
const money = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100000 ? Math.round(n * 100) / 100 : null;
};
const ID = /^[a-z0-9][a-z0-9-]{0,23}$/;

export function sanitizeSite(v: unknown): Result<SiteInfo> {
  const o = obj(v);
  const site = { name: str(o.name, 60), tagline: str(o.tagline, 200), email: str(o.email, 120), phone: str(o.phone, 40), area: str(o.area, 80) };
  if (!site.name) return fail("Business name is required.");
  if (!/^\S+@\S+\.\S+$/.test(site.email)) return fail("Enter a valid contact email.");
  return { ok: true, value: site };
}

export function sanitizeDeposit(v: unknown): Result<number> {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 100 ? { ok: true, value: n } : fail("Deposit must be a whole number from 1 to 100.");
}

export function sanitizeBooths(v: unknown): Result<Booth[]> {
  const out: Booth[] = [];
  for (const raw of arr(v, 8)) {
    const o = obj(raw);
    const base = DEFAULT_BOOTHS.find((b) => b.slug === o.slug);
    if (!base) return fail("Unknown booth.");
    if (out.some((b) => b.slug === base.slug)) return fail("Duplicate booth.");
    const extraHour = money(o.extraHour);
    if (extraHour === null) return fail(`${base.name}: extra hour price is invalid.`);
    const tiers: Tier[] = [];
    for (const rawTier of arr(o.tiers, 6)) {
      const t = obj(rawTier);
      const id = str(t.id, 24);
      const price = money(t.price);
      const hours = Number(t.hours);
      if (!ID.test(id) || tiers.some((x) => x.id === id)) return fail(`${base.name}: each package needs a unique short id (letters, numbers, dashes).`);
      if (price === null) return fail(`${base.name}: "${str(t.name, 60)}" has an invalid price.`);
      if (!Number.isFinite(hours) || hours < 0 || hours > 24) return fail(`${base.name}: "${str(t.name, 60)}" has invalid hours.`);
      const name = str(t.name, 60);
      if (!name) return fail(`${base.name}: every package needs a name.`);
      tiers.push({
        id, name, price, hours,
        blurb: str(t.blurb, 200),
        features: arr(t.features, 10).map((f) => str(f, 120)).filter(Boolean),
        ...(t.featured ? { featured: true } : {}),
      });
    }
    if (!tiers.length) return fail(`${base.name} needs at least one package.`);
    // One "most popular" at most.
    let seen = false;
    for (const t of tiers) { if (t.featured && seen) delete t.featured; if (t.featured) seen = true; }
    const name = str(o.name, 80);
    if (!name) return fail("Every booth needs a name.");
    out.push({ slug: base.slug, name, short: str(o.short, 240), pricingModel: str(o.pricingModel, 240), extraHour, tiers });
  }
  if (out.length !== DEFAULT_BOOTHS.length) return fail("All four booths must be present.");
  return { ok: true, value: DEFAULT_BOOTHS.map((b) => out.find((x) => x.slug === b.slug)!) };
}

export function sanitizeAddons(v: unknown): Result<AddOn[]> {
  const out: AddOn[] = [];
  for (const raw of arr(v, 12)) {
    const o = obj(raw);
    const id = str(o.id, 24);
    const price = money(o.price);
    const name = str(o.name, 60);
    if (!ID.test(id) || out.some((a) => a.id === id)) return fail("Each add-on needs a unique short id (letters, numbers, dashes).");
    if (!name) return fail("Every add-on needs a name.");
    if (price === null) return fail(`Add-on "${name}" has an invalid price.`);
    out.push({ id, name, price, icon: str(o.icon, 8), blurb: str(o.blurb, 240), ...(o.quoted ? { quoted: true } : {}) });
  }
  return { ok: true, value: out };
}

export function sanitizeFaqs(v: unknown): Result<Faq[]> {
  const out = arr(v, 40).map((raw) => ({ q: str(obj(raw).q, 200), a: str(obj(raw).a, 1500) })).filter((f) => f.q && f.a);
  return { ok: true, value: out };
}

export function sanitizeTestimonials(v: unknown): Result<Testimonial[]> {
  const out = arr(v, 12)
    .map((raw) => ({ quote: str(obj(raw).quote, 600), name: str(obj(raw).name, 60), event: str(obj(raw).event, 80) }))
    .filter((t) => t.quote && t.name);
  return { ok: true, value: out };
}

export const sanitizers = {
  site: sanitizeSite,
  depositPct: sanitizeDeposit,
  booths: sanitizeBooths,
  addons: sanitizeAddons,
  faqs: sanitizeFaqs,
  testimonials: sanitizeTestimonials,
} satisfies { [K in keyof CatalogData]: (v: unknown) => Result<CatalogData[K]> };

/** Known keys only, trimmed, and dropped when blank or unchanged so defaults keep flowing. */
export function sanitizeTextEdits(edits: unknown): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const [k, v] of Object.entries(obj(edits))) {
    const def = TEXT[k];
    if (!def || typeof v !== "string") continue;
    const value = v.replace(/\r\n/g, "\n").trim().slice(0, 2000);
    out[k] = !value || value === def.value ? null : value; // null = remove override
  }
  return out;
}
