"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { addMedia, removeMedia, resetMedia, setMedia } from "@/app/admin/actions";
import { EXT, IMAGE_TYPES, imageSize, uploadFile, VIDEO_TYPES, videoInfo } from "./upload";

export type MediaItem = {
  key: string; name: string; kind: "image" | "video"; url: string;
  posterKey?: string; posterUrl?: string;
  changed: boolean; added: boolean; hidden: boolean;
};

const must = async (p: Promise<{ ok: true } | { ok: false; error: string }>) => {
  const r = await p;
  if (!r.ok) throw new Error(r.error);
};
const msg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");

function Tile({ item, removable, onDone }: { item: MediaItem; removable: boolean; onDone: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const isVideo = item.kind === "video";

  async function act(label: string, fn: () => Promise<void>) {
    setBusy(label);
    setError("");
    try {
      await fn();
      onDone();
    } catch (e) {
      setError(msg(e));
    }
    setBusy("");
  }

  const replace = (file: File) =>
    act("Uploading…", async () => {
      if (!(isVideo ? VIDEO_TYPES : IMAGE_TYPES).includes(file.type)) throw new Error(isVideo ? "Choose an MP4 video." : "Choose a JPG, PNG or WebP image.");
      if (isVideo) {
        const info = await videoInfo(file);
        await must(setMedia(item.key, { url: await uploadFile(file, file.name), w: info.w, h: info.h }));
        if (info.poster && item.posterKey) {
          await must(setMedia(item.posterKey, { url: await uploadFile(info.poster, "poster.jpg"), w: Math.round(info.w), h: Math.round(info.h) }));
        }
      } else {
        const { w, h } = await imageSize(file);
        await must(setMedia(item.key, { url: await uploadFile(file, file.name), w, h }));
      }
    });

  return (
    <figure className={`a-tile ${item.hidden ? "is-hidden" : ""}`}>
      <div className="a-preview">
        {isVideo
          ? <video src={item.url} poster={item.posterUrl} controls preload="none" playsInline />
          // eslint-disable-next-line @next/next/no-img-element
          : <img src={item.url} alt="" loading="lazy" />}
      </div>
      <figcaption>
        <strong>{item.name}</strong>
        {item.added && <span className="a-tag">added</span>}
        {item.changed && <span className="a-tag">replaced</span>}
        {item.hidden && <span className="a-tag a-tag-off">removed</span>}
      </figcaption>
      <div className="a-actions">
        <input ref={input} type="file" hidden accept={(isVideo ? VIDEO_TYPES : IMAGE_TYPES).join(",")} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) replace(f); }} />
        {item.hidden
          ? <button className="a-btn a-btn-sm" disabled={!!busy} onClick={() => act("Restoring…", () => must(resetMedia(item.key)))}>Restore</button>
          : <button className="a-btn a-btn-sm" disabled={!!busy} onClick={() => input.current?.click()}>{isVideo ? "Replace video" : "Replace"}</button>}
        {item.changed && <button className="a-btn a-btn-sm a-btn-ghost" disabled={!!busy} onClick={() => act("Resetting…", () => must(resetMedia(item.key)))}>Use original</button>}
        {removable && !item.hidden && <button className="a-btn a-btn-sm a-btn-ghost" disabled={!!busy} onClick={() => { if (confirm("Take this off the site?")) act("Removing…", () => must(removeMedia(item.key))); }}>Remove</button>}
      </div>
      {busy && <p className="a-muted" role="status">{busy}</p>}
      {error && <p className="a-err" role="alert">{error}</p>}
    </figure>
  );
}

export function MediaGrid({ folder, canAdd, items }: { folder: string; canAdd: boolean; items: MediaItem[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const live = items.filter((i) => !i.hidden);
  const removed = items.filter((i) => i.hidden);

  async function add(files: File[]) {
    setError("");
    try {
      for (const [i, file] of files.entries()) {
        setBusy(`Uploading ${i + 1} of ${files.length}…`);
        if (!IMAGE_TYPES.includes(file.type)) throw new Error(`${file.name}: choose JPG, PNG or WebP images.`);
        const { w, h } = await imageSize(file);
        await must(addMedia(folder, EXT[file.type], { url: await uploadFile(file, file.name), w, h }));
      }
    } catch (e) {
      setError(msg(e));
    }
    setBusy("");
    router.refresh();
  }

  return (
    <>
      <p className="a-muted">Replacing keeps the same place on the site. Photos: JPG, PNG or WebP. Videos: MP4 (H.264), ideally under 30 MB so pages stay fast. A video's still frame is picked automatically.</p>
      {canAdd && (
        <div className="a-add">
          <input ref={input} type="file" hidden multiple accept={IMAGE_TYPES.join(",")} onChange={(e) => { const f = [...(e.target.files ?? [])]; e.target.value = ""; if (f.length) add(f); }} />
          <button className="a-btn" disabled={!!busy} onClick={() => input.current?.click()}>+ Add photos</button>
          {busy && <span className="a-muted" role="status">{busy}</span>}
          {error && <span className="a-err" role="alert">{error}</span>}
        </div>
      )}
      <div className="a-grid">
        {live.map((i) => <Tile key={i.key + i.url} item={i} removable={canAdd} onDone={() => router.refresh()} />)}
      </div>
      {removed.length > 0 && (
        <>
          <h2>Removed</h2>
          <div className="a-grid">{removed.map((i) => <Tile key={i.key} item={i} removable={false} onDone={() => router.refresh()} />)}</div>
        </>
      )}
    </>
  );
}
