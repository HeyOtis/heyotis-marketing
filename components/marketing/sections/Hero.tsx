import { BookCta } from "@/components/marketing/primitives/BookCta";
import { HeroFold } from "@/components/marketing/sections/HeroLoopTabs";
import { RollingHeadline } from "@/components/marketing/sections/RollingHeadline";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroFold
        intro={
          <div>
            <RollingHeadline className="max-w-2xl font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.12] tracking-[-0.03em] text-balance text-foreground" />

            <p
              className="mt-8 max-w-xl text-xl leading-relaxed text-muted-foreground sm:mt-10"
              data-speakable
            >
              AI search feels unpredictable — and for most brands, it is.
              Otis monitors exactly how each AI platform behaves in your
              category, then turns that intelligence into clear strategy, so
              your team always knows what to do next.{" "}
              <span className="font-medium text-foreground">
                Less uncertainty. More control.
              </span>
            </p>

            <div className="mt-10">
              <BookCta variant="salmon" className="h-13 px-9 text-base" />
              {/* coverage microline — the five assistants, whispered */}
              <p className="label-mono mt-6 text-[0.6rem] text-foreground/35">
                ChatGPT · Claude · Gemini · Perplexity · AI Overviews
              </p>
            </div>
          </div>
        }
      />
    </section>
  );
}
