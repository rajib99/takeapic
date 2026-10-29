import Image from "next/image";
import Link from "next/link";
import { getSite } from "@/lib/content";

export async function Header() {
  const { t, media, site } = await getSite();
  const links = [
    ["/takeapic", t("site.nav.takeapic")],
    ["/magic-mirror", t("site.nav.mirror")],
    ["/magazine-photo-booth", t("site.nav.magazine")],
    ["/360-photo-booth", t("site.nav.t360")],
  ];
  return (
    <header className="header">
      <div className="wrap header-in">
        <Link href="/" className="logo"><Image src={media("logo-v2.png").url} alt={`${site.name} logo`} width={48} height={48} priority />{site.name}</Link>
        <nav aria-label="Main">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <Link href="/book" className="btn btn-sm">{t("site.nav.book")}</Link>
      </div>
    </header>
  );
}
