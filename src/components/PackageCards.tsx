import Link from "next/link";
import { PACKAGES, depositFor } from "@/lib/config";

export function PackageCards() {
  return (
    <div className="grid3">
      {PACKAGES.map((p) => (
        <article key={p.id} className={`card pkg ${p.featured ? "featured" : ""}`}>
          {p.featured && <span className="badge">Most popular</span>}
          <h3>{p.name}</h3>
          <p className="muted">{p.tagline}</p>
          <p className="price">${p.price.toLocaleString()}</p>
          <p className="muted small">${depositFor(p).toLocaleString()} deposit holds your date</p>
          <ul>
            {p.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <Link className="btn" href={`/book?package=${p.id}`}>Book {p.name}</Link>
        </article>
      ))}
    </div>
  );
}
