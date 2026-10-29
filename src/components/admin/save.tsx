"use client";
import { useState } from "react";

type Outcome = { ok: true } | { ok: false; error: string };

/** Runs a save and tracks its status for <SaveBar>. */
export function useSave() {
  const [state, setState] = useState<{ kind: "idle" | "busy" | "ok" | "err"; msg?: string }>({ kind: "idle" });
  const run = async (fn: () => Promise<Outcome>) => {
    setState({ kind: "busy" });
    try {
      const r = await fn();
      setState(r.ok ? { kind: "ok" } : { kind: "err", msg: r.error });
      return r.ok;
    } catch (e) {
      setState({ kind: "err", msg: e instanceof Error ? e.message : "Could not save." });
      return false;
    }
  };
  return { state, run, clear: () => setState({ kind: "idle" }) };
}

export function SaveBar({ state, dirty = true, label = "Save changes", children }: { state: ReturnType<typeof useSave>["state"]; dirty?: boolean; label?: string; children?: React.ReactNode }) {
  return (
    <div className="a-savebar">
      <button className="a-btn" disabled={state.kind === "busy" || !dirty}>{state.kind === "busy" ? "Saving…" : label}</button>
      {children}
      {state.kind === "ok" && <span className="a-ok" role="status">Saved. It's live on the site now.</span>}
      {state.kind === "err" && <span className="a-err" role="alert">{state.msg}</span>}
    </div>
  );
}
