import { NextResponse } from "next/server";
import { sessionCookie, verifyToken } from "@/lib/admin-auth";

// The emailed link lands here: trade a valid token for the 3-month session cookie.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = verifyToken("login", url.searchParams.get("token"));
  if (!email) return NextResponse.redirect(new URL("/admin/login?expired=1", url));
  const res = NextResponse.redirect(new URL("/admin", url));
  const c = sessionCookie(email);
  res.cookies.set(c.name, c.value, c.options);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Referrer-Policy", "no-referrer");
  return res;
}
