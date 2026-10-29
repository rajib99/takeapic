import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured, getAdmin } from "@/lib/admin-auth";

export default async function Login({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  if (await getAdmin()) redirect("/admin");
  const { expired } = await searchParams;
  return (
    <main className="a-center">
      <h1>Take a pic admin</h1>
      <p className="a-muted">Enter your admin email and we'll send you a sign-in link. You'll stay signed in on this browser for 3 months.</p>
      {expired && <p className="a-err" role="alert">That link has expired or isn't valid. Request a new one.</p>}
      {!adminConfigured() && (
        <p className="a-err" role="alert">Admin access isn't configured. In Vercel, set <code>ADMIN_EMAILS</code> (comma-separated) and <code>ADMIN_SECRET</code> (a random string of 24+ characters), then redeploy.</p>
      )}
      <LoginForm />
    </main>
  );
}
