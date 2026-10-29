"use client";
import { useState } from "react";
import { catalog, EVENT_TYPES, money, type CatalogData } from "@/lib/config";

export function BookingForm({ initial, data, labels: L }: { initial: string; data: CatalogData; labels: Record<string, string> }) {
  const cat = catalog(data);
  const [pkgId, setPkgId] = useState(() => (cat.packages.some((p) => p.id === initial) ? initial : (cat.packages.find((p) => p.tier.featured) ?? cat.packages[0]).id));
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const q = cat.quote(pkgId, addOnIds)!;
  const toggleAddOn = (id: string) => setAddOnIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const travel = cat.addons.find((a) => a.quoted);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, packageId: pkgId, addOns: addOnIds }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error || "Something went wrong.");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={submit} className="form card">
      <fieldset>
        <legend>{L["book.l1"]}</legend>
        <label>{L["book.package"]}
          <select value={pkgId} onChange={(e) => setPkgId(e.target.value)}>
            {cat.booths.map((b) => (
              <optgroup key={b.slug} label={b.name}>
                {b.tiers.map((t) => <option key={t.id} value={`${b.slug}:${t.id}`}>{t.name} ({t.hours} hrs): {money(t.price)}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <p className="muted small">{q.pkg.tier.features.join(" · ")}</p>
      </fieldset>
      <fieldset>
        <legend>{L["book.l2"]} <span className="muted small">{L["book.optional"]}</span></legend>
        <div className="radios">
          {cat.addons.filter((a) => !a.quoted).map((a) => (
            <label key={a.id} className={addOnIds.includes(a.id) ? "on" : ""}>
              <input type="checkbox" checked={addOnIds.includes(a.id)} onChange={() => toggleAddOn(a.id)} />
              {a.icon} {a.name} <span>+${a.price}</span>
            </label>
          ))}
        </div>
        {travel && <p className="muted small">{travel.name}: {travel.blurb}</p>}
      </fieldset>
      <fieldset>
        <legend>{L["book.l3"]}</legend>
        <label>{L["book.date"]}<input type="date" name="date" min={today} required /></label>
        <label>{L["book.type"]}
          <select name="eventType" required defaultValue="">
            <option value="" disabled>{L["book.select"]}</option>
            {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>{L["book.venue"]}<input name="venue" autoComplete="off" /></label>
        <label>{L["book.guests"]}<input name="guests" inputMode="numeric" /></label>
      </fieldset>
      <fieldset>
        <legend>{L["book.l4"]}</legend>
        <label>{L["book.name"]}<input name="name" autoComplete="name" required /></label>
        <label>{L["book.email"]}<input type="email" name="email" autoComplete="email" required /></label>
        <label>{L["book.phone"]}<input type="tel" name="phone" autoComplete="tel" /></label>
        <label>{L["book.notes"]}<textarea name="notes" rows={3} maxLength={450} /></label>
      </fieldset>
      {error && <p className="error" role="alert">{error}</p>}
      <p className="total">{L["book.total"]} <strong>{money(q.total)}</strong> <span className="muted small">{L["book.depositToday"].replace("{pct}", String(data.depositPct))} {money(q.deposit)}</span></p>
      <button className="btn" disabled={busy}>{busy ? L["book.redirecting"] : L["book.pay"].replace("{amount}", money(q.deposit))}</button>
      <p className="muted small">{L["book.secure"]}</p>
    </form>
  );
}
