import { Container } from "@/components/marketing/Container";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { cn } from "@/lib/utils";

type CtaBandProps = {
  eyebrow?: string;
  title?: React.ReactNode;
  sub?: string;
  /** Secondary action — defaults to a "See a sample report" link. */
  secondary?: { label: string; href: string } | null;
  className?: string;
};

export function CtaBand({
  eyebrow = "Get started",
  title = (
    <>
      See how AI recommends
      <br className="hidden sm:block" /> your brand today.
    </>
  ),
  sub = "Book a 20-minute walkthrough. We'll run your brand against ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral and show you the gaps.",
  secondary = { label: "Explore the platform", href: "/features" },
  className,
}: CtaBandProps) {
  return (
    <section className={cn("surface-dark relative overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(40rem 22rem at 50% -10%, oklch(0.68 0.1 280 / 0.35), transparent 70%)",
        }}
      />
      <Container className="relative py-20 text-center md:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <Eyebrow className="text-brand-soft">{eyebrow}</Eyebrow>
          <h2
            className="display-md text-balance text-surface-dark-foreground"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </h2>
          <p className="max-w-xl text-lg text-surface-dark-foreground/70">
            {sub}
          </p>
          <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row">
            <BookCta variant="inverse" nudge withArrow />
            {secondary ? (
              <a
                href={secondary.href}
                className="text-sm font-medium text-surface-dark-foreground/80 underline-offset-4 transition-colors hover:text-surface-dark-foreground hover:underline"
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
