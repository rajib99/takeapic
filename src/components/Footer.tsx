import Image from "next/image";
import Link from "next/link";
import { BOOTHS, SITE } from "@/lib/config";
import { media } from "@/lib/media";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div>
          <Image src={media("logo-v2.png").url} alt={`${SITE.name} logo`} width={72} height={72} />
          <strong>{SITE.name}</strong>
          <p>{SITE.tagline} Serving {SITE.area}.</p>
          <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        </div>
        <div className="footer-cols">
          <div className="footer-links">
            <strong>Booths</strong>
            {BOOTHS.map((b) => <Link key={b.slug} href={`/${b.slug}`}>{b.name}</Link>)}
          </div>
          <div className="footer-links">
            <strong>Info</strong>
            <Link href="/packages">All pricing</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/book">Book</Link>
          </div>
        </div>
      </div>
      <p className="wrap copy">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
    </footer>
  );
}
