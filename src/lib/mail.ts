/** Plain transactional email through Resend. Returns false (and logs) if it could not be sent. */
export async function sendMail(to: string, subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.LEADS_FROM_EMAIL || "Take a pic <onboarding@resend.dev>", to: [to], subject, text }),
  });
  if (!res.ok) console.error("[mail] Resend failed", res.status, await res.text());
  return res.ok;
}
