"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resetData, saveData } from "@/app/admin/actions";
import { DEFAULT_ADDONS, DEFAULT_DEPOSIT_PCT, DEFAULT_BOOTHS, DEFAULT_FAQS, DEFAULT_SITE, DEFAULT_TESTIMONIALS, type AddOn, type Booth, type Faq, type SiteInfo, type Testimonial } from "@/lib/config";
import { SaveBar, useSave } from "./save";

type Draft = Record<string, string | boolean>;

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <label className={`a-field ${wide ? "a-wide" : ""}`}><span>{label}</span>{children}</label>;
}

function ResetButton({ section, custom, label = "Reset to original" }: { section: Parameters<typeof resetData>[0] | Parameters<typeof resetData>[0][]; custom: boolean; label?: string }) {
  const { state, run } = useSave();
  const sections = Array.isArray(section) ? section : [section];
  if (!custom) return null;
  return (
    <button type="button" className="a-btn a-btn-ghost" disabled={state.kind === "busy"} onClick={async () => {
      if (!confirm("Discard your edits and go back to the original content?")) return;
      if (await run(async () => { for (const s of sections) { const r = await resetData(s); if (!r.ok) return r; } return { ok: true }; })) location.reload();
    }}>{label}</button>
  );
}

const move = <T,>(list: T[], i: number, d: -1 | 1) => {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

// ── Booths & packages ──────────────────────────────────────────────────────
type TierDraft = { id: string; name: string; price: string; hours: string; blurb: string; features: string; featured: boolean; isNew: boolean };
type BoothDraft = { slug: string; name: string; short: string; pricingModel: string; extraHour: string; tiers: TierDraft[] };

const toDraft = (b: Booth): BoothDraft => ({
  slug: b.slug, name: b.name, short: b.short, pricingModel: b.pricingModel, extraHour: String(b.extraHour),
  tiers: b.tiers.map((t) => ({ id: t.id, name: t.name, price: String(t.price), hours: String(t.hours), blurb: t.blurb, features: t.features.join("\n"), featured: !!t.featured, isNew: false })),
});

export function BoothsEditor({ initial, custom }: { initial: Booth[]; custom: boolean }) {
  const router = useRouter();
  const [booths, setBooths] = useState(() => initial.map(toDraft));
  const { state, run } = useSave();

  const setBooth = (i: number, patch: Partial<BoothDraft>) => setBooths((bs) => bs.map((b, k) => (k === i ? { ...b, ...patch } : b)));
  const setTier = (i: number, j: number, patch: Partial<TierDraft>) =>
    setBooth(i, { tiers: booths[i].tiers.map((t, k) => (k === j ? { ...t, ...patch } : t)) });
  const setFeatured = (i: number, j: number, on: boolean) =>
    setBooth(i, { tiers: booths[i].tiers.map((t, k) => ({ ...t, featured: on && k === j })) });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = booths.map((b) => ({
      ...b,
      extraHour: b.extraHour,
      tiers: b.tiers.map((t) => ({ id: t.id, name: t.name, price: t.price, hours: t.hours, blurb: t.blurb, features: t.features.split("\n"), featured: t.featured })),
    }));
    if (await run(() => saveData("booths", payload))) router.refresh();
  }

  return (
    <form onSubmit={submit} className="a-form">
      {booths.map((b, i) => (
        <section key={b.slug} className="a-card">
          <h2>{b.name || DEFAULT_BOOTHS[i].name}</h2>
          <div className="a-cols">
            <Field label="Name"><input value={b.name} onChange={(e) => setBooth(i, { name: e.target.value })} required maxLength={80} /></Field>
            <Field label="Price per extra hour ($)"><input type="number" min="0" step="0.01" value={b.extraHour} onChange={(e) => setBooth(i, { extraHour: e.target.value })} required /></Field>
          </div>
          <Field label="Short description (on the booth card)"><textarea rows={2} value={b.short} onChange={(e) => setBooth(i, { short: e.target.value })} maxLength={240} /></Field>
          <Field label="How this booth is priced (one line above the packages)"><textarea rows={2} value={b.pricingModel} onChange={(e) => setBooth(i, { pricingModel: e.target.value })} maxLength={240} /></Field>

          {b.tiers.map((t, j) => (
            <div key={j} className="a-sub">
              <div className="a-subhead">
                <strong>Package {j + 1}</strong>
                <span className="a-row">
                  <label className="a-check"><input type="checkbox" checked={t.featured} onChange={(e) => setFeatured(i, j, e.target.checked)} /> Most popular</label>
                  <button type="button" className="a-link" onClick={() => setBooth(i, { tiers: move(b.tiers, j, -1) })} aria-label="Move up">↑</button>
                  <button type="button" className="a-link" onClick={() => setBooth(i, { tiers: move(b.tiers, j, 1) })} aria-label="Move down">↓</button>
                  <button type="button" className="a-link a-danger" disabled={b.tiers.length < 2} onClick={() => { if (confirm(`Remove “${t.name || "this package"}”?`)) setBooth(i, { tiers: b.tiers.filter((_, k) => k !== j) }); }}>Remove</button>
                </span>
              </div>
              <div className="a-cols">
                <Field label="Name"><input value={t.name} onChange={(e) => setTier(i, j, { name: e.target.value })} required maxLength={60} /></Field>
                <Field label="Price ($)"><input type="number" min="0" step="0.01" value={t.price} onChange={(e) => setTier(i, j, { price: e.target.value })} required /></Field>
                <Field label="Hours"><input type="number" min="0" max="24" step="0.5" value={t.hours} onChange={(e) => setTier(i, j, { hours: e.target.value })} required /></Field>
              </div>
              <Field label="One-line pitch"><input value={t.blurb} onChange={(e) => setTier(i, j, { blurb: e.target.value })} maxLength={200} /></Field>
              <Field label="What's included (one per line)"><textarea rows={5} value={t.features} onChange={(e) => setTier(i, j, { features: e.target.value })} /></Field>
              {t.isNew
                ? <Field label="Short id (used in booking links; letters, numbers, dashes)"><input value={t.id} onChange={(e) => setTier(i, j, { id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} required maxLength={24} /></Field>
                : <p className="a-muted a-small">Booking id: <code>{b.slug}:{t.id}</code></p>}
            </div>
          ))}
          {b.tiers.length < 6 && (
            <button type="button" className="a-btn a-btn-ghost" onClick={() => setBooth(i, { tiers: [...b.tiers, { id: `pkg-${Date.now().toString(36).slice(-5)}`, name: "", price: "0", hours: "2", blurb: "", features: "", featured: false, isNew: true }] })}>+ Add a package</button>
          )}
        </section>
      ))}
      <SaveBar state={state}><ResetButton section="booths" custom={custom} /></SaveBar>
    </form>
  );
}

// ── Add-ons, FAQ, testimonials ─────────────────────────────────────────────
type ListKind = "addons" | "faqs" | "testimonials";
type Spec = {
  noun: string;
  fields: { k: string; label: string; type?: "text" | "number" | "area" | "check"; narrow?: boolean }[];
  title: (d: Draft) => string;
  blank: () => Draft;
  defaults: unknown[];
  max: number;
};

const SPECS: Record<ListKind, Spec> = {
  addons: {
    noun: "add-on",
    fields: [
      { k: "icon", label: "Icon (an emoji)", narrow: true }, { k: "name", label: "Name" }, { k: "price", label: "Price ($)", type: "number", narrow: true },
      { k: "blurb", label: "Description", type: "area" }, { k: "quoted", label: "Quoted: show the price as “from”, don't charge it online", type: "check" },
    ],
    title: (d) => `${d.icon ?? ""} ${d.name || "New add-on"}`,
    blank: () => ({ id: `addon-${Date.now().toString(36).slice(-5)}`, icon: "✨", name: "", price: "0", blurb: "", quoted: false }),
    defaults: DEFAULT_ADDONS, max: 12,
  },
  faqs: {
    noun: "question",
    fields: [{ k: "q", label: "Question" }, { k: "a", label: "Answer", type: "area" }],
    title: (d) => String(d.q || "New question"),
    blank: () => ({ q: "", a: "" }),
    defaults: DEFAULT_FAQS, max: 40,
  },
  testimonials: {
    noun: "testimonial",
    fields: [{ k: "quote", label: "What they said", type: "area" }, { k: "name", label: "Name" }, { k: "event", label: "Event (e.g. Wedding, Brooklyn)" }],
    title: (d) => String(d.name || "New testimonial"),
    blank: () => ({ quote: "", name: "", event: "" }),
    defaults: DEFAULT_TESTIMONIALS, max: 12,
  },
};

export function ListEditor({ kind, initial, custom }: { kind: ListKind; initial: (AddOn | Faq | Testimonial)[]; custom: boolean }) {
  const spec = SPECS[kind];
  const router = useRouter();
  const [items, setItems] = useState<Draft[]>(() => initial.map((x) => Object.fromEntries(Object.entries(x).map(([k, v]) => [k, typeof v === "number" ? String(v) : (v as string | boolean)]))));
  const { state, run } = useSave();
  const set = (i: number, k: string, v: string | boolean) => setItems((l) => l.map((d, n) => (n === i ? { ...d, [k]: v } : d)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (await run(() => saveData(kind, items))) router.refresh();
  }

  return (
    <form onSubmit={submit} className="a-form">
      {items.map((d, i) => (
        <section key={i} className="a-card">
          <div className="a-subhead">
            <strong>{spec.title(d)}</strong>
            <span className="a-row">
              <button type="button" className="a-link" onClick={() => setItems(move(items, i, -1))} aria-label="Move up">↑</button>
              <button type="button" className="a-link" onClick={() => setItems(move(items, i, 1))} aria-label="Move down">↓</button>
              <button type="button" className="a-link a-danger" onClick={() => { if (confirm(`Remove this ${spec.noun}?`)) setItems(items.filter((_, n) => n !== i)); }}>Remove</button>
            </span>
          </div>
          <div className="a-cols">
            {spec.fields.filter((f) => f.type !== "area" && f.type !== "check").map((f) => (
              <Field key={f.k} label={f.label}>
                <input type={f.type === "number" ? "number" : "text"} {...(f.type === "number" ? { min: 0, step: "0.01" } : {})} value={String(d[f.k] ?? "")} onChange={(e) => set(i, f.k, e.target.value)} required={f.k !== "event" && f.k !== "icon"} />
              </Field>
            ))}
          </div>
          {spec.fields.filter((f) => f.type === "area").map((f) => (
            <Field key={f.k} label={f.label}><textarea rows={kind === "faqs" ? 4 : 3} value={String(d[f.k] ?? "")} onChange={(e) => set(i, f.k, e.target.value)} required /></Field>
          ))}
          {spec.fields.filter((f) => f.type === "check").map((f) => (
            <label key={f.k} className="a-check"><input type="checkbox" checked={!!d[f.k]} onChange={(e) => set(i, f.k, e.target.checked)} /> {f.label}</label>
          ))}
        </section>
      ))}
      {items.length < spec.max && <button type="button" className="a-btn a-btn-ghost" onClick={() => setItems([...items, spec.blank()])}>+ Add {spec.noun}</button>}
      <SaveBar state={state}><ResetButton section={kind} custom={custom} /></SaveBar>
    </form>
  );
}

// ── Contact details & deposit ──────────────────────────────────────────────
export function SiteEditor({ site, depositPct, siteDefault = DEFAULT_SITE }: { site: SiteInfo; depositPct: number; siteDefault?: SiteInfo }) {
  const router = useRouter();
  const [s, setS] = useState(site);
  const [pct, setPct] = useState(String(depositPct));
  const { state, run } = useSave();
  const custom = JSON.stringify(site) !== JSON.stringify(siteDefault) || depositPct !== DEFAULT_DEPOSIT_PCT;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await run(async () => {
      const a = await saveData("site", s);
      return a.ok ? saveData("depositPct", pct) : a;
    });
    if (ok) router.refresh();
  }
  const f = (k: keyof SiteInfo) => ({ value: s[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setS({ ...s, [k]: e.target.value }) });

  return (
    <form onSubmit={submit} className="a-form">
      <section className="a-card">
        <h2>Business</h2>
        <div className="a-cols">
          <Field label="Business name (header, footer, page titles)"><input {...f("name")} required maxLength={60} /></Field>
          <Field label="Area served"><input {...f("area")} maxLength={80} /></Field>
        </div>
        <Field label="Tagline (footer)"><input {...f("tagline")} maxLength={200} /></Field>
        <div className="a-cols">
          <Field label="Contact email (shown on the site)"><input type="email" {...f("email")} required /></Field>
          <Field label="Phone (leave empty to hide)"><input type="tel" {...f("phone")} maxLength={40} /></Field>
        </div>
        <p className="a-muted a-small">Booking and contact-form notifications go to the address set as <code>LEADS_TO_EMAIL</code> in Vercel, not this one.</p>
      </section>
      <section className="a-card">
        <h2>Deposit</h2>
        <Field label="Deposit charged at booking (% of the total)"><input type="number" min="1" max="100" step="1" value={pct} onChange={(e) => setPct(e.target.value)} required /></Field>
      </section>
      <SaveBar state={state}><ResetButton section={["site", "depositPct"]} custom={custom} /></SaveBar>
    </form>
  );
}
