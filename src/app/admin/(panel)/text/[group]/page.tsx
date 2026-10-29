import { notFound } from "next/navigation";
import { TextEditor } from "@/components/admin/TextEditor";
import { readStored } from "@/lib/content";
import { GROUPS, groupOf, TEXT } from "@/lib/text";

export default async function TextPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  if (!(group in GROUPS)) notFound();
  const stored = (await readStored()).text ?? {};
  const fields = Object.entries(TEXT)
    .filter(([k]) => groupOf(k) === group)
    .map(([key, d]) => ({ key, label: d.label, area: !!d.area, def: d.value, value: stored[key] ?? d.value }));
  return (
    <>
      <h1>{GROUPS[group]}</h1>
      <p className="a-muted">Wrap a word in *asterisks* to colour it. <code>{"{braces}"}</code> are filled in automatically, so leave them as they are. Clearing a box puts the original text back.</p>
      <TextEditor key={group} fields={fields} />
    </>
  );
}
