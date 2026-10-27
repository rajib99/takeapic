"use client";
import { useState } from "react";
import { EVENT_TYPES, PACKAGES, depositFor } from "@/lib/config";

export function BookingForm({ initial }: { initial: string }) {
  const [pkgId, setPkgId] = useState(PACKAGES.some((p) => p.id === initial) ? initial : "premium");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pkg = PACKAGES.find((p) => p.id === pkgId)!;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, packageId: pkgId }),
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
        <legend>1. Choose your package</legend>
        <div className="radios">
          {PACKAGES.map((p) => (
            <label key={p.id} className={p.id === pkgId ? "on" : ""}>
              <input type="radio" name="pkg" checked={p.id === pkgId} onChange={() => setPkgId(p.id)} />
              <strong>{p.name}</strong> <span>${p.price.toLocaleString()}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>2. Your event</legend>
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
        <legend>3. Your details</legend>
        <label>Full name<input name="name" autoComplete="name" required /></label>
        <label>Email<input type="email" name="email" autoComplete="email" required /></label>
        <label>Phone<input type="tel" name="phone" autoComplete="tel" /></label>
        <label>Anything else we should know?<textarea name="notes" rows={3} maxLength={450} /></label>
      </fieldset>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? "Redirecting to Stripe…" : `Pay $${depositFor(pkg).toLocaleString()} deposit`}</button>
      <p className="muted small">Secure payment by Stripe. The remaining balance is due before your event.</p>
    </form>
  );
}
