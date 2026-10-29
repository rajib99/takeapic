import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/takeapic", "/magic-mirror", "/magazine-photo-booth", "/360-photo-booth", "/packages", "/how-it-works", "/gallery", "/faq", "/contact", "/book"].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
