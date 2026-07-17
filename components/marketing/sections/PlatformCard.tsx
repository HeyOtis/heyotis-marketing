"use client";

import * as React from "react";
import { Crosshair } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Section } from "@/components/marketing/primitives/Section";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { Stage, BannerTile, Chip } from "@/components/marketing/primitives/stage";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

const TICK_MS = 2800;

/* One believable AEO metric tile per beat. Values echo the site's existing
   sample story (34.8% visibility, +96% referrals, 1.4→4.9 attribution). */
const TILES = [
  {
    key: "visibility",
    cap: "AI visibility",
    render: (live: boolean) => (
      <>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {live ? <NumberTicker value={34.8} startValue={20} decimalPlaces={1} /> : "34.8"}
            %
          </span>
          <Chip tone="lime">▲ 12.4 pts</Chip>
        </div>
        <Bars heights={[30, 38, 42, 47, 58, 66, 84]} live={live} />
      </>
    ),
  },
  {
    key: "sentiment",
    cap: "Answer sentiment",
    render: () => (
      <>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            +0.62
          </span>
          <Chip tone="lime">▲ 0.08</Chip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          &ldquo;a reliable, well-priced choice&rdquo; — ChatGPT, this week
        </p>
      </>
    ),
  },
  {
    key: "citations",
    cap: "Citations won",
    render: () => (
      <>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            41
          </span>
          <Chip tone="salmon">▼ 2 this week</Chip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Top source: your pricing page · 14 answers
        </p>
      </>
    ),
  },
  {
    key: "traffic",
    cap: "AI referral sessions",
    render: () => (
      <>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            +96%
          </span>
          <Chip tone="lime">30-day window</Chip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          chatgpt.com +128% · perplexity.ai +64%
        </p>
      </>
    ),
  },
] as const;

function Bars({ heights, live }: { heights: number[]; live: boolean }) {
  return (
    <div aria-hidden className="mt-2 flex h-9 items-end gap-1">
      {heights.map((h, i) =>
        live ? (
          <motion.span
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: EASE }}
            style={{ height: `${h}%` }}
            className={cn(
              "w-2.5 origin-bottom rounded-t",
              i === heights.length - 1 ? "bg-brand" : "bg-periwinkle/60",
            )}
          />
        ) : (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={cn(
              "w-2.5 origin-bottom rounded-t",
              i === heights.length - 1 ? "bg-brand" : "bg-periwinkle/60",
            )}
          />
        ),
      )}
    </div>
  );
}

function MetricTile({ tile, live }: { tile: (typeof TILES)[number]; live: boolean }) {
  return (
    <div className="rounded-xl bg-card p-4">
      <p className="label-mono text-[0.6rem] text-muted-foreground">{tile.cap}</p>
      <div className="mt-1.5">{tile.render(live)}</div>
    </div>
  );
}

/**
 * "The platform" as a Nory-style card: text left, beige stage right with a
 * periwinkle campaign banner and a slow vertical reel of AEO metric tiles.
 * Reduced motion / off-screen: static first two tiles, no timers.
 */
export function PlatformCard() {
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
    <Section surface="cream" id="product">
      <div
        ref={ref}
        className="grid items-center gap-10 rounded-xl bg-card p-6 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16"
      >
        <div>
          <Eyebrow>The platform</Eyebrow>
          <h2 className="display-md mt-4 max-w-md text-balance text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Your brand&rsquo;s standing in AI search, in one place
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Visibility, sentiment, citations and the traffic AI sends you —
            measured across every assistant, moving in one direction.
          </p>
          <a
            href="/features"
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Tour the platform →
          </a>
        </div>

        <div aria-hidden>
          <Stage>
            <BannerTile icon={Crosshair} label="Everyday range · NZ" right="Sample" />
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
          </Stage>
        </div>
      </div>
    </Section>
  );
}
