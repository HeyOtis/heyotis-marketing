import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  author?: string;
  tags?: string[];
  image?: string;
  draft?: boolean;
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTimeMinutes: number;
};

/**
 * Validate the frontmatter we depend on for metadata, schema and sorting.
 * Throws at build time with the offending file named, so a malformed post
 * fails loudly in CI rather than shipping a broken page (NaN dates, empty
 * <title>, etc.).
 */
function validateFrontmatter(file: string, data: Record<string, unknown>): void {
  for (const field of ["title", "description", "date"] as const) {
    if (typeof data[field] !== "string" || (data[field] as string).trim() === "") {
      throw new Error(
        `Invalid frontmatter in content/blog/${file}: "${field}" is required and must be a non-empty string.`,
      );
    }
  }
  if (Number.isNaN(new Date(data.date as string).getTime())) {
    throw new Error(
      `Invalid frontmatter in content/blog/${file}: "date" (${String(data.date)}) is not a parseable date. Use ISO format, e.g. 2026-06-29.`,
    );
  }
}

function readMdxDir(subdir: string): Post[] {
  const dir = path.join(CONTENT_ROOT, subdir);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      validateFrontmatter(file, data);
      const slug = file.replace(/\.(mdx|md)$/, "");
      return {
        slug,
        frontmatter: data as PostFrontmatter,
        content,
        readingTimeMinutes: Math.ceil(readingTime(content).minutes),
      };
    })
    .filter((p) => !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}

export function getAllPosts(): Post[] {
  return readMdxDir("blog");
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
