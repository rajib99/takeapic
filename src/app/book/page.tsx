import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book Your Photo Booth",
  description: "Reserve your robot photo booth. Choose a package, pick your date and pay a secure deposit with Stripe.",
  alternates: { canonical: "/book" },
};

export default async function Book({ searchParams }: { searchParams: Promise<{ package?: string }> }) {
  const { package: pkg = "" } = await searchParams;
  return (
    <section>
      <div className="wrap">
        <h1>Book your date</h1>
        <BookingForm initial={pkg} />
      </div>
    </section>
  );
}
