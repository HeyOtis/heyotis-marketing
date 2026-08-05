import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllCaseStudies, getAllPosts } from "@/lib/mdx";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/strategy", changeFrequency: "monthly", priority: 0.95 },
  { path: "/platform", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/report", changeFrequency: "weekly", priority: 0.85 },
  { path: "/case-studies", changeFrequency: "monthly", priority: 0.6 },
  // Legal pages: low priority but indexable on purpose - a discoverable privacy
  // notice is expected by ad platforms, app reviewers and regulators.
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  // OtisBot's crawler self-identification page - the +URL in its user-agent
  // string points here. Low priority for search, but must stay indexable and
  // discoverable for the site owners who look it up from their logs.
  { path: "/bot", changeFrequency: "monthly", priority: 0.3 },
  // /guides is deliberately absent: it currently mirrors /blog and is noindexed.
  // Add it back when it has unique content (see app/(marketing)/guides/page.tsx).
];

// Stable date for static routes so the sitemap doesn't churn on every deploy.
// Bump when the marketing pages get a substantive content update.
const STATIC_LAST_MODIFIED = "2026-07-28";

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

  const caseStudyEntries = getAllCaseStudies().map((study) => ({
    url: new URL(`/case-studies/${study.slug}`, siteConfig.url).toString(),
    lastModified: new Date(study.frontmatter.updated ?? study.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries, ...caseStudyEntries];
}
