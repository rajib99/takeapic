import Link from "next/link";
import { ADDONS, boothBySlug, depositOf, money, type BoothSlug } from "@/lib/config";

export function BoothPricing({ slug, id = "pricing" }: { slug: BoothSlug; id?: string }) {
  const booth = boothBySlug(slug);
  return (
    <section id={id} className="pricing">
      <div className="wrap">
        <p className="eyebrow center">Pricing</p>
        <h2 className="center">{booth.name} packages</h2>
        <p className="center muted">{booth.pricingModel} Extra hours ${booth.extraHour}/hr.</p>
        <div className="grid3">
          {booth.tiers.map((t) => (
            <article key={t.id} className={`card pkg ${t.featured ? "featured" : ""}`}>
              {t.featured && <span className="badge">Most popular</span>}
              <h3>{t.name}</h3>
              <p className="muted">{t.blurb}</p>
              <p className="price">{money(t.price)}</p>
              <p className="muted small">{money(depositOf(t.price))} deposit holds your date</p>
              <ul>{t.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <Link className="btn" href={`/book?package=${booth.slug}:${t.id}`}>Book {t.name}</Link>
            </article>
          ))}
        </div>

        <h3 className="addons-title">Add-ons</h3>
        <p className="muted center">Pick any of these when you book. They work with every package.</p>
        <div className="addons">
          {ADDONS.map((a) => (
            <div key={a.id} className="addon">
              <span className="addon-icon" aria-hidden>{a.icon}</span>
              <div>
                <h4>{a.name} <span className="addon-price">{a.quoted ? `from $${a.price}` : `+$${a.price}`}</span></h4>
                <p>{a.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
