import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Booking received", robots: { index: false } };

export default async function Success() {
  const { t } = await getSite();
  return (
    <section>
      <div className="wrap center">
        <h1>{t("book.ok.title")}</h1>
        <p className="muted">{t("book.ok.text")}</p>
        <Link className="btn" href="/">{t("book.ok.button")}</Link>
      </div>
    </section>
  );
}
