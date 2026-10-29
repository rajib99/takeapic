import { notFound } from "next/navigation";
import { MediaGrid, type MediaItem } from "@/components/admin/MediaGrid";
import { readStored } from "@/lib/content";
import { MANIFEST } from "@/lib/media";
import { MEDIA_FOLDERS } from "@/lib/media-folders";

const VIDEO = /\.(mp4|webm|mov)$/i;

export default async function MediaPage({ params }: { params: Promise<{ folder: string }> }) {
  const { folder } = await params;
  const meta = MEDIA_FOLDERS.find((f) => f.id === folder);
  if (!meta) notFound();
  const overrides = (await readStored()).media ?? {};
  const inFolder = (k: string) => (folder === "site" ? !k.includes("/") : k.startsWith(`${folder}/`));
  const keys = [...new Set([...Object.keys(MANIFEST), ...Object.keys(overrides)])].filter(inFolder).sort();
  const keySet = new Set(keys);
  const current = (k: string) => {
    const o = overrides[k];
    return o && !("hidden" in o) ? o : MANIFEST[k];
  };

  const items: MediaItem[] = keys
    // A poster (foo.jpg beside foo.mp4) is shown inside its video's tile, not on its own.
    .filter((k) => !(k.endsWith(".jpg") && keySet.has(k.replace(/\.jpg$/, ".mp4"))))
    .map((k) => {
      const o = overrides[k];
      const c = current(k);
      const isVideo = VIDEO.test(k);
      const posterKey = k.replace(VIDEO, ".jpg");
      return {
        key: k,
        name: k.split("/").pop()!,
        kind: isVideo ? "video" : "image",
        url: c?.url ?? "",
        posterKey: isVideo ? posterKey : undefined,
        posterUrl: isVideo ? current(posterKey)?.url : undefined,
        changed: !!o && !("hidden" in o) && k in MANIFEST,
        added: !(k in MANIFEST),
        hidden: !!o && "hidden" in o,
      } satisfies MediaItem;
    });

  return (
    <>
      <h1>{meta.label}</h1>
      <p className="a-muted">{meta.note}</p>
      <MediaGrid key={folder} folder={folder} canAdd={meta.add} items={items} />
    </>
  );
}
