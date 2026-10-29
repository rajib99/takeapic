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

/** Dimensions plus a JPEG still from about a second in, used as the video's poster. */
export const videoInfo = (file: Blob) =>
  objectUrl(file, (url) => new Promise<{ w: number; h: number; poster: Blob | null }>((resolve, reject) => {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.onerror = () => reject(new Error("That video could not be read. Use an MP4 (H.264)."));
    v.onloadedmetadata = () => { v.currentTime = Math.min(1.5, (v.duration || 2) / 2); };
    v.onseeked = () => {
      const w = v.videoWidth, h = v.videoHeight;
      const scale = Math.min(1, 1080 / Math.max(w, h));
      const c = document.createElement("canvas");
      c.width = Math.round(w * scale);
      c.height = Math.round(h * scale);
      c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height);
      c.toBlob((poster) => resolve({ w, h, poster }), "image/jpeg", 0.85);
    };
    v.src = url;
  }));
