import type { Metadata } from "next";
import { BoothCards } from "@/components/BoothCards";
import { BoothPricing } from "@/components/BoothPricing";
import { JsonLd } from "@/components/JsonLd";
import { BOOTHS, PACKAGES, SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Photo Booth Packages & Pricing",
  description: "Pricing for every Take a pic booth: Takeapic AI robot, Magic Mirror, Magazine Photo Booth and 360 Photo Booth, plus add-ons.",
  alternates: { canonical: "/packages" },
};

export default function Packages() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": PACKAGES.map((p) => ({
            "@type": "Product",
            name: p.name,
            description: p.tier.blurb,
            brand: SITE.name,
            offers: { "@type": "Offer", priceCurrency: "USD", price: p.price, url: `${SITE.url}/book?package=${p.id}`, availability: "https://schema.org/InStock" },
          })),
        }}
      />
      <section>
        <div className="wrap">
          <h1 className="center">Packages & pricing</h1>
          <p className="center muted">Every package includes delivery, setup, takedown and instant photo sharing.</p>
          <BoothCards />
        </div>
      </section>
      {BOOTHS.map((b) => <BoothPricing key={b.slug} slug={b.slug} id={b.slug} />)}
    </>
  );
}
