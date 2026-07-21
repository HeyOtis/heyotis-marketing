import { BookCta } from "@/components/marketing/primitives/BookCta";
import { HeroFold } from "@/components/marketing/sections/HeroLoopTabs";
import { RollingHeadline } from "@/components/marketing/sections/RollingHeadline";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroFold
        intro={
          <div>
            <RollingHeadline className="max-w-2xl font-display text-[clamp(2.2rem,4vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.03em] text-balance text-foreground" />

            <p
              className="mt-8 max-w-xl text-xl leading-relaxed text-muted-foreground sm:mt-10"
              data-speakable
            >
              HeyOtis measures how ChatGPT, Claude, Gemini, Perplexity and
              Google AI Overviews recommend your brand, finds the moves that
              grow your share, watches the work land, and measures the lift. A
              closed loop — not another dashboard.
            </p>

            <div className="mt-10">
              <BookCta variant="salmon" className="h-13 px-9 text-base" />
            </div>
          </div>
        }
      />
    </section>
  );
}
