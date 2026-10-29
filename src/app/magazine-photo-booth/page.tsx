import type { Metadata } from "next";
import { BoothPricing } from "@/components/BoothPricing";
import { VogueBooth } from "@/components/VogueBooth";

export const metadata: Metadata = {
  title: "Magazine Photo Booth Rental",
  description: "Rent a life-size magazine cover photo booth in New York. Back-lit cover frame, custom headlines, red carpet and front and backside shots. Flat event packages.",
  alternates: { canonical: "/magazine-photo-booth" },
};

export default function MagazinePage() {
  return (
    <>
      <VogueBooth pricingHref="#pricing" headingAs="h1" />
      <BoothPricing slug="magazine-photo-booth" />
    </>
  );
}
