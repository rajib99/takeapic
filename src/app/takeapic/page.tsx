import type { Metadata } from "next";
import { BoothHero } from "@/components/BoothHero";
import { BoothPricing } from "@/components/BoothPricing";
import { HeroVideo } from "@/components/HeroVideo";
import { RobotIntro } from "@/components/RobotIntro";
import { video } from "@/lib/media";

export const metadata: Metadata = {
  title: "Takeapic AI Robot Photographer",
  description: "Rent the Takeapic AI robot photographer in New York. It roams your event, takes the photo, applies AI styles and prints on the spot. Hourly packages.",
  alternates: { canonical: "/takeapic" },
};

export default function TakeapicPage() {
  const hero = video("hero/robot-feature");
  return (
    <>
      <BoothHero
        slug="takeapic"
        eyebrow="Takeapic AI Robot"
        title={<>The photographer is a <span className="accent">robot</span>.</>}
        lead="Instead of guests lining up at a booth, the booth goes to them. Takeapic rolls through your event, invites guests to tap its screen, snaps the shot, styles it with AI and prints it on the spot."
      >
        <HeroVideo src={hero.src.url} poster={hero.poster.url} />
      </BoothHero>
      <RobotIntro />
      <BoothPricing slug="takeapic" />
    </>
  );
}
