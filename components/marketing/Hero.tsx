import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/Container";

type HeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
};

export function Hero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: HeroProps) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-4xl text-center">
        {eyebrow && (
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          data-speakable
        >
          {description}
        </p>
        {(primaryCta || secondaryCta) && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {primaryCta && (
              <Button asChild size="lg">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            )}
            {secondaryCta && (
              <Button asChild size="lg" variant="outline">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
