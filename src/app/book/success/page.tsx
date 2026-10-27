import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Booking received", robots: { index: false } };

export default function Success() {
  return (
    <section>
      <div className="wrap center">
        <h1>You're booked! 🎉</h1>
        <p className="muted">Your deposit went through. A Stripe receipt is on its way to your inbox, and we'll follow up shortly to confirm the details.</p>
        <Link className="btn" href="/">Back home</Link>
      </div>
    </section>
  );
}
