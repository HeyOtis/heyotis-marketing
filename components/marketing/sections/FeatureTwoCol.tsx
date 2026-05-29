import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/marketing/Container";

export function FeatureTwoCol() {
  return (
    <section className="surface-cream py-12 sm:py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <FeatureCard
            title={
              <>
                +300% AI
                <br />
                recommendation share.
              </>
            }
            description="Halenstein started from near-zero presence in Australian AI recommendations. After benchmarking, diagnosing the gaps and improving the signals that mattered, the brand reached 3.7% recommendation share — a 300% increase."
            visual={<ProofVisual />}
          />
          <FeatureCard
            title={
              <>
                See how AI talks
                <br />
                about your brand today.
              </>
            }
            description="Get a scorecard showing where your brand appears, how competitors are being recommended, and what to fix first."
            visual={<CtaVisual />}
          />
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({
  title,
  description,
  visual,
}: {
  title: React.ReactNode;
  description: string;
  visual: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-8 rounded-[2rem] border-transparent bg-card p-8 shadow-none sm:p-10 lg:p-12">
      <header>
        <h3 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h3>
        <p className="mt-5 max-w-md text-base text-foreground/70 sm:text-lg">
          {description}
        </p>
      </header>
      <div className="mt-auto rounded-3xl bg-background p-8 sm:p-12">
        {visual}
      </div>
    </Card>
  );
}

function ProofVisual() {
  const stats: Array<{ value: string; label: string; tone: string }> = [
    { value: "+300%", label: "growth in share", tone: "text-accent" },
    { value: "3.7%", label: "share in Australia", tone: "text-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-card px-5 py-6 shadow-sm"
        >
          <p
            className={`font-display text-4xl tracking-tight sm:text-5xl ${stat.tone}`}
          >
            {stat.value}
          </p>
          <p className="mt-2 text-sm text-foreground/60">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function CtaVisual() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Button
        asChild
        size="lg"
        className="rounded-md bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <Link href="/contact">
          Get your AI brand scorecard
          <ArrowUpRight aria-hidden className="size-4" />
        </Link>
      </Button>
      <p className="text-sm text-foreground/60">
        Tell us your brand, products and key buying moments — the HeyOtis team
        builds your scorecard and shows you what to improve first.
      </p>
    </div>
  );
}
