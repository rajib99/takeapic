"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveText } from "@/app/admin/actions";
import { SaveBar, useSave } from "./save";

type Field = { key: string; label: string; area: boolean; def: string; value: string };

export function TextEditor({ fields }: { fields: Field[] }) {
  const router = useRouter();
  const [base, setBase] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.key, f.value])));
  const [vals, setVals] = useState(base);
  const { state, run } = useSave();
  const changed = fields.filter((f) => vals[f.key] !== base[f.key]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await run(() => saveText(Object.fromEntries(changed.map((f) => [f.key, vals[f.key]]))));
    if (ok) {
      // A cleared box means "use the original text", so show that.
      const next = Object.fromEntries(fields.map((f) => [f.key, vals[f.key].trim() || f.def]));
      setBase(next);
      setVals(next);
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="a-form">
      {fields.map((f) => (
        <label key={f.key} className="a-field">
          <span>{f.label}{vals[f.key] !== f.def && <button type="button" className="a-link" onClick={() => setVals({ ...vals, [f.key]: f.def })}>Use original</button>}</span>
          {f.area
            ? <textarea rows={Math.min(6, Math.max(2, Math.ceil(vals[f.key].length / 90)))} value={vals[f.key]} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} maxLength={2000} />
            : <input value={vals[f.key]} onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })} maxLength={2000} />}
        </label>
      ))}
      <SaveBar state={state} dirty={changed.length > 0}>
        {changed.length > 0 && <span className="a-muted">{changed.length} unsaved {changed.length === 1 ? "change" : "changes"}</span>}
      </SaveBar>
    </form>
  );
}
