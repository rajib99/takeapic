import type { Metadata } from "next";
import Link from "next/link";
import { EventGallery } from "@/components/EventGallery";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { title: t("gallery.seo.title"), description: t("gallery.seo.description"), alternates: { canonical: "/gallery" } };
}

export default async function GalleryPage() {
  const { t, mediaIn } = await getSite();
  return (
    <section>
      <div className="wrap">
        <h1>{t("gallery.title")}</h1>
        <p className="lead muted">{t("gallery.lead")}</p>
        <EventGallery photos={mediaIn("gallery")} />
        <p className="center" style={{ marginTop: 40 }}><Link className="btn" href="/book">{t("gallery.cta")}</Link></p>
      </div>
    </section>
  );
}
