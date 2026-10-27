"use client";
import { useState } from "react";

export function ContactForm() {
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

  if (state === "done") return <p className="card">Thanks! We'll reply within one business day. 🤖</p>;
  return (
    <form onSubmit={submit} className="form card">
      <label>Name<input name="name" autoComplete="name" required /></label>
      <label>Email<input type="email" name="email" autoComplete="email" required /></label>
      <label>Phone<input type="tel" name="phone" autoComplete="tel" /></label>
      <label>Event date<input type="date" name="date" /></label>
      <label>How can we help?<textarea name="message" rows={5} required /></label>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hp" />
      {state === "error" && <p className="error" role="alert">Something went wrong. Please try again.</p>}
      <button className="btn" disabled={state === "busy"}>{state === "busy" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
