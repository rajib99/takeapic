import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getSite();
  return { title: t("how.seo.title"), description: t("how.seo.description"), alternates: { canonical: "/how-it-works" } };
}

export default async function How() {
  const { t } = await getSite();
  return (
    <section>
      <div className="wrap">
        <h1 className="center">{t("how.title")}</h1>
        <div className="grid3 steps">
          {([1, 2, 3, 4] as const).map((n) => (
            <div key={n} className="card"><h3>{t(`how.s${n}.title`)}</h3><p className="muted">{t(`how.s${n}.text`)}</p></div>
          ))}
        </div>
        <p className="center" style={{ marginTop: 32 }}><Link className="btn" href="/book">{t("how.cta")}</Link></p>
      </div>
    </section>
  );
}
