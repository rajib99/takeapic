import type { Metadata } from "next";
import { BoothPricing } from "@/components/BoothPricing";
import { VogueBooth } from "@/components/VogueBooth";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { title: t("magazine.seo.title"), description: t("magazine.seo.description"), alternates: { canonical: "/magazine-photo-booth" } };
}

export default function MagazinePage() {
  return (
    <>
      <VogueBooth pricingHref="#pricing" headingAs="h1" />
      <BoothPricing slug="magazine-photo-booth" />
    </>
  );
}
