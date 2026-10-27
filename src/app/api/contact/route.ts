import { NextResponse } from "next/server";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const name = clean(b?.name);
  const email = clean(b?.email);
  const message = clean(b?.message, 2000);
  if (b?.company) return NextResponse.json({ ok: true }); // honeypot
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
  }
  await notify(`New lead from ${name}`, { name, email, phone: clean(b?.phone, 30), eventDate: clean(b?.date, 10), message });
  return NextResponse.json({ ok: true });
}
