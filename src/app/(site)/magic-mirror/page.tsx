import type { Metadata } from "next";
import Image from "next/image";
import { BoothHero, FeatureGrid } from "@/components/BoothHero";
import { BoothPricing } from "@/components/BoothPricing";
import { LazyVideo } from "@/components/LazyVideo";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { title: t("mirror.seo.title"), description: t("mirror.seo.description"), alternates: { canonical: "/magic-mirror" } };
}

const ICONS = ["🪞", "🗣️", "✍️", "🖨️", "🎩", "📲"];
const PHOTOS = ["11", "12", "16", "17", "18", "19", "20", "29", "33", "54", "57", "62"].map((n) => `gallery/event-${n}.jpg`);

export default async function MagicMirrorPage() {
  const { t, r, video, media, visible } = await getSite();
  const mirror = video("booths/mirror");
  const features = ICONS.map((icon, i) => [icon, t(`mirror.f${i + 1}.title`), t(`mirror.f${i + 1}.text`)] as const);
  return (
    <>
      <BoothHero slug="magic-mirror" eyebrow={t("mirror.eyebrow")} title={r("mirror.title")} lead={t("mirror.lead")}>
        <div className="hero-video"><LazyVideo src={mirror.src.url} poster={mirror.poster.url} label="The Magic Mirror booth in action" /></div>
      </BoothHero>

      <section>
        <div className="wrap">
          <h2 className="center">{t("mirror.features")}</h2>
          <FeatureGrid items={features} />
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2 className="center">{t("mirror.moments")}</h2>
          <p className="center muted">{t("mirror.momentsLead")}</p>
          <div className="masonry">
            {PHOTOS.filter(visible).map(media).map((m, i) => (
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
