import Image from "next/image";
import Link from "next/link";
import { LazyVideo } from "@/components/LazyVideo";
import { mediaIn, video } from "@/lib/media";
import { boothBySlug, fromPrice, money } from "@/lib/config";

const POINTS = [
  ["Life-size lit cover frame", "Step inside a glowing magazine cover, big enough for the whole squad."],
  ["Your headline, your names", "Custom cover lines with the guest of honor, the date and your event's story."],
  ["Red carpet arrival", "Carpet and gold stanchions so every guest gets a celebrity entrance."],
  ["Front & backside shots", "Pose for the cover, then turn around for the behind-the-scenes shot."],
] as const;

export function VogueBooth({ pricingHref = "/magazine-photo-booth", headingAs: H = "h2" }: { pricingHref?: string; headingAs?: "h1" | "h2" }) {
  const booth = boothBySlug("magazine-photo-booth");
  const featured = booth.tiers.find((t) => t.featured)!;
  const demo = video("vogue/demo");
  const frame = video("vogue/frame");
  const covers = mediaIn("vogue").filter((m) => m.url.includes("/cover-"));

  return (
    <section id="vogue" className="vogue">
      <div className="wrap vogue-grid">
        <div className="vogue-cover">
          <LazyVideo src={demo.src.url} poster={demo.poster.url} label="Guests posing inside the Vogue magazine booth" />
        </div>
        <div>
          <p className="vogue-kicker">The Vogue Magazine Booth</p>
          <H className="vogue-title">Be the cover story.</H>
          <p className="vogue-lead">Every guest becomes the face of the issue. A life-size, back-lit magazine cover turns your party into a fashion shoot, and the photos look like they belong on a newsstand.</p>
          <ol className="vogue-points">
            {POINTS.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
          </ol>
          <div className="actions">
            <Link className="btn btn-dark" href={`/book?package=${booth.slug}:${featured.id}`}>Book the magazine booth</Link>
            <Link className="vogue-link" href={pricingHref}>Packages from {money(fromPrice(booth))} →</Link>
          </div>
        </div>
      </div>

      <div className="wrap">
        <p className="vogue-kicker center">From the archive</p>
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
