import type { Metadata } from "next";
import Image from "next/image";
import { BoothHero, FeatureGrid } from "@/components/BoothHero";
import { BoothPricing } from "@/components/BoothPricing";
import { media, mediaIn } from "@/lib/media";

export const metadata: Metadata = {
  title: "360 Photo Booth Rental",
  description: "Rent a 360 photo booth in New York: slow-motion 360° videos with music, LED lighting, instant sharing and an optional drone for aerial angles. Hourly packages.",
  alternates: { canonical: "/360-photo-booth" },
};

const FEATURES = [
  ["🔄", "Spinning camera arm", "Guests step onto the platform and the camera circles them for a full 360° shot."],
  ["🎬", "Slow-mo with music", "Every spin becomes a slow-motion clip with music and effects, ready in seconds."],
  ["🚁", "Drone-assisted angles", "Our drone sidekick adds sweeping aerial shots for the ultimate highlight video."],
  ["💡", "Music-video lighting", "LED ring lights and stanchions turn the platform into a stage."],
  ["📲", "Instant sharing", "Videos go straight to phones by text, email or QR code, sized for Reels and TikTok."],
  ["👯", "Room for the squad", "The platform fits up to four guests at once for group spins."],
] as const;

export default function ThreeSixtyPage() {
  const hero = media("360/hero.jpg");
  // Placeholder images: replace public/media/360/* with real photos (same file names) and re-run media:upload.
  const photos = mediaIn("360").filter((m) => m.url.includes("/photo-"));
  return (
    <>
      <BoothHero
        slug="360-photo-booth"
        eyebrow="360 Photo Booth"
        title={<>Every guest gets the <span className="accent">slow-mo spin</span>.</>}
        lead="Step on the platform, strike a pose and let the camera circle you. Slow-motion 360° videos with music, ready to share before the next song ends."
      >
        <div className="hero-video"><Image src={hero.url} alt="360 photo booth" fill sizes="360px" priority /></div>
      </BoothHero>

      <section>
        <div className="wrap">
          <h2 className="center">What makes our 360 different</h2>
          <FeatureGrid items={FEATURES} />
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2 className="center">360 highlights</h2>
          <div className="photo-grid">
            {photos.map((m, i) => (
              <figure key={m.url} className="tile">
                <Image src={m.url} alt={`360 photo booth event, photo ${i + 1}`} fill sizes="(max-width:760px) 50vw, 33vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <BoothPricing slug="360-photo-booth" />
    </>
  );
}
