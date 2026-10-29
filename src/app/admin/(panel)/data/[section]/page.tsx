import { notFound } from "next/navigation";
import { BoothsEditor, ListEditor, SiteEditor } from "@/components/admin/DataEditors";
import { DEFAULT_DATA } from "@/lib/config";
import { mergeData, readStored } from "@/lib/content";

export default async function DataPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const stored = (await readStored()).data ?? {};
  const data = mergeData(stored);
  const isCustom = (k: keyof typeof stored) => k in stored;

  switch (section) {
    case "booths":
      return (
        <>
          <h1>Booths & packages</h1>
          <p className="a-muted">Each booth page, the booking form and the Stripe charge all use these prices. The deposit is calculated from them automatically.</p>
          <BoothsEditor initial={data.booths} custom={isCustom("booths")} />
        </>
      );
    case "addons":
      return (
        <>
          <h1>Add-ons</h1>
          <p className="a-muted">Shown under every booth's pricing. Add-ons marked “quoted” are listed with a “from” price but are not charged online (use it for travel fees).</p>
          <ListEditor kind="addons" initial={data.addons} custom={isCustom("addons")} />
        </>
      );
    case "faqs":
      return (
        <>
          <h1>FAQ</h1>
          <p className="a-muted">Questions and answers on the FAQ page (also shown to Google).</p>
          <ListEditor kind="faqs" initial={data.faqs} custom={isCustom("faqs")} />
        </>
      );
    case "testimonials":
      return (
        <>
          <h1>Testimonials</h1>
          <p className="a-muted">Only publish real reviews from real clients, with their permission. Leave this empty to hide the section. The sample entries are placeholders.</p>
          <ListEditor kind="testimonials" initial={data.testimonials} custom={isCustom("testimonials")} />
        </>
      );
    case "site":
      return (
        <>
          <h1>Contact details & deposit</h1>
          <SiteEditor site={data.site} depositPct={data.depositPct} siteDefault={DEFAULT_DATA.site} />
        </>
      );
    default:
      notFound();
  }
}
