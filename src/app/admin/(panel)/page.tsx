import Link from "next/link";
import { GROUPS } from "@/lib/text";
import { MEDIA_FOLDERS } from "@/lib/media-folders";

export default function Dashboard() {
  const blob = !!(process.env.BLOB_READ_WRITE_TOKEN || (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID));
  return (
    <>
      <h1>What would you like to change?</h1>
      <p className="a-muted">Edits go live on the site within a few seconds of saving. Layout, colours and code are not editable here.</p>
      {!blob && <p className="a-err" role="alert">Vercel Blob isn't connected, so saving is disabled. Connect a Blob store to this project.</p>}
      <div className="a-tiles">
        <section className="a-card">
          <h2>Text</h2>
          <p className="a-muted">Headlines, paragraphs, buttons, menu and page titles.</p>
          <ul>{Object.entries(GROUPS).map(([g, label]) => <li key={g}><Link href={`/admin/text/${g}`}>{label}</Link></li>)}</ul>
        </section>
        <section className="a-card">
          <h2>Images & videos</h2>
          <p className="a-muted">Replace any photo or clip, add gallery photos, remove ones you don't want.</p>
          <ul>{MEDIA_FOLDERS.map((f) => <li key={f.id}><Link href={`/admin/media/${f.id}`}>{f.label}</Link></li>)}</ul>
        </section>
        <section className="a-card">
          <h2>Business</h2>
          <p className="a-muted">Prices, packages, add-ons and the rest of the content.</p>
          <ul>
            <li><Link href="/admin/data/booths">Booths & packages</Link></li>
            <li><Link href="/admin/data/addons">Add-ons</Link></li>
            <li><Link href="/admin/data/faqs">FAQ</Link></li>
            <li><Link href="/admin/data/testimonials">Testimonials</Link></li>
            <li><Link href="/admin/data/site">Contact details & deposit</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
