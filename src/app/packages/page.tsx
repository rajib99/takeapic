import type { Metadata } from "next";
import { PackageCards } from "@/components/PackageCards";
import { JsonLd } from "@/components/JsonLd";
import { PACKAGES, SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Photo Booth Packages & Pricing",
  description: "Compare Basic, Premium and Lux photo booth packages: mirror booth, red carpet, 360 camera, backdrops, AI robot photographer and drone.",
  alternates: { canonical: "/packages" },
};

export default function Packages() {
  return (
    <section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": PACKAGES.map((p) => ({
            "@type": "Product",
            name: `${p.name} photo booth package`,
            description: p.tagline,
            brand: SITE.name,
            offers: { "@type": "Offer", priceCurrency: "USD", price: p.price, url: `${SITE.url}/book?package=${p.id}`, availability: "https://schema.org/InStock" },
          })),
        }}
      />
      <div className="wrap">
        <h1 className="center">Packages</h1>
        <p className="center muted">Every package includes setup, takedown and instant photo sharing.</p>
        <PackageCards />
      </div>
    </section>
  );
}
