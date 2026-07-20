import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllPosts } from "@/lib/mdx";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/strategy-engine", changeFrequency: "monthly", priority: 0.95 },
  { path: "/features", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/report", changeFrequency: "weekly", priority: 0.85 },
  { path: "/case-studies", changeFrequency: "monthly", priority: 0.6 },
  { path: "/case-studies/hallensteins", changeFrequency: "monthly", priority: 0.6 },
  { path: "/guides", changeFrequency: "monthly", priority: 0.6 },
];

// Stable date for static routes so the sitemap doesn't churn on every deploy.
// Bump when the marketing pages get a substantive content update.
const STATIC_LAST_MODIFIED = "2026-07-17";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: new URL(route.path, siteConfig.url).toString(),
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogEntries = getAllPosts().map((post) => ({
    url: new URL(`/blog/${post.slug}`, siteConfig.url).toString(),
    lastModified: new Date(post.frontmatter.updated ?? post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
