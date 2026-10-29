import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { title: t("contact.seo.title"), description: t("contact.seo.description"), alternates: { canonical: "/contact" } };
}

export default async function Contact() {
  const { t, site } = await getSite();
  const [before, after = ""] = t("contact.intro", { area: site.area }).split("{email}");
  const labels = Object.fromEntries(["name", "email", "phone", "date", "message", "send", "sending", "thanks", "error"].map((k) => [k, t(`contact.${k}`)]));
  return (
    <section>
      <div className="wrap">
        <h1>{t("contact.title")}</h1>
        <p className="muted">{before}<a href={`mailto:${site.email}`}>{site.email}</a>{after}</p>
        <ContactForm labels={labels} />
      </div>
    </section>
  );
}
