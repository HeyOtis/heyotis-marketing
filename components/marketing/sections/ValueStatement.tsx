import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/Container";

export function ValueStatement() {
  return (
    <section className="surface-cream pb-20 sm:pb-28">
      <Container className="text-center">
        <h2 className="mx-auto max-w-4xl font-display text-5xl tracking-tight sm:text-6xl md:text-7xl">
          Why operators choose Heyotis
        </h2>
        <p
          className="mx-auto mt-8 max-w-2xl text-lg text-foreground/70 sm:text-xl"
          data-speakable
        >
          We compress the work of running a multi-site business — forecasting,
          rostering, ordering, payroll — into a single agentic system that
          frees your team to focus on the things people actually came for.
        </p>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="mt-10 rounded-md border-foreground/40 bg-transparent text-foreground hover:bg-foreground/5"
        >
          <Link href="/product">Explore the product</Link>
        </Button>
      </Container>
    </section>
  );
}
