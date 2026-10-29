import type { Metadata } from "next";
import { BoothCards } from "@/components/BoothCards";
import { BoothPricing } from "@/components/BoothPricing";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/config";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { title: t("packages.seo.title"), description: t("packages.seo.description"), alternates: { canonical: "/packages" } };
}

export default async function Packages() {
  const { t, cat, site } = await getSite();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": cat.packages.map((p) => ({
            "@type": "Product",
            name: p.name,
            description: p.tier.blurb,
            brand: site.name,
            offers: { "@type": "Offer", priceCurrency: "USD", price: p.price, url: `${SITE_URL}/book?package=${p.id}`, availability: "https://schema.org/InStock" },
          })),
        }}
      />
      <section>
        <div className="wrap">
          <h1 className="center">{t("packages.title")}</h1>
          <p className="center muted">{t("packages.lead")}</p>
          <BoothCards />
        </div>
      </section>
      {cat.booths.map((b) => <BoothPricing key={b.slug} slug={b.slug} id={b.slug} />)}
    </>
  );
}
