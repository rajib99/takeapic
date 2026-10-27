// Sends a lead/booking notification via Resend. Falls back to logging
// (visible in Vercel logs) so nothing is lost before email is configured.
export async function notify(subject: string, fields: Record<string, string | undefined>) {
  const text = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[lead] ${subject}\n${text}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEADS_FROM_EMAIL || "Take a pic <onboarding@resend.dev>",
      to: [process.env.LEADS_TO_EMAIL || "bookings@takeabic.biz"],
      subject,
      text,
    }),
  });
  if (!res.ok) console.error("[notify] Resend failed", res.status, await res.text());
}
