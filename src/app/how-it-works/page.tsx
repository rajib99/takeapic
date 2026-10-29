import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Book a photo booth in four steps: choose a booth and package, pay a deposit, we set up, your guests get their photos instantly.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  ["Choose your booth", "Pick the Takeapic robot, Magic Mirror, Magazine or 360 booth, a package and any add-ons."],
  ["Pay a deposit", "Secure checkout through Stripe holds your date instantly."],
  ["We set up", "Our team arrives early with everything you booked, from the robot to the red carpet."],
  ["Guests get their photos", "Photos and 360 videos are shared on the spot and in an online gallery."],
];

export default function How() {
  return (
    <section>
      <div className="wrap">
        <h1 className="center">How it works</h1>
        <div className="grid3 steps">
          {steps.map(([t, d]) => (
            <div key={t} className="card"><h3>{t}</h3><p className="muted">{d}</p></div>
          ))}
        </div>
        <p className="center" style={{ marginTop: 32 }}><Link className="btn" href="/book">Start booking</Link></p>
      </div>
    </section>
  );
}
