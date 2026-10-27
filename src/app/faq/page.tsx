import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { FAQS } from "@/lib/config";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about our robot photo booth rentals: pricing, booking, deposits, events and how the drone-assisted 360 camera works.",
  alternates: { canonical: "/faq" },
};

export default function Faq() {
  return (
    <section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <div className="wrap" style={{ maxWidth: 760 }}>
        <h1>Frequently asked questions</h1>
        {FAQS.map((f) => (
          <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
        ))}
      </div>
    </section>
  );
}
