import Link from "next/link";
import { BoothCards } from "@/components/BoothCards";
import { EventGallery, HIGHLIGHTS } from "@/components/EventGallery";
import { HeroVideo } from "@/components/HeroVideo";
import { RobotIntro } from "@/components/RobotIntro";
import { VogueBooth } from "@/components/VogueBooth";
import { getSite } from "@/lib/content";

export default async function Home() {
  const { t, r, video, media, visible, data } = await getSite();
  const hero = video("hero/robot-feature");
  return (
    <>
      <div className="wrap hero">
        <div>
          <h1>{r("home.hero.title")}</h1>
          <p className="lead">{t("home.hero.lead")}</p>
          <div className="actions">
            <Link className="btn" href="/book">{t("home.hero.cta")}</Link>
            <a className="btn btn-ghost" href="#booths">{t("home.hero.cta2")}</a>
          </div>
        </div>
        <div className="hero-art"><HeroVideo src={hero.src.url} poster={hero.poster.url} /></div>
      </div>

      <RobotIntro />

      <section>
        <div className="wrap">
          <h2 className="center">{t("home.features.title")}</h2>
          <div className="grid3">
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="card"><h3>{t(`home.features.${n}.title`)}</h3><p className="muted">{t(`home.features.${n}.text`)}</p></div>
            ))}
          </div>
        </div>
      </section>

      <VogueBooth />

      <section id="booths">
        <div className="wrap">
          <h2 className="center">{t("home.booths.title")}</h2>
          <p className="center muted">{t("home.booths.lead")}</p>
          <BoothCards />
        </div>
      </section>

      {data.testimonials.length > 0 && (
        <section id="testimonials" className="testimonials">
          <div className="wrap">
            <p className="eyebrow center">{t("home.reviews.eyebrow")}</p>
            <h2 className="center">{t("home.reviews.title")}</h2>
            <div className="grid3">
              {data.testimonials.map((x) => (
                <blockquote key={x.quote} className="card quote">
                  <p className="stars" aria-label="5 out of 5 stars">★★★★★</p>
                  <p>“{x.quote}”</p>
                  <footer><strong>{x.name}</strong><span>{x.event}</span></footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="wrap">
          <h2 className="center">{t("home.moments.title")}</h2>
          <p className="center muted">{t("home.moments.lead")}</p>
          <EventGallery photos={HIGHLIGHTS.filter(visible).map(media)} />
          <p className="center" style={{ marginTop: 32 }}><Link className="btn btn-ghost" href="/gallery">{t("home.moments.cta")}</Link></p>
        </div>
      </section>

      <section>
        <div className="wrap cta">
          <h2>{t("home.cta.title")}</h2>
          <p>{t("home.cta.text")}</p>
          <Link className="btn" href="/book">{t("home.cta.button")}</Link>
        </div>
      </section>
    </>
  );
}
