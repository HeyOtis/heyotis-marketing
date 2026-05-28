import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { Container } from "@/components/marketing/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getAllPostSlugs, getPostBySlug } from "@/lib/mdx";
import { mdxComponents } from "@/mdx-components";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    path: `/blog/${post.slug}`,
    image: post.frontmatter.image ?? `/api/og?title=${encodeURIComponent(post.frontmatter.title)}`,
    type: "article",
    publishedTime: post.frontmatter.date,
    modifiedTime: post.frontmatter.updated ?? post.frontmatter.date,
    authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
    tags: post.frontmatter.tags,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <Container className="max-w-3xl py-16">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.frontmatter.title, href: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          slug: post.slug,
          datePublished: post.frontmatter.date,
          dateModified: post.frontmatter.updated,
          authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
          image: post.frontmatter.image,
          tags: post.frontmatter.tags,
        })}
      />
      <article>
        <header className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight">
            {post.frontmatter.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span aria-hidden>·</span>
            <span>{post.readingTimeMinutes} min read</span>
            {post.frontmatter.author && (
              <>
                <span aria-hidden>·</span>
                <span>{post.frontmatter.author}</span>
              </>
            )}
          </div>
        </header>
        <div className="prose-like">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>
    </Container>
  );
}
