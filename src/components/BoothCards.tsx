import Image from "next/image";
import Link from "next/link";
import { money, type BoothSlug } from "@/lib/config";
import { getSite } from "@/lib/content";

const COVER: Record<BoothSlug, string> = {
  takeapic: "robot/studio.jpg",
  "magic-mirror": "booths/mirror.jpg",
  "magazine-photo-booth": "vogue/cover-06.jpg",
  "360-photo-booth": "360/photo-01.jpg",
};

export async function BoothCards() {
  const { t, cat, media } = await getSite();
  return (
    <div className="booths">
      {cat.booths.map((b) => {
        const img = media(COVER[b.slug]);
        return (
          <Link key={b.slug} href={`/${b.slug}`} className="booth-card">
            <div className="booth-img"><Image src={img.url} alt="" fill sizes="(max-width:760px) 100vw, 25vw" /></div>
            <div className="booth-body">
              <h3>{b.name}</h3>
              <p className="muted">{b.short}</p>
              <p className="booth-from">{t("cards.from")} <strong>{money(cat.fromPrice(b))}</strong></p>
              <span className="booth-more">{t("cards.more")}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
