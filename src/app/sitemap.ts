import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/takeapic", "/magic-mirror", "/magazine-photo-booth", "/360-photo-booth", "/packages", "/how-it-works", "/gallery", "/faq", "/contact", "/book"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
