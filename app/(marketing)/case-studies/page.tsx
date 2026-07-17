import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/marketing/Container";
import { Section } from "@/components/marketing/primitives/Section";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { HALENSTEIN } from "@/lib/strategy-content";

export const metadata = buildMetadata({
  title: "Case Studies",
  description:
    "Real brands, measured lift in AI recommendation share. Starting with Hallensteins: from near-zero to 3.7% AI recommendation share in Australia.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Case Studies", href: "/case-studies" },
        ])}
      />

      {/* Hero */}
      <section className="surface-cream pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
        <Container>
          <Eyebrow>Case Studies</Eyebrow>
          <h1
            className="mt-5 display-lg max-w-3xl text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            Real brands. Measured lift.
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            No composite logos, no invented testimonials — just the brands
            we&rsquo;ve run through the loop, and what changed in the
            assistants&rsquo; actual answers.
          </p>
        </Container>
      </section>

      {/* Case study grid */}
      <Section surface="cream" className="pt-0">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <Reveal className="h-full">
              <Link
                href="/case-studies/hallensteins"
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-foreground/5"
              >
                <span className="label-mono text-accent">Apparel</span>
                <h2 className="mt-3 font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-accent">
                  Hallensteins
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {HALENSTEIN.lift} AI recommendation share — from near-zero
                  to {HALENSTEIN.shareAfter} in {HALENSTEIN.market}.
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  Read the full story
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </Reveal>
          </li>
        </ul>

        <Reveal delay={0.08}>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            We&rsquo;re writing up more of these as campaigns complete and
            results are confirmed — this list will grow. If you want to see
            what your own brand&rsquo;s numbers look like in the meantime,
            start with the{" "}
            <Link
              href="/report"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              free AI Visibility Report
            </Link>
            .
          </p>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  );
}
