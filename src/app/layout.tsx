import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/config";

export const viewport: Viewport = { themeColor: "#0f0f1a" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Take a pic | Robot Photo Booth Rental in New York", template: "%s | Take a pic" },
  description:
    "Photo booth rental with an AI robot photographer and a 360° drone camera. Weddings, corporate events and parties in New York. Book online in minutes.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, url: SITE.url, title: "Take a pic | Robot Photo Booth Rental", description: SITE.tagline },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: SITE.name,
            url: SITE.url,
            description: "Photo booth rental featuring an AI robot photographer and drone-supported 360° camera.",
            email: SITE.email,
            ...(SITE.phone && { telephone: SITE.phone }),
            areaServed: SITE.area,
            priceRange: "$$",
            makesOffer: ["Basic", "Premium", "Lux"].map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: `${n} photo booth package` } })),
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
