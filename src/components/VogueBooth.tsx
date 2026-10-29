import Image from "next/image";
import Link from "next/link";
import { LazyVideo } from "@/components/LazyVideo";
import { getSite } from "@/lib/content";
import { money } from "@/lib/config";

export async function VogueBooth({ pricingHref = "/magazine-photo-booth", headingAs: H = "h2" }: { pricingHref?: string; headingAs?: "h1" | "h2" }) {
  const { t, cat, video, media, keysIn } = await getSite();
  const booth = cat.boothBySlug("magazine-photo-booth");
  const featured = booth.tiers.find((x) => x.featured) ?? booth.tiers[0];
  const demo = video("vogue/demo");
  const frame = video("vogue/frame");
  const covers = keysIn("vogue").filter((k) => k.startsWith("vogue/cover-")).map(media);

  return (
    <section id="vogue" className="vogue">
      <div className="wrap vogue-grid">
        <div className="vogue-cover">
          <LazyVideo src={demo.src.url} poster={demo.poster.url} label="Guests posing inside the Vogue magazine booth" />
        </div>
        <div>
          <p className="vogue-kicker">{t("vogue.kicker")}</p>
          <H className="vogue-title">{t("vogue.title")}</H>
          <p className="vogue-lead">{t("vogue.lead")}</p>
          <ol className="vogue-points">
            {([1, 2, 3, 4] as const).map((n) => <li key={n}><strong>{t(`vogue.p${n}.title`)}</strong><span>{t(`vogue.p${n}.text`)}</span></li>)}
          </ol>
          <div className="actions">
            <Link className="btn btn-dark" href={`/book?package=${booth.slug}:${featured.id}`}>{t("vogue.cta")}</Link>
            <Link className="vogue-link" href={pricingHref}>{t("vogue.from", { price: money(cat.fromPrice(booth)) })}</Link>
          </div>
        </div>
      </div>

      <div className="wrap">
        <p className="vogue-kicker center">{t("vogue.archive")}</p>
      </div>
      <div className="cover-strip" tabIndex={0} aria-label="Magazine booth photos from past events">
        <figure className="cover">
          <LazyVideo src={frame.src.url} poster={frame.poster.url} label="The magazine booth at an event" />
        </figure>
        {covers.map((m, i) => (
          <figure className="cover" key={m.url}>
            <Image src={m.url} alt={`Magazine booth cover photo ${i + 1}`} fill sizes="260px" />
          </figure>
        ))}
      </div>
    </section>
  );
}
