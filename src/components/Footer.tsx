import Image from "next/image";
import Link from "next/link";
import { getSite } from "@/lib/content";

export async function Footer() {
  const { t, media, site, data } = await getSite();
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div>
          <Image src={media("logo-v2.png").url} alt={`${site.name} logo`} width={72} height={72} />
          <strong>{site.name}</strong>
          <p>{site.tagline} {t("site.footer.serving", { area: site.area })}</p>
          <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
          {site.phone && <p><a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a></p>}
        </div>
        <div className="footer-cols">
          <div className="footer-links">
            <strong>{t("site.footer.booths")}</strong>
            {data.booths.map((b) => <Link key={b.slug} href={`/${b.slug}`}>{b.name}</Link>)}
          </div>
          <div className="footer-links">
            <strong>{t("site.footer.info")}</strong>
            <Link href="/packages">{t("site.footer.pricing")}</Link>
            <Link href="/gallery">{t("site.footer.gallery")}</Link>
            <Link href="/how-it-works">{t("site.footer.how")}</Link>
            <Link href="/faq">{t("site.footer.faq")}</Link>
            <Link href="/contact">{t("site.footer.contact")}</Link>
            <Link href="/book">{t("site.footer.book")}</Link>
          </div>
        </div>
      </div>
      <p className="wrap copy">© {new Date().getFullYear()} {site.name}. {t("site.footer.rights")}</p>
    </footer>
  );
}
