import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { media } from "@/lib/media";

const links = [
  ["/packages", "Packages"],
  ["/how-it-works", "How it works"],
  ["/gallery", "Gallery"],
  ["/faq", "FAQ"],
  ["/contact", "Contact"],
];

export function Header() {
  return (
    <header className="header">
      <div className="wrap header-in">
        <Link href="/" className="logo"><Image src={media("logo-v2.png").url} alt={`${SITE.name} logo`} width={48} height={48} priority />{SITE.name}</Link>
        <nav aria-label="Main">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <Link href="/book" className="btn btn-sm">Book now</Link>
      </div>
    </header>
  );
}
