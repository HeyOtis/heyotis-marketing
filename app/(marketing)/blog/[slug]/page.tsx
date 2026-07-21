import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import { Container } from "@/components/marketing/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getAllPostSlugs, getPostBySlug } from "@/lib/mdx";
import { mdxComponents } from "@/mdx-components";
import { CtaBand } from "@/components/marketing/sections/CtaBand";

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
    // Leave image undefined unless the post sets one: buildMetadata then bakes
    // the post title AND description into the default /api/og card.
    image: post.frontmatter.image,
    type: "article",
    publishedTime: post.frontmatter.date,
    modifiedTime: post.frontmatter.updated ?? post.frontmatter.date,
    authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
    tags: post.frontmatter.tags,
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Fallback when an MDX body fails to compile — keeps one bad post from
 * crashing the whole static build, and surfaces the cause in build logs.
 */
function MdxError({ error }: { error: Error }) {
  console.error("[blog] MDX failed to render:", error);
  return (
    <p className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
      This article is temporarily unavailable. Please check back shortly.
    </p>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { title, description, date, updated, author, tags } = post.frontmatter;

  return (
    <>
      <article className="surface-cream pb-16 pt-28 sm:pt-32 lg:pt-36">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: title, href: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title,
          description,
          slug: post.slug,
          datePublished: date,
          dateModified: updated,
          authors: author ? [author] : undefined,
          image: post.frontmatter.image,
          tags,
        })}
      />

      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to blog
        </Link>

        <header className="mt-8 border-b border-border pb-10">
          {tags?.[0] ? (
            <p className="label-mono text-accent">{tags[0]}</p>
          ) : null}
          <h1
            className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            {title}
          </h1>
          <p
            className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            {description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
            <time dateTime={date}>{formatDate(date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTimeMinutes} min read</span>
            {author ? (
              <>
                <span aria-hidden>·</span>
                <span>{author}</span>
              </>
            ) : null}
          </div>
        </header>

        <div className="prose-like mt-10">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            onError={MdxError}
          />
        </div>
      </Container>
      </article>
      <CtaBand
        eyebrow="Try it on your brand"
        title="See how AI recommends you"
        sub="Book a 20-minute walkthrough — we'll run your brand against ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews and show you where you stand."
      />
    </>
  );
}
