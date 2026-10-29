import Link from "next/link";
import { getSite } from "@/lib/content";
import { money, type BoothSlug } from "@/lib/config";

export async function BoothPricing({ slug, id = "pricing" }: { slug: BoothSlug; id?: string }) {
  const { t, cat } = await getSite();
  const booth = cat.boothBySlug(slug);
  return (
    <section id={id} className="pricing">
      <div className="wrap">
        <p className="eyebrow center">{t("pricing.eyebrow")}</p>
        <h2 className="center">{t("pricing.title", { name: booth.name })}</h2>
        <p className="center muted">{booth.pricingModel} {t("pricing.extra", { price: money(booth.extraHour) })}</p>
        <div className="grid3">
          {booth.tiers.map((tier) => (
            <article key={tier.id} className={`card pkg ${tier.featured ? "featured" : ""}`}>
              {tier.featured && <span className="badge">{t("pricing.popular")}</span>}
              <h3>{tier.name}</h3>
              <p className="muted">{tier.blurb}</p>
              <p className="price">{money(tier.price)}</p>
              <p className="muted small">{t("pricing.deposit", { amount: money(cat.depositOf(tier.price)) })}</p>
              <ul>{tier.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <Link className="btn" href={`/book?package=${booth.slug}:${tier.id}`}>{t("pricing.book", { tier: tier.name })}</Link>
            </article>
          ))}
        </div>

        <h3 className="addons-title">{t("pricing.addons")}</h3>
        <p className="muted center">{t("pricing.addonsLead")}</p>
        <div className="addons">
          {cat.addons.map((a) => (
            <div key={a.id} className="addon">
              <span className="addon-icon" aria-hidden>{a.icon}</span>
              <div>
                <h4>{a.name} <span className="addon-price">{a.quoted ? `${t("pricing.from")} $${a.price}` : `+$${a.price}`}</span></h4>
                <p>{a.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
