import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about a robot photo booth rental? Send us your event details and we'll reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <section>
      <div className="wrap">
        <h1>Contact us</h1>
        <p className="muted">Or email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We serve {SITE.area}.</p>
        <ContactForm />
      </div>
    </section>
  );
}
