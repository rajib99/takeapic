"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminConfigured, COOKIE, getAdmin, isAdminEmail, passwordMatches, sessionCookie } from "@/lib/admin-auth";
import { type CatalogData } from "@/lib/config";
import { updateStored } from "@/lib/content";
import { MANIFEST } from "@/lib/media";
import { ADDABLE } from "@/lib/media-folders";
import { sanitizers, sanitizeTextEdits } from "@/lib/validate";

type Result = { ok: true } | { ok: false; error: string };
const NOT_SIGNED_IN: Result = { ok: false, error: "Your session has expired. Reload the page and sign in again." };

// ── Sign in ────────────────────────────────────────────────────────────────
type LoginState = { error?: string };

// Failed attempts per client, in memory (per server instance): 5 misses locks it out for 15 minutes.
const misses = new Map<string, { n: number; until: number }>();
const MAX_MISSES = 5;
const LOCK_MS = 15 * 60_000;

export async function signIn(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!adminConfigured()) return { error: "Admin sign-in is not set up yet. Add ADMIN_EMAILS and ADMIN_SECRET in Vercel." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const slot = misses.get(ip);
  if (slot && slot.n >= MAX_MISSES && slot.until > Date.now()) return { error: "Too many attempts. Try again in 15 minutes." };

  // Evaluate both checks so the answer and timing don't reveal which one was wrong.
  const okPassword = passwordMatches(password);
  const okEmail = isAdminEmail(email);
  if (!okPassword || !okEmail) {
    misses.set(ip, { n: (slot && slot.until > Date.now() ? slot.n : 0) + 1, until: Date.now() + LOCK_MS });
    return { error: "Wrong email or password." };
  }
  misses.delete(ip);
  const c = sessionCookie(email);
  (await cookies()).set(c.name, c.value, c.options);
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}

// ── Text ───────────────────────────────────────────────────────────────────
export async function saveText(edits: Record<string, string>): Promise<Result> {
  if (!(await getAdmin())) return NOT_SIGNED_IN;
  const clean = sanitizeTextEdits(edits);
  try {
    await updateStored((s) => {
      s.text ??= {};
      for (const [k, v] of Object.entries(clean)) {
        if (v === null) delete s.text[k];
        else s.text[k] = v;
      }
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save." };
  }
  return { ok: true };
}

// ── Pricing, FAQ, testimonials, business info ──────────────────────────────
export type DataSection = keyof CatalogData;

export async function saveData(section: DataSection, value: unknown): Promise<Result> {
  if (!(await getAdmin())) return NOT_SIGNED_IN;
  const sanitize = sanitizers[section] as ((v: unknown) => { ok: true; value: unknown } | { ok: false; error: string }) | undefined;
  if (!sanitize) return { ok: false, error: "Unknown section." };
  const res = sanitize(value);
  if (!res.ok) return res;
  try {
    await updateStored((s) => {
      s.data ??= {};
      (s.data as Record<string, unknown>)[section] = res.value;
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save." };
  }
  return { ok: true };
}

export async function resetData(section: DataSection): Promise<Result> {
  if (!(await getAdmin())) return NOT_SIGNED_IN;
  try {
    await updateStored((s) => {
      if (s.data) delete s.data[section];
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save." };
  }
  return { ok: true };
}

// ── Media ──────────────────────────────────────────────────────────────────
// Files go browser -> Vercel Blob directly (see api/admin/upload). These actions only record which
// uploaded file fills which slot.
const UPLOAD_URL = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/takeapic\/uploads\/[\w./%+-]{1,300}$/i;
const dim = (n: unknown) => (Number.isInteger(n) && (n as number) > 0 && (n as number) <= 20000 ? (n as number) : null);

type Uploaded = { url: string; w: number; h: number };
const checkUpload = (m: Uploaded) => UPLOAD_URL.test(m?.url ?? "") && dim(m?.w) && dim(m?.h);

export async function setMedia(key: string, m: Uploaded): Promise<Result> {
  if (!(await getAdmin())) return NOT_SIGNED_IN;
  if (!checkUpload(m)) return { ok: false, error: "That upload was not recognised." };
  try {
    await updateStored((s) => {
      if (!(key in MANIFEST) && !(s.media && key in s.media)) throw new Error("Unknown media slot.");
      s.media ??= {};
      s.media[key] = { url: m.url, w: m.w, h: m.h };
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save." };
  }
  return { ok: true };
}

export async function addMedia(folder: string, ext: string, m: Uploaded): Promise<Result> {
  if (!(await getAdmin())) return NOT_SIGNED_IN;
  const prefix = ADDABLE[folder];
  if (!prefix || !/^(jpg|png|webp)$/.test(ext) || !checkUpload(m)) return { ok: false, error: "That upload was not recognised." };
  try {
    await updateStored((s) => {
      s.media ??= {};
      s.media[`${folder}/${prefix}-new-${Date.now().toString(36)}.${ext}`] = { url: m.url, w: m.w, h: m.h };
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save." };
  }
  return { ok: true };
}

/** Back to the original file (or un-hide it). */
export async function resetMedia(key: string): Promise<Result> {
  if (!(await getAdmin())) return NOT_SIGNED_IN;
  try {
    await updateStored((s) => {
      if (s.media) delete s.media[key];
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save." };
  }
  return { ok: true };
}

/** Takes a photo off the site. Original photos are hidden (and can be restored); admin-added ones are dropped. */
export async function removeMedia(key: string): Promise<Result> {
  if (!(await getAdmin())) return NOT_SIGNED_IN;
  const folder = key.split("/")[0];
  if (!ADDABLE[folder]) return { ok: false, error: "Only gallery, 360 and magazine photos can be removed." };
  try {
    await updateStored((s) => {
      s.media ??= {};
      if (key in MANIFEST) s.media[key] = { hidden: true };
      else delete s.media[key];
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not save." };
  }
  return { ok: true };
}
