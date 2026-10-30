"use client";
import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action} className="a-card a-login">
      <label>Admin email
        <input type="email" name="email" autoComplete="username" required autoFocus />
      </label>
      <label>Password
        <input type="password" name="password" autoComplete="current-password" required />
      </label>
      <button className="a-btn" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
      {state.error && <p className="a-err" role="alert">{state.error}</p>}
    </form>
  );
}
