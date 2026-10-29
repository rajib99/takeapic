import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { getSite } from "@/lib/content";
import { TEXT } from "@/lib/text";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { title: t("book.seo.title"), description: t("book.seo.description"), alternates: { canonical: "/book" } };
}

export default async function Book({ searchParams }: { searchParams: Promise<{ package?: string }> }) {
  const { package: pkg = "" } = await searchParams;
  const { t, data } = await getSite();
  // The form is a client component, so hand it just the copy it shows.
  const labels = Object.fromEntries(Object.keys(TEXT).filter((k) => k.startsWith("book.") && !k.startsWith("book.seo") && !k.startsWith("book.ok")).map((k) => [k, t(k)]));
  return (
    <section>
      <div className="wrap">
        <h1>{t("book.title")}</h1>
        <BookingForm initial={pkg} data={data} labels={labels} />
      </div>
    </section>
  );
}
