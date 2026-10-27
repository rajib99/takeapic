import { NextResponse } from "next/server";
import { PACKAGES, SITE, depositFor, EVENT_TYPES } from "@/lib/config";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const pkg = PACKAGES.find((p) => p.id === body.packageId);
  const name = clean(body.name);
  const email = clean(body.email);
  const date = clean(body.date, 10);
  const eventType = clean(body.eventType);

  if (!pkg || !name || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }
  if (new Date(date) < new Date(new Date().toDateString())) {
    return NextResponse.json({ error: "Please choose a future date." }, { status: 400 });
  }
  if (!(EVENT_TYPES as readonly string[]).includes(eventType)) {
    return NextResponse.json({ error: "Please choose an event type." }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(depositFor(pkg) * 100),
            product_data: {
              name: `${pkg.name} package: ${pkg.depositPct}% deposit`,
              description: `Event date ${date}. Total package price $${pkg.price}.`,
            },
          },
        },
      ],
      metadata: {
        package: pkg.id,
        name,
        email,
        phone: clean(body.phone, 30),
        date,
        eventType,
        venue: clean(body.venue),
        guests: clean(body.guests, 10),
        notes: clean(body.notes, 450),
      },
      success_url: `${SITE.url}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/book?package=${pkg.id}`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.json({ error: "Payment could not be started. Please try again." }, { status: 500 });
  }
}
