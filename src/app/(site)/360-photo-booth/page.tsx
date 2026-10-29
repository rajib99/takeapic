import type { Metadata } from "next";
import Image from "next/image";
import { BoothHero, FeatureGrid } from "@/components/BoothHero";
import { BoothPricing } from "@/components/BoothPricing";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { title: t("t360.seo.title"), description: t("t360.seo.description"), alternates: { canonical: "/360-photo-booth" } };
}

const ICONS = ["🔄", "🎬", "🚁", "💡", "📲", "👯"];

export default async function ThreeSixtyPage() {
  const { t, r, media, keysIn } = await getSite();
  const hero = media("360/hero.jpg");
  // The photos are placeholders until the client sends real ones; the admin can replace or add them.
  const photos = keysIn("360").filter((k) => k.startsWith("360/photo-")).map(media);
  const features = ICONS.map((icon, i) => [icon, t(`t360.f${i + 1}.title`), t(`t360.f${i + 1}.text`)] as const);
  return (
    <>
      <BoothHero slug="360-photo-booth" eyebrow={t("t360.eyebrow")} title={r("t360.title")} lead={t("t360.lead")}>
        <div className="hero-video"><Image src={hero.url} alt="360 photo booth" fill sizes="360px" priority /></div>
      </BoothHero>

      <section>
        <div className="wrap">
          <h2 className="center">{t("t360.features")}</h2>
          <FeatureGrid items={features} />
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2 className="center">{t("t360.highlights")}</h2>
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
