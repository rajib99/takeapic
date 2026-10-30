import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Admin sign-in: an email from the ADMIN_EMAILS env var (set in Vercel) plus ADMIN_SECRET as the password.
// A correct sign-in sets a signed, httpOnly cookie that lasts 90 days, so the browser isn't asked again.
// Nothing is stored server-side; ADMIN_SECRET signs the cookie. Remove an email from ADMIN_EMAILS
// (or change ADMIN_SECRET) and every session for it stops working at once.
export const COOKIE = "tap_admin";
export const SESSION_SECONDS = 60 * 60 * 24 * 90;

type Kind = "session" | "password";

export const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "").split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean);
export const isAdminEmail = (email: string) => adminEmails().includes(email.trim().toLowerCase());

const secret = () => {
  const s = process.env.ADMIN_SECRET;
  return s && s.length >= 16 ? s : null;
};
/** Both must be configured; otherwise the admin stays locked. */
export const adminConfigured = () => !!secret() && adminEmails().length > 0;

const b64 = (b: Buffer | string) => Buffer.from(b).toString("base64url");
const mac = (kind: Kind, body: string) => createHmac("sha256", secret()!).update(`${kind}.${body}`).digest();

/** Constant-time check of a typed password against ADMIN_SECRET. */
export function passwordMatches(given: string): boolean {
  if (!secret()) return false;
  return timingSafeEqual(mac("password", given), mac("password", secret()!));
}

export function signToken(kind: Kind, email: string, seconds: number): string {
  const body = b64(JSON.stringify({ e: email.toLowerCase(), x: Math.floor(Date.now() / 1000) + seconds }));
  return `${body}.${b64(mac(kind, body))}`;
}

/** Returns the email if the token is genuine, unexpired, and the email is still allowed. */
export function verifyToken(kind: Kind, token: string | undefined | null): string | null {
  if (!token || !secret()) return null;
  const [body, sig, extra] = token.split(".");
  if (!body || !sig || extra !== undefined) return null;
  const given = Buffer.from(sig, "base64url");
  const want = mac(kind, body);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof e !== "string" || typeof x !== "number" || x < Date.now() / 1000) return null;
    return isAdminEmail(e) ? e : null;
  } catch {
    return null;
  }
}

export const sessionCookie = (email: string) => ({
  name: COOKIE,
  value: signToken("session", email, SESSION_SECONDS),
  options: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: SESSION_SECONDS },
});

/** The signed-in admin's email, or null. Call this in every admin page, action and route. */
export async function getAdmin(): Promise<string | null> {
  return verifyToken("session", (await cookies()).get(COOKIE)?.value);
}

export async function requireAdmin(): Promise<string> {
  const email = await getAdmin();
  if (!email) redirect("/admin/login");
  return email;
}
