import Image from "next/image";
import { LazyVideo } from "@/components/LazyVideo";
import { media, video } from "@/lib/media";

const FEATURES = [
  ["🚶", "It comes to your guests", "The robot glides through the room, so nobody waits in line at a booth. The photo booth finds them."],
  ["👆", "Touch to start", "A big, bright touchscreen. Guests tap, strike a pose and the robot takes the shot."],
  ["🎨", "AI photo styles", "Turn a snapshot into artwork, a magazine cover or a themed portrait in seconds."],
  ["📲", "Instant prints & sharing", "Prints on the spot, plus every photo sent straight to phones by text, email or QR."],
] as const;

const clip = (base: string, label: string, className = "tall") => {
  const v = video(base);
  return (
    <figure className={`tile ${className}`}>
      <LazyVideo src={v.src.url} poster={v.poster.url} label={label} />
      <figcaption>{label}</figcaption>
    </figure>
  );
};

const photo = (key: string, alt: string, className = "tall") => {
  const m = media(key);
  return (
    <figure className={`tile ${className}`}>
      <Image src={m.url} alt={alt} fill sizes="(max-width:760px) 50vw, 25vw" />
      <figcaption>{alt}</figcaption>
    </figure>
  );
};

export function RobotIntro() {
  return (
    <section id="robot" className="robot-intro">
      <div className="wrap">
        <p className="eyebrow">Meet the robot</p>
        <h2>A photo booth that walks up to <span className="accent">you</span>.</h2>
        <p className="lead muted">Our AI robot photographer works the room for you: it greets guests, snaps the photo, styles it and hands over a print. Your logo or names on its screen all night.</p>

        <div className="bento">
          {clip("robot/comes-to-you", "Working the room at a wedding")}
          <div className="tile feature"><span>{FEATURES[0][0]}</span><h3>{FEATURES[0][1]}</h3><p>{FEATURES[0][2]}</p></div>
          {photo("robot/studio.jpg", "Your photos on its screen")}
          {clip("robot/crowd", "Guests lining up for a turn")}
          <div className="tile feature"><span>{FEATURES[1][0]}</span><h3>{FEATURES[1][1]}</h3><p>{FEATURES[1][2]}</p></div>
          {clip("robot/guests", "Kids love it too")}
          {photo("robot/standing.jpg", "Branded with your logo")}
          <div className="tile feature"><span>{FEATURES[2][0]}</span><h3>{FEATURES[2][1]}</h3><p>{FEATURES[2][2]}</p></div>
          {clip("robot/branded", "Custom welcome screen")}
          <div className="tile feature"><span>{FEATURES[3][0]}</span><h3>{FEATURES[3][1]}</h3><p>{FEATURES[3][2]}</p></div>
        </div>
      </div>
    </section>
  );
}
