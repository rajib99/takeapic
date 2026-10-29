import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getSite } from "@/lib/content";
import { SITE_URL } from "@/lib/config";

export const viewport: Viewport = { themeColor: "#0f0f1a" };

export async function generateMetadata(): Promise<Metadata> {
  const { t, site } = await getSite();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("site.seo.title"), template: `%s | ${site.name}` },
    description: t("site.seo.description"),
    alternates: { canonical: "/" },
    openGraph: { type: "website", siteName: site.name, url: SITE_URL, title: t("site.seo.title"), description: site.tagline },
    twitter: { card: "summary_large_image" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
