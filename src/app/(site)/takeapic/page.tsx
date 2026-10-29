import type { Metadata } from "next";
import { BoothHero } from "@/components/BoothHero";
import { BoothPricing } from "@/components/BoothPricing";
import { HeroVideo } from "@/components/HeroVideo";
import { RobotIntro } from "@/components/RobotIntro";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { title: t("takeapic.seo.title"), description: t("takeapic.seo.description"), alternates: { canonical: "/takeapic" } };
}

export default async function TakeapicPage() {
  const { t, r, video } = await getSite();
  const hero = video("hero/robot-feature");
  return (
    <>
      <BoothHero slug="takeapic" eyebrow={t("takeapic.eyebrow")} title={r("takeapic.title")} lead={t("takeapic.lead")}>
        <HeroVideo src={hero.src.url} poster={hero.poster.url} />
      </BoothHero>
      <RobotIntro />
      <BoothPricing slug="takeapic" />
    </>
  );
}
