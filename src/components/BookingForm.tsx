"use client";
import { useState } from "react";
import { ADDONS, BOOTHS, DEPOSIT_PCT, EVENT_TYPES, PACKAGES, money, quote } from "@/lib/config";

export function BookingForm({ initial }: { initial: string }) {
  const [pkgId, setPkgId] = useState(PACKAGES.some((p) => p.id === initial) ? initial : "takeapic:3h");
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const q = quote(pkgId, addOnIds)!;
  const toggleAddOn = (id: string) => setAddOnIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const travel = ADDONS.find((a) => a.quoted);

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
        <legend>1. Choose your booth & package</legend>
        <label>Package
          <select value={pkgId} onChange={(e) => setPkgId(e.target.value)}>
            {BOOTHS.map((b) => (
              <optgroup key={b.slug} label={b.name}>
                {b.tiers.map((t) => <option key={t.id} value={`${b.slug}:${t.id}`}>{t.name} ({t.hours} hrs): {money(t.price)}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <p className="muted small">{q.pkg.tier.features.join(" · ")}</p>
      </fieldset>
      <fieldset>
        <legend>2. Add-ons <span className="muted small">(optional)</span></legend>
        <div className="radios">
          {ADDONS.filter((a) => !a.quoted).map((a) => (
            <label key={a.id} className={addOnIds.includes(a.id) ? "on" : ""}>
              <input type="checkbox" checked={addOnIds.includes(a.id)} onChange={() => toggleAddOn(a.id)} />
              {a.icon} {a.name} <span>+${a.price}</span>
            </label>
          ))}
        </div>
        {travel && <p className="muted small">{travel.name}: {travel.blurb}</p>}
      </fieldset>
      <fieldset>
        <legend>3. Your event</legend>
        <label>Event date<input type="date" name="date" min={today} required /></label>
        <label>Event type
          <select name="eventType" required defaultValue="">
            <option value="" disabled>Select…</option>
            {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>Venue / address<input name="venue" autoComplete="off" /></label>
        <label>Approx. guests<input name="guests" inputMode="numeric" /></label>
      </fieldset>
      <fieldset>
        <legend>4. Your details</legend>
        <label>Full name<input name="name" autoComplete="name" required /></label>
        <label>Email<input type="email" name="email" autoComplete="email" required /></label>
        <label>Phone<input type="tel" name="phone" autoComplete="tel" /></label>
        <label>Anything else we should know?<textarea name="notes" rows={3} maxLength={450} /></label>
      </fieldset>
      {error && <p className="error" role="alert">{error}</p>}
      <p className="total">Total <strong>{money(q.total)}</strong> <span className="muted small">{DEPOSIT_PCT}% deposit today: {money(q.deposit)}</span></p>
      <button className="btn" disabled={busy}>{busy ? "Redirecting to Stripe…" : `Pay ${money(q.deposit)} deposit`}</button>
      <p className="muted small">Secure payment by Stripe. The remaining balance is due before your event.</p>
    </form>
  );
}
