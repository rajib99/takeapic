import Link from "next/link";
import { getSite } from "@/lib/content";
import { money, type BoothSlug } from "@/lib/config";

// Top of each booth page: copy + CTAs on the left, media on the right.
export async function BoothHero({ slug, eyebrow, title, lead, children }: { slug: BoothSlug; eyebrow: string; title: React.ReactNode; lead: string; children: React.ReactNode }) {
  const { t, cat } = await getSite();
  const booth = cat.boothBySlug(slug);
  const featured = booth.tiers.find((x) => x.featured) ?? booth.tiers[0];
  return (
    <div className="wrap hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        <p className="muted">{t("hero.from")} <strong className="accent">{money(cat.fromPrice(booth))}</strong></p>
        <div className="actions">
          <Link className="btn" href={`/book?package=${booth.slug}:${featured.id}`}>{t("hero.book")}</Link>
          <a className="btn btn-ghost" href="#pricing">{t("hero.see")}</a>
        </div>
      </div>
      <div className="hero-art">{children}</div>
    </div>
  );
}

export function FeatureGrid({ items }: { items: readonly (readonly [string, string, string])[] }) {
  return (
    <div className="grid3">
      {items.map(([icon, title, text]) => (
        <div key={title} className="card"><h3>{icon} {title}</h3><p className="muted">{text}</p></div>
      ))}
    </div>
  );
}
