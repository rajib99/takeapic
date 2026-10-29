import Link from "next/link";
import { boothBySlug, fromPrice, money, type BoothSlug } from "@/lib/config";

// Top of each booth page: copy + CTAs on the left, media on the right.
export function BoothHero({ slug, eyebrow, title, lead, children }: { slug: BoothSlug; eyebrow: string; title: React.ReactNode; lead: string; children: React.ReactNode }) {
  const booth = boothBySlug(slug);
  const featured = booth.tiers.find((t) => t.featured) ?? booth.tiers[0];
  return (
    <div className="wrap hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        <p className="muted">Packages from <strong className="accent">{money(fromPrice(booth))}</strong></p>
        <div className="actions">
          <Link className="btn" href={`/book?package=${booth.slug}:${featured.id}`}>Book now</Link>
          <a className="btn btn-ghost" href="#pricing">See pricing</a>
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
