import Link from "next/link";
import { HeroVideo } from "@/components/HeroVideo";
import { RobotIntro } from "@/components/RobotIntro";
import { VogueBooth } from "@/components/VogueBooth";
import { EventGallery, highlightPhotos } from "@/components/EventGallery";
import { BoothCards } from "@/components/BoothCards";
import { TESTIMONIALS } from "@/lib/config";
import { video } from "@/lib/media";

export default function Home() {
  const hero = video("hero/robot-feature");
  return (
    <>
      <div className="wrap hero">
        <div>
          <h1>The photo booth with a <span className="accent">robot photographer</span>.</h1>
          <p className="lead">An AI robot roams your event shooting magazine-worthy photos, while our drone sidekick captures every angle in 360°. Nobody else in New York has one.</p>
          <div className="actions">
            <Link className="btn" href="/book">Book your date</Link>
            <a className="btn btn-ghost" href="#booths">See our booths</a>
          </div>
        </div>
        <div className="hero-art"><HeroVideo src={hero.src.url} poster={hero.poster.url} /></div>
      </div>

      <RobotIntro />

      <section>
        <div className="wrap">
          <h2 className="center">Made for weddings, corporate events & open spaces</h2>
          <div className="grid3">
            <div className="card"><h3>🤖 AI robot photographer</h3><p className="muted">Our robot finds the moment and takes the shot. No lines, no awkward posing, just great candids.</p></div>
            <div className="card"><h3>🚁 Drone-assisted 360°</h3><p className="muted">A drone sidekick supports our 360 camera for sweeping, shareable video your guests will replay.</p></div>
            <div className="card"><h3>📖 Magazine booth</h3><p className="muted">Step onto the red carpet and get a cover-style shot, with a backside view in our magazine booth.</p></div>
          </div>
        </div>
      </section>

      <VogueBooth />

      <section id="booths">
        <div className="wrap">
          <h2 className="center">Choose your experience</h2>
          <p className="center muted">Four booths, each with its own packages and add-ons. Book one, or mix them for the full show.</p>
          <BoothCards />
        </div>
      </section>

      {TESTIMONIALS.length > 0 && (
        <section id="testimonials" className="testimonials">
          <div className="wrap">
            <p className="eyebrow center">Testimonials</p>
            <h2 className="center">Loved by hosts</h2>
            <div className="grid3">
              {TESTIMONIALS.map((t) => (
                <blockquote key={t.quote} className="card quote">
                  <p className="stars" aria-label="5 out of 5 stars">★★★★★</p>
                  <p>“{t.quote}”</p>
                  <footer><strong>{t.name}</strong><span>{t.event}</span></footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="wrap">
          <h2 className="center">Moments from real events</h2>
          <p className="center muted">Weddings, sweet sixteens, galas and brand launches.</p>
          <EventGallery photos={highlightPhotos()} />
          <p className="center" style={{ marginTop: 32 }}><Link className="btn btn-ghost" href="/gallery">See the full gallery</Link></p>
        </div>
      </section>

      <section>
        <div className="wrap cta">
          <h2>Ready to meet the robot?</h2>
          <p>Dates fill up fast. Reserve yours in two minutes.</p>
          <Link className="btn" href="/book">Book now</Link>
        </div>
      </section>
    </>
  );
}
