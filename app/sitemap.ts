import type { MetadataRoute } from "next";
import { localePaths, siteUrl } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const localeEntries = localePaths.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1
  }));

  const infoEntries = ["about", "contact", "privacy", "terms"].map((path) => ({
    url: `${siteUrl}/${path}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.4
  }));

  return [...localeEntries, ...infoEntries];
}
