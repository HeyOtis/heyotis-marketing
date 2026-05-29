import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/marketing/Container";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden surface-dark">
      <Container className="relative grid w-full items-stretch gap-10 py-10 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:py-16">
        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full bg-foreground/10 text-primary-foreground border-transparent backdrop-blur">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-coral"
              />
              AI brand intelligence + GEO strategy
            </Badge>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] tracking-tight text-accent">
            Your brand might be
            <br />
            misunderstood by AI —
            <br />
            and you would not know it.
          </h1>

          <p className="mt-6 max-w-xl text-base text-primary-foreground/80 sm:text-lg" data-speakable>
            Consumers now use ChatGPT, Gemini, Perplexity, Claude, Meta AI and
            Mistral to discover, compare and choose products. HeyOtis shows you
            how AI talks about your brand, where competitors are being
            recommended instead, and what to do next.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-md bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/contact">Get your AI brand scorecard</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-md border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
            >
              <Link href="#how-it-works">
                <Play aria-hidden className="size-4 fill-current" />
                See how it works
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <HeroVisual className="h-full lg:-mt-6" />
        </div>
      </Container>
    </section>
  );
}

function HeroVisual({ className }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden rounded-3xl bg-foreground/10 shadow-2xl ring-1 ring-foreground/10 sm:aspect-[5/6] lg:aspect-auto lg:min-h-[28rem] ${className ?? ""}`}
    >
      {/* photo placeholder — replace with real image */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.78 0.09 290) 0%, oklch(0.8 0.09 320) 50%, oklch(0.84 0.1 70) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-overlay opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
          backgroundSize: "32px 32px, 48px 48px",
        }}
      />
      <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur">
        <span className="size-1.5 rounded-full bg-teal" aria-hidden />
        AI brand scorecard
      </span>

      {/* floating metric card */}
      <Card className="absolute bottom-6 left-6 right-6 rounded-2xl border-transparent bg-card/95 p-5 shadow-xl backdrop-blur">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              AI recommendation share
            </p>
            <p className="mt-1 font-display text-4xl tracking-tight text-foreground">
              3.7%
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-lime px-3 py-2 text-sm font-semibold text-lime-foreground">
            <ArrowRight
              aria-hidden
              className="size-3.5 -rotate-45 rounded-full bg-foreground/10 p-0.5"
            />
            <span>+300%</span>
            <span className="text-xs font-medium text-foreground/70">
              vs start
            </span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
          {[
            { label: "ChatGPT", value: "Recommended", tone: "bg-primary" },
            { label: "Gemini", value: "Mentioned", tone: "bg-violet" },
            { label: "Perplexity", value: "Missing", tone: "bg-foreground/40" },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex items-center gap-1.5 text-foreground/70">
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full ${row.tone}`}
                />
                {row.label}
              </div>
              <p className="mt-1 text-foreground/40">{row.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full w-2/3 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--accent) 0%, var(--coral) 60%, oklch(0.85 0.1 70) 100%)",
            }}
          />
        </div>
      </Card>
    </div>
  );
}
