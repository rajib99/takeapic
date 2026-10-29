"use client";
import { useState } from "react";

export function ContactForm({ labels: L }: { labels: Record<string, string> }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    }).catch(() => null);
    setState(res?.ok ? "done" : "error");
  }

  if (state === "done") return <p className="card">{L.thanks}</p>;
  return (
    <form onSubmit={submit} className="form card">
      <label>{L.name}<input name="name" autoComplete="name" required /></label>
      <label>{L.email}<input type="email" name="email" autoComplete="email" required /></label>
      <label>{L.phone}<input type="tel" name="phone" autoComplete="tel" /></label>
      <label>{L.date}<input type="date" name="date" /></label>
      <label>{L.message}<textarea name="message" rows={5} required /></label>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hp" />
      {state === "error" && <p className="error" role="alert">{L.error}</p>}
      <button className="btn" disabled={state === "busy"}>{state === "busy" ? L.sending : L.send}</button>
    </form>
  );
}
