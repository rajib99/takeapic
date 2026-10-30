import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured, getAdmin } from "@/lib/admin-auth";

export default async function Login() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="a-center">
      <h1>Take a pic admin</h1>
      <p className="a-muted">Sign in with your admin email and password. You'll stay signed in on this browser for 3 months.</p>
      {!adminConfigured() && (
        <p className="a-err" role="alert">Admin access isn't configured. In Vercel, set <code>ADMIN_EMAILS</code> (comma-separated) and <code>ADMIN_SECRET</code> (the admin password, 16+ characters), then redeploy.</p>
      )}
      <LoginForm />
    </main>
  );
}
