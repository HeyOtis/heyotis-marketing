"use client";

import * as React from "react";
import { Crosshair } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Section } from "@/components/marketing/primitives/Section";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { Stage, BannerTile } from "@/components/marketing/primitives/stage";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

const TICK_MS = 2800;

/* Daylyte's real, cleared measurement data - figures current as of 3 July 2026.
   Headline figure, blurb, and the four result tiles on the stage live here. */
const STORY = {
  headline: "From 0% to 65% AI visibility in two weeks",
  blurb:
    "Daylyte - a UK hydration brand with no agency and no ad budget - went from unmentioned in ChatGPT to the single most-recommended brand in its category, guided by exactly what HeyOtis showed them to fix.",
  storyHref: "/case-studies/daylyte",
} as const;

/* Quiet product chips - the vignette grammar, not candy. Salmon carries the
   delta (same treatment as the Attribute lift chip); neutral for labels. */
function DeltaChip({
  tone = "salmon",
  children,
}: {
  tone?: "salmon" | "neutral";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.65rem] font-medium leading-none tracking-tight",
        tone === "salmon" ? "bg-salmon text-foreground" : "bg-secondary text-foreground/70",
      )}
    >
      {children}
    </span>
  );
}

function Up() {
  return (
    <span aria-hidden className="text-[0.5rem]">
      ▲
    </span>
  );
}

/* One Daylyte result per beat, framed as a before→after delta. */
const TILES = [
  {
    key: "visibility",
    cap: "AI visibility · ChatGPT",
    render: (live: boolean) => (
      <>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            {live ? <NumberTicker value={65} startValue={0} /> : "65"}%
          </span>
          <DeltaChip>
            <Up />
            65 pts
          </DeltaChip>
        </div>
        <Sparkline heights={[0, 4, 6, 12, 30, 48, 88]} live={live} />
      </>
    ),
  },
  {
    key: "rank",
    cap: "Rank in category",
    render: () => (
      <>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            #1
          </span>
          <DeltaChip>
            <Up />
            from unranked
          </DeltaChip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Ahead of VITHIT, HYCO &amp; Myprotein
        </p>
      </>
    ),
  },
  {
    key: "citations",
    cap: "Times their site was cited",
    render: () => (
      <>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            53
          </span>
          <DeltaChip>
            <Up />
            from 1
          </DeltaChip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Nine new answer-shaped pages, indexed
        </p>
      </>
    ),
  },
  {
    key: "sentiment",
    cap: "Answer sentiment",
    render: () => (
      <>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            88%
          </span>
          <DeltaChip tone="neutral">positive</DeltaChip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Top-3 in 55% of tracked questions
        </p>
      </>
    ),
  },
] as const;

/* A climbing area-line sparkline - the recovery arc, not disconnected bars.
   Periwinkle stroke over a soft gradient fill, drawn left→right on reveal,
   with a single emphasised endpoint. viewBox stretches to fit; the stroke
   stays a crisp, uniform 1.75px via non-scaling-stroke. */
function Sparkline({ heights, live }: { heights: number[]; live: boolean }) {
  const VB_H = 40;
  const n = heights.length;
  const max = Math.max(...heights, 1);
  const x = (i: number) => (i / (n - 1)) * 100;
  const y = (v: number) => 6 + (1 - v / max) * (VB_H - 8); // 6px top pad → 38px floor

  const line = heights.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" L ");
  const linePath = `M ${line}`;
  const areaPath = `${linePath} L 100,${VB_H} L 0,${VB_H} Z`;
  const lastY = y(heights[n - 1]);

  return (
    <div aria-hidden className="relative mt-3 h-11 w-full">
      <motion.div
        className="h-full w-full"
        initial={{ clipPath: live ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.95, ease: EASE }}
      >
        <svg
          viewBox={`0 0 100 ${VB_H}`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--periwinkle)" stopOpacity="0.24" />
              <stop offset="100%" stopColor="var(--periwinkle)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#spark-fill)" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--periwinkle)"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </motion.div>
      {/* hairline floor */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 border-b border-border/70" />
      {/* endpoint marker */}
      <motion.span
        className="absolute size-2 rounded-full bg-periwinkle ring-2 ring-card"
        style={{
          left: "100%",
          top: `${(lastY / VB_H) * 100}%`,
          marginLeft: -4,
          marginTop: -4,
        }}
        initial={{ scale: live ? 0 : 1, opacity: live ? 0 : 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: live ? 0.85 : 0, ease: EASE }}
      />
    </div>
  );
}

function MetricTile({ tile, live }: { tile: (typeof TILES)[number]; live: boolean }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-4">
      <p className="label-mono text-[0.6rem] text-muted-foreground">{tile.cap}</p>
      <div className="mt-1.5">{tile.render(live)}</div>
    </div>
  );
}

/**
 * Daylyte customer case study, styled as a Nory-style card: case-study framing
 * on the left, beige stage on the right showing Daylyte's real result numbers
 * on a slow vertical reel of metric tiles.
 * Reduced motion / off-screen: static first two tiles, no timers.
 */
export function CaseStudyDaylyte() {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const playing = !reduced && inView;

  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setIdx((i) => i + 1), TICK_MS);
    return () => clearInterval(id);
  }, [playing]);

  /* Window of two tiles; the reel advances one tile per tick. */
  const visible = [idx, idx + 1].map((k) => ({
    key: k,
    tile: TILES[k % TILES.length],
  }));

  return (
    <Section surface="cream" id="product" className="overflow-x-clip">
      <div className="relative">
        {/* Blueprint rules: full-width dashed horizontals aligned to the card's
            top and bottom edges (matches the pillar cards). */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[-50vw] top-0 border-t border-dashed border-border/60"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[-50vw] bottom-0 border-t border-dashed border-border/60"
        />
        <div
          ref={ref}
          className="relative grid items-center gap-10 rounded-lg border border-border bg-card px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-16 lg:py-24"
        >
        <div>
          <Eyebrow>Case study</Eyebrow>
          <h2 className="mt-4 max-w-md text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {STORY.headline}
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">{STORY.blurb}</p>
          <a
            href={STORY.storyHref}
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Read the Daylyte story →
          </a>
        </div>

        <div aria-hidden>
          <Stage className="flex items-center justify-center px-6 py-10 sm:px-10 sm:py-14">
            <div className="w-full max-w-[24rem]">
              <BannerTile icon={Crosshair} label="Daylyte · UK" right="Case study" />
              {reduced ? (
                <div className="mt-3 flex flex-col gap-3">
                  <MetricTile tile={TILES[0]} live={false} />
                  <MetricTile tile={TILES[1]} live={false} />
                </div>
              ) : (
                <div className="relative mt-3 h-[264px] overflow-hidden">
                  <AnimatePresence initial={false} mode="popLayout">
                    {visible.map(({ key, tile }) => (
                      <motion.div
                        key={key}
                        layout
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -28 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="mb-3"
                      >
                        <MetricTile tile={tile} live={playing} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-stage to-transparent" />
                </div>
              )}
            </div>
          </Stage>
        </div>
        </div>
      </div>
    </Section>
  );
}
