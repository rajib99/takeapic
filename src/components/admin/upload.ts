import { upload } from "@vercel/blob/client";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Straight from the browser to Vercel Blob (the server only hands out a short-lived token). */
export async function uploadFile(file: Blob, name: string): Promise<string> {
  const safe = name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+/, "").slice(-60) || "file";
  const blob = await upload(`takeapic/uploads/${safe}`, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
    contentType: file.type,
    multipart: file.size > 15 * 1024 * 1024,
  });
  return blob.url;
}

const objectUrl = async <T,>(file: Blob, use: (url: string) => Promise<T>) => {
  const url = URL.createObjectURL(file);
  try {
    return await use(url);
  } finally {
    URL.revokeObjectURL(url);
  }
};

export const imageSize = (file: Blob) =>
  objectUrl(file, (url) => new Promise<{ w: number; h: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("That image could not be read."));
    img.src = url;
  }));

const withTimeout = <T,>(p: Promise<T>, ms: number, fallback: T) =>
  Promise.race([p, new Promise<T>((r) => setTimeout(() => r(fallback), ms))]);

export const isVideoFile = (f: File) => VIDEO_TYPES.includes(f.type) || /\.(mp4|mov|webm|m4v)$/i.test(f.name);
export const isImageFile = (f: File) => IMAGE_TYPES.includes(f.type) || /\.(jpe?g|png|webp)$/i.test(f.name);
const BY_EXT: Record<string, string> = { mp4: "video/mp4", m4v: "video/mp4", mov: "video/quicktime", webm: "video/webm", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
/** Browsers sometimes report no type, or a generic one (application/octet-stream); the extension is more reliable. */
export const fileType = (f: File) =>
  BY_EXT[f.name.split(".").pop()!.toLowerCase()] ?? ([...VIDEO_TYPES, ...IMAGE_TYPES].includes(f.type) ? f.type : "");

/**
 * Dimensions plus a JPEG still from about a second in, used as the video's poster.
 * Never hangs or fails hard: if the browser can't decode the video (e.g. iPhone HEVC in Chrome) or the
 * frame can't be grabbed, it resolves with whatever it has and the caller falls back.
 */
export const videoInfo = (file: Blob) =>
  objectUrl(file, (url) =>
    withTimeout(
      new Promise<{ w: number; h: number; poster: Blob | null }>((resolve) => {
        const v = document.createElement("video");
        v.muted = true;
        v.playsInline = true;
        v.preload = "auto";
        let w = 0, h = 0;
        v.onerror = () => resolve({ w, h, poster: null });
        v.onloadedmetadata = () => {
          w = v.videoWidth; h = v.videoHeight;
          v.currentTime = Math.min(1.5, (v.duration || 2) / 2);
        };
        v.onseeked = () => {
          const scale = Math.min(1, 1080 / Math.max(w, h));
          const c = document.createElement("canvas");
          c.width = Math.round(w * scale);
          c.height = Math.round(h * scale);
          try { c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height); } catch { /* no frame */ }
          c.toBlob((poster) => resolve({ w, h, poster }), "image/jpeg", 0.85);
        };
        v.src = url;
      }),
      8000,
      { w: 0, h: 0, poster: null },
    ),
  );
