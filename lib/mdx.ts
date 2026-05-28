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
