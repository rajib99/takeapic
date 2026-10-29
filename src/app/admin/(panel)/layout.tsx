import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { GROUPS } from "@/lib/text";
import { MEDIA_FOLDERS } from "@/lib/media-folders";

export default async function Panel({ children }: { children: React.ReactNode }) {
  const email = await requireAdmin();
  return (
    <div className="a-shell">
      <aside className="a-side">
        <Link href="/admin" className="a-brand">Take a pic admin</Link>
        <nav aria-label="Admin">
          <h2>Text</h2>
          {Object.entries(GROUPS).map(([g, label]) => <Link key={g} href={`/admin/text/${g}`}>{label}</Link>)}
          <h2>Images & videos</h2>
          {MEDIA_FOLDERS.map((f) => <Link key={f.id} href={`/admin/media/${f.id}`}>{f.label}</Link>)}
          <h2>Business</h2>
          <Link href="/admin/data/booths">Booths & packages</Link>
          <Link href="/admin/data/addons">Add-ons</Link>
          <Link href="/admin/data/faqs">FAQ</Link>
          <Link href="/admin/data/testimonials">Testimonials</Link>
          <Link href="/admin/data/site">Contact details & deposit</Link>
        </nav>
        <div className="a-who">
          <span>{email}</span>
          <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
          <form action={logout}><button className="a-link">Sign out</button></form>
        </div>
      </aside>
      <main className="a-main">{children}</main>
    </div>
  );
}
