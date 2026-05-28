import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
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
              Built for modern operators
            </Badge>
            <Badge variant="outline" className="border-foreground/15 text-primary-foreground">
              <Star
                aria-hidden
                className="size-3 fill-lime text-lime"
              />
              <span className="text-primary-foreground">4.8 average</span>
            </Badge>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,6.5vw,5.75rem)] leading-[0.92] tracking-tight text-accent">
            The operating
            <br />
            system for
            <br />
            growth.
          </h1>

          <p className="mt-6 max-w-xl text-base text-primary-foreground/80 sm:text-lg" data-speakable>
            Heyotis is the agentic AI platform that predicts demand, plans your
            people, runs the back-office, and keeps your P&L on track —
            autonomously, across every location.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-md bg-background text-foreground hover:bg-background/90"
            >
              <Link href="/contact">Book a chat</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-md border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-foreground"
            >
              <Link href="/product">
                <Play aria-hidden className="size-4 fill-current" />
                Watch product tour
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
            "linear-gradient(135deg, oklch(0.32 0.06 295) 0%, oklch(0.22 0.1 290) 50%, oklch(0.18 0.12 280) 100%)",
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
        Workforce Management
      </span>

      {/* floating metric card */}
      <Card className="absolute bottom-6 left-6 right-6 rounded-2xl border-transparent bg-card/95 p-5 shadow-xl backdrop-blur">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Cost of labour</p>
            <p className="mt-1 font-display text-4xl tracking-tight text-foreground">
              £17,213
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-lime px-3 py-2 text-sm font-semibold text-lime-foreground">
            <ArrowRight
              aria-hidden
              className="size-3.5 -rotate-45 rounded-full bg-foreground/10 p-0.5"
            />
            <span>0%</span>
            <span className="text-xs font-medium text-foreground/70">
              vs forecast
            </span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
          {[
            { label: "Management", tone: "bg-primary" },
            { label: "Front of house", tone: "bg-violet" },
            { label: "Back of house", tone: "bg-foreground/40" },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex items-center gap-1.5 text-foreground/70">
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full ${row.tone}`}
                />
                {row.label}
              </div>
              <p className="mt-1 text-foreground/40">0%</p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full w-2/3 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--primary) 0%, var(--violet) 60%, oklch(0.85 0.05 295) 100%)",
            }}
          />
        </div>
      </Card>
    </div>
  );
}
