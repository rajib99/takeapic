import Image from "next/image";
import { LazyVideo } from "@/components/LazyVideo";
import { media, video, type Media } from "@/lib/media";

// Masonry of event photos with the magic-mirror clip mixed in near the top.
export function EventGallery({ photos }: { photos: Media[] }) {
  const mirror = video("booths/mirror");
  const tiles = photos.map((m, i) => (
    <figure key={m.url} className="masonry-item">
      <Image src={m.url} alt={`Guests at a Take a pic photo booth event, photo ${i + 1}`} width={m.w} height={m.h} sizes="(max-width:760px) 50vw, 33vw" />
    </figure>
  ));
  tiles.splice(2, 0, (
    <figure key="mirror" className="masonry-item">
      <LazyVideo src={mirror.src.url} poster={mirror.poster.url} label="Our magic mirror booth in action" />
      <figcaption>Magic mirror booth, in every package</figcaption>
    </figure>
  ));
  return <div className="masonry">{tiles}</div>;
}

export const HIGHLIGHTS = ["05", "07", "11", "12", "16", "26", "30", "34", "44", "47", "49", "71", "78", "80"]
  .map((n) => `gallery/event-${n}.jpg`);
export const highlightPhotos = () => HIGHLIGHTS.map(media);
