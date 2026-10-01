import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { getPublishedProfiles, profilesUpdatedAt } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updated = await profilesUpdatedAt();
  const profiles = (await getPublishedProfiles()).map((profile) => ({
    url: absoluteUrl(`/profiles/${profile.slug}`),
    lastModified: updated,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: absoluteUrl("/"), lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/categories"), lastModified: updated, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/suggest"), changeFrequency: "monthly", priority: 0.5 },
    ...categories.map((category) => ({
      url: absoluteUrl(`/categories/${category.slug}`),
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...profiles,
  ];
}
