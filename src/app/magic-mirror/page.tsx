import type { Metadata } from "next";
import Image from "next/image";
import { BoothHero, FeatureGrid } from "@/components/BoothHero";
import { BoothPricing } from "@/components/BoothPricing";
import { LazyVideo } from "@/components/LazyVideo";
import { media, video } from "@/lib/media";

export const metadata: Metadata = {
  title: "Magic Mirror Photo Booth Rental",
  description: "Rent a Magic Mirror photo booth in New York: a full-length interactive mirror with animations, voice prompts, instant prints and sharing. Packages by print option.",
  alternates: { canonical: "/magic-mirror" },
};

const FEATURES = [
  ["🪞", "Full-length touch mirror", "A floor-to-ceiling mirror that doubles as a giant touchscreen. Guests see themselves exactly as the photo will look."],
  ["🗣️", "Animations & voice prompts", "The mirror greets guests, counts them down and cheers them on with playful animations."],
  ["✍️", "Sign your photo", "Guests add a signature, emoji or doodle right on the mirror before it prints."],
  ["🖨️", "Prints in seconds", "Lab-quality 2x6 strips or 4x6 prints, ready before guests leave the booth."],
  ["🎩", "Props & backdrops", "A standard prop kit comes with every package. Upgrade the props or backdrop to match your theme."],
  ["📲", "Instant sharing", "Photos go straight to phones by text, email or QR code, ready to post."],
] as const;

const PHOTOS = ["11", "12", "16", "17", "18", "19", "20", "29", "33", "54", "57", "62"].map((n) => media(`gallery/event-${n}.jpg`));

export default function MagicMirrorPage() {
  const mirror = video("booths/mirror");
  return (
    <>
      <BoothHero
        slug="magic-mirror"
        eyebrow="Magic Mirror"
        title={<>The mirror that <span className="accent">talks back</span>.</>}
        lead="A full-length interactive mirror booth with animations, voice prompts and instant prints. Guests strike a pose, sign their photo and walk away with a keepsake."
      >
        <div className="hero-video"><LazyVideo src={mirror.src.url} poster={mirror.poster.url} label="The Magic Mirror booth in action" /></div>
      </BoothHero>

      <section>
        <div className="wrap">
          <h2 className="center">How the Magic Mirror works</h2>
          <FeatureGrid items={FEATURES} />
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2 className="center">Mirror moments</h2>
          <p className="center muted">Real guests at real events.</p>
          <div className="masonry">
            {PHOTOS.map((m, i) => (
              <figure key={m.url} className="masonry-item">
                <Image src={m.url} alt={`Guests posing at the Magic Mirror booth, photo ${i + 1}`} width={m.w} height={m.h} sizes="(max-width:760px) 50vw, 33vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <BoothPricing slug="magic-mirror" />
    </>
  );
}
