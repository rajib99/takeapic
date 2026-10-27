import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    if (s.payment_status === "paid") {
      // CRM hook: this is where a paid booking should be written to your CRM / database.
      await notify(`New paid booking: ${s.metadata?.name} (${s.metadata?.package}) ${s.metadata?.date}`, {
        ...s.metadata,
        deposit_paid: `$${((s.amount_total ?? 0) / 100).toFixed(2)}`,
        stripe_session: s.id,
      });
    }
  }
  return NextResponse.json({ received: true });
}
