import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { GROUPS } from "@/lib/text";
import { MEDIA_FOLDERS } from "@/lib/media-folders";

export default async function Panel({ children }: { children: React.ReactNode }) {
  const email = await requireAdmin();
  return (
    <div className="a-shell">
      <aside className="a-side">
        <Link href="/admin" className="a-brand"><span className="a-logo" aria-hidden>📸</span><span>Take a pic<small>Admin</small></span></Link>
        <AdminNav
          sections={[
            { title: "Text", items: Object.entries(GROUPS).map(([g, label]) => ({ href: `/admin/text/${g}`, label })) },
            { title: "Images & videos", items: MEDIA_FOLDERS.map((f) => ({ href: `/admin/media/${f.id}`, label: f.label })) },
            { title: "Business", items: [
              { href: "/admin/data/booths", label: "Booths & packages" },
              { href: "/admin/data/addons", label: "Add-ons" },
              { href: "/admin/data/faqs", label: "FAQ" },
              { href: "/admin/data/testimonials", label: "Testimonials" },
              { href: "/admin/data/site", label: "Contact details & deposit" },
            ] },
          ]}
        />
        <div className="a-who">
          <div className="a-user"><span className="a-avatar" aria-hidden>{email[0].toUpperCase()}</span><span>{email}</span></div>
          <div className="a-who-links">
            <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
            <form action={logout}><button className="a-link">Sign out</button></form>
          </div>
        </div>
      </aside>
      <main className="a-main">{children}</main>
    </div>
  );
}
