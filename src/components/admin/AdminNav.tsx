"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Section = { title: string; items: { href: string; label: string }[] };

const ICONS: Record<string, string> = { Text: "✏️", "Images & videos": "🎞️", Business: "💼" };

export function AdminNav({ sections }: { sections: Section[] }) {
  const path = usePathname();
  return (
    <nav aria-label="Admin">
      <Link href="/admin" className={`a-nav-home ${path === "/admin" ? "on" : ""}`} aria-current={path === "/admin" ? "page" : undefined}>🏠 Dashboard</Link>
      {sections.map((s) => (
        <div key={s.title} className="a-nav-sec">
          <h2><span aria-hidden>{ICONS[s.title]}</span> {s.title}</h2>
          {s.items.map((i) => {
            const on = path === i.href;
            return <Link key={i.href} href={i.href} className={on ? "on" : ""} aria-current={on ? "page" : undefined}>{i.label}</Link>;
          })}
        </div>
      ))}
    </nav>
  );
}
