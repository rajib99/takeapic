"use client";
import { useActionState } from "react";
import { requestLink } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(requestLink, {});
  return (
    <form action={action} className="a-card a-login">
      <label>Admin email
        <input type="email" name="email" autoComplete="email" required autoFocus />
      </label>
      <button className="a-btn" disabled={pending}>{pending ? "Sending…" : "Email me a sign-in link"}</button>
      {state.message && <p className="a-ok" role="status">{state.message}</p>}
      {state.error && <p className="a-err" role="alert">{state.error}</p>}
    </form>
  );
}
