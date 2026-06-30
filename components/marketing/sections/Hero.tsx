import { ArrowDown } from "lucide-react";
import { Container } from "@/components/marketing/Container";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { RotatingWord } from "@/components/marketing/primitives/RotatingWord";
import { AiSourceLogos } from "@/components/marketing/visuals/AiSourceLogos";

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
        <p className="label-mono text-accent">AI visibility, measured</p>

        <h1
          className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em] text-foreground"
          style={{ fontStretch: "75%", fontWeight: 800 }}
        >
          See how AI recommends your brand —{" "}
          <span className="text-accent">and the plan to win the answer.</span>
        </h1>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="label-mono text-muted-foreground">Live across</span>
          <RotatingWord
            words={["ChatGPT", "Gemini", "Perplexity", "Claude", "Meta AI", "Mistral"]}
            className="min-w-[6rem] justify-items-start font-semibold text-foreground"
          />
        </p>

        <p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          data-speakable
        >
          HeyOtis tracks your Share of Voice, the citations AI trusts, and where
          competitors get recommended instead — so you know exactly where to
          focus to win the answer.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <BookCta nudge withArrow />
          <a
            href="#product"
            className="group inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            See the platform
            <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
          </a>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4">
          <p className="label-mono text-[0.65rem] text-muted-foreground">
            Benchmarked across
          </p>
          <AiSourceLogos />
        </div>
      </Container>
    </section>
  );
}
