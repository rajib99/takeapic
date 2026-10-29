import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/config";
import { getSite } from "@/lib/content";

// Public pages: header + footer + business structured data. The admin has its own layout.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { t, data, site } = await getSite();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: site.name,
          url: SITE_URL,
          description: t("site.seo.business"),
          email: site.email,
          ...(site.phone && { telephone: site.phone }),
          areaServed: site.area,
          priceRange: "$$",
          makesOffer: data.booths.map((b) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: b.name, description: b.short } })),
        }}
      />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
