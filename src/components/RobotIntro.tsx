import Image from "next/image";
import { LazyVideo } from "@/components/LazyVideo";
import { getSite } from "@/lib/content";

const ICONS = ["🚶", "👆", "🎨", "📲"];

export async function RobotIntro() {
  const { t, r, media, video } = await getSite();

  const clip = (base: string, capKey: string, className = "tall") => {
    const v = video(base);
    const label = t(capKey);
    return (
      <figure className={`tile ${className}`}>
        <LazyVideo src={v.src.url} poster={v.poster.url} label={label} />
        <figcaption>{label}</figcaption>
      </figure>
    );
  };
  const photo = (key: string, capKey: string, className = "tall") => {
    const m = media(key);
    const alt = t(capKey);
    return (
      <figure className={`tile ${className}`}>
        <Image src={m.url} alt={alt} fill sizes="(max-width:760px) 50vw, 25vw" />
        <figcaption>{alt}</figcaption>
      </figure>
    );
  };
  const feature = (n: 1 | 2 | 3 | 4) => (
    <div className="tile feature"><span>{ICONS[n - 1]}</span><h3>{t(`robot.f${n}.title`)}</h3><p>{t(`robot.f${n}.text`)}</p></div>
  );

  return (
    <section id="robot" className="robot-intro">
      <div className="wrap">
        <p className="eyebrow">{t("robot.eyebrow")}</p>
        <h2>{r("robot.title")}</h2>
        <p className="lead muted">{t("robot.lead")}</p>

        <div className="bento">
          {clip("robot/comes-to-you", "robot.cap.comes")}
          {feature(1)}
          {photo("robot/studio.jpg", "robot.cap.studio")}
          {clip("robot/crowd", "robot.cap.crowd")}
          {feature(2)}
          {clip("robot/guests", "robot.cap.guests")}
          {photo("robot/standing.jpg", "robot.cap.standing")}
          {feature(3)}
          {clip("robot/branded", "robot.cap.branded")}
          {feature(4)}
        </div>
      </div>
    </section>
  );
}
