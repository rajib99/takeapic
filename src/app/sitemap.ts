import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/packages", "/how-it-works", "/gallery", "/faq", "/contact", "/book"].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
