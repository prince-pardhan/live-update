import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://liveupdate24.online",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}