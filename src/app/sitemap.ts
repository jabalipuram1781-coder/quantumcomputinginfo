import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";
import { categories } from "@/lib/constants";
import { siteConfig } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  // 1. Static Routes
  const staticRoutes = ["", "/blog", "/news", "/tutorials", "/research", "/careers", "/about", "/contact", "/search"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Category Detail Routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${siteConfig.url}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 3. Blog Article Detail Routes
  const articleRoutes = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate || post.publishDate),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
