import { ArrowDown } from "lucide-react";
import { Container } from "@/components/marketing/Container";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { AI_SOURCES } from "@/components/marketing/visuals/AiSourceLogos";
import { Marquee } from "@/components/ui/marquee";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background: faded grid + soft purple glow (pure CSS — LCP-safe). */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.24 0.02 285 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.24 0.02 285 / 0.045) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 95% 65% at 50% 0%, black 40%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 95% 65% at 50% 0%, black 40%, transparent 82%)",
          }}
        />
        <div
          className="absolute left-1/2 top-[-12%] h-[460px] w-[min(760px,90vw)] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.68 0.1 280 / 0.20), transparent)",
          }}
        />
      </div>

      <Container className="relative flex flex-col items-center pb-16 pt-20 text-center sm:pt-28 lg:pb-24 lg:pt-32">
        <p className="label-mono text-accent">The Strategy Engine for AI search</p>

        <h1
          className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em] text-foreground"
          style={{ fontStretch: "75%", fontWeight: 800 }}
        >
          See how AI recommends you. Fix what doesn&rsquo;t.{" "}
          <span className="text-accent">Prove it moved.</span>
        </h1>

        <p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          data-speakable
        >
          HeyOtis measures how ChatGPT, Gemini, Perplexity and Claude
          recommend your brand, finds the moves that grow your share, watches
          the work land, and measures the lift. A closed loop — not another
          dashboard.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <BookCta nudge withArrow />
          <a
            href="#loop"
            className="group inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            See how the loop works
            <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        </div>

        <div className="mt-14 flex w-full flex-col items-center gap-4">
          <p className="label-mono text-[0.65rem] text-muted-foreground">
            Monitored across:
          </p>
          {/* Reduced motion: the CSS pauses the track, leaving a static row. */}
          <Marquee
            pauseOnHover
            className="max-w-2xl [--duration:32s] [--gap:2.5rem] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          >
            {AI_SOURCES.map(({ key, name, Icon }) => (
              <span
                key={key}
                className="flex items-center gap-2 text-foreground/75"
              >
                <Icon size={24} />
                <span className="text-sm font-medium tracking-tight">
                  {name}
                </span>
              </span>
            ))}
          </Marquee>
        </div>
      </Container>
    </section>
  );
}
