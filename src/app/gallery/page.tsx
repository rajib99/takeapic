import type { Metadata } from "next";
import Link from "next/link";
import { EventGallery } from "@/components/EventGallery";
import { mediaIn } from "@/lib/media";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Real photos from Take a pic photo booth events: weddings, birthdays, corporate parties and brand activations in New York.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <section>
      <div className="wrap">
        <h1>Gallery</h1>
        <p className="lead muted">Real guests, real events. Here's what a night with Take a pic looks like.</p>
        <EventGallery photos={mediaIn("gallery")} />
        <p className="center" style={{ marginTop: 40 }}><Link className="btn" href="/book">Book your date</Link></p>
      </div>
    </section>
  );
}
