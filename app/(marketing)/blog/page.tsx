import Link from "next/link";
import { Container } from "@/components/marketing/Container";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { Section } from "@/components/marketing/primitives/Section";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/mdx";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Field notes on Answer Engine Optimization (AEO/GEO): how ChatGPT, Claude, Gemini and Perplexity choose which brands to recommend, and how to measure and grow your Share of Voice in AI search.",
  path: "/blog",
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ])}
      />

      {/* Hero — sits under the sticky nav, so it gets generous top padding. */}
      <section className="surface-cream pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
        <Container className="max-w-3xl">
          <Eyebrow>Resources</Eyebrow>
          <h1
            className="mt-5 display-lg text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            The answer engine playbook
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            Practical guides on AI brand visibility — how ChatGPT, Claude, Gemini and
            Perplexity decide which brands to recommend, and how to measure,
            benchmark and grow your Share of Voice in their answers.
          </p>
        </Container>
      </section>

      {/* Post grid */}
      <Section surface="cream" className="pt-0">
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
            No posts yet. Add MDX files under{" "}
            <code className="font-mono">content/blog/</code> with frontmatter (
            <code className="font-mono">title</code>,{" "}
            <code className="font-mono">description</code>,{" "}
            <code className="font-mono">date</code>).
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => {
              const tag = post.frontmatter.tags?.[0];
              return (
                <li key={post.slug}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-foreground/5"
                    >
                      {tag ? (
                        <span className="label-mono text-accent">{tag}</span>
                      ) : null}
                      <h2 className="mt-3 font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-accent">
                        {post.frontmatter.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {post.frontmatter.description}
                      </p>
                      <div className="mt-6 flex items-center gap-2.5 text-xs text-muted-foreground">
                        <time dateTime={post.frontmatter.date}>
                          {formatDate(post.frontmatter.date)}
                        </time>
                        <span aria-hidden>·</span>
                        <span>{post.readingTimeMinutes} min read</span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <CtaBand />
    </>
  );
}
