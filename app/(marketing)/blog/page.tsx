import Link from "next/link";
import { Container } from "@/components/marketing/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/mdx";

export const metadata = buildMetadata({
  title: "Blog",
  description: "HeyOtis blog — guides, announcements, and deep dives.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <Container className="max-w-3xl py-16">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ])}
      />
      <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-4 text-muted-foreground">
        Guides, announcements, and deep dives.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
          No posts yet. Add MDX files under{" "}
          <code className="font-mono">content/blog/</code> with frontmatter (
          <code className="font-mono">title</code>,{" "}
          <code className="font-mono">description</code>,{" "}
          <code className="font-mono">date</code>).
        </p>
      ) : (
        <ul className="mt-12 space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <article>
                  <h2 className="text-2xl font-semibold tracking-tight group-hover:underline">
                    {post.frontmatter.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {post.frontmatter.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <time dateTime={post.frontmatter.date}>
                      {new Date(post.frontmatter.date).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </time>
                    <span aria-hidden>·</span>
                    <span>{post.readingTimeMinutes} min read</span>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
