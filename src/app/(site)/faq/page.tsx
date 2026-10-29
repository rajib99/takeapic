import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { title: t("faq.seo.title"), description: t("faq.seo.description"), alternates: { canonical: "/faq" } };
}

export default async function Faq() {
  const { t, data } = await getSite();
  return (
    <section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <div className="wrap" style={{ maxWidth: 760 }}>
        <h1>{t("faq.title")}</h1>
        {data.faqs.map((f) => (
          <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
        ))}
      </div>
    </section>
  );
}
