import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/marketing/Container";
import { Section } from "@/components/marketing/primitives/Section";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { getAllPosts } from "@/lib/mdx";

export const metadata = buildMetadata({
  title: "Guides & AEO Playbook",
  description:
    "The start of HeyOtis' Answer Engine Optimization playbook — practical guides on how AI assistants choose which brands to recommend, and how to grow your Share of Voice.",
  path: "/guides",
});

export default function GuidesPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Guides & AEO Playbook", href: "/guides" },
        ])}
      />

      {/* Hero */}
      <section className="surface-cream pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
        <Container>
          <Eyebrow>Guides & AEO Playbook</Eyebrow>
          <h1
            className="mt-5 display-lg max-w-3xl text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            The start of the AEO playbook.
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            Answer Engine Optimization is a new discipline, and we&rsquo;re
            writing the playbook as we run it for real brands. These guides
            are where it starts — how AI assistants choose which brands to
            recommend, and what you can actually influence.
          </p>
        </Container>
      </section>

      {/* Guide list */}
      <Section surface="cream" className="pt-0">
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
            No guides yet. Add MDX files under{" "}
            <code className="font-mono">content/blog/</code>.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <li key={post.slug}>
                <Reveal delay={i * 0.06} className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-foreground/5"
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-accent">
                      <BookOpen className="size-5" strokeWidth={1.75} />
                    </span>
                    <h2 className="mt-5 font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-accent">
                      {post.frontmatter.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.frontmatter.description}
                    </p>
                    <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-foreground">
                      Read the guide
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Honest in-progress note + report cross-link */}
      <Section surface="card">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <p className="text-balance text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
            The full AEO Playbook is in progress. Get the report while you
            wait.
          </p>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            We&rsquo;re expanding these guides into a complete playbook. In
            the meantime, the fastest way to see where your own brand stands
            is the free AI Visibility Report — a direct read of how five
            assistants answer for you today.
          </p>
          <BookCta
            label="Get the free report"
            href="/report"
            nudge
            withArrow
          />
        </div>
      </Section>
    </>
  );
}
