"use client";

import * as React from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Container } from "@/components/marketing/Container";
import {
  MeasureVignette,
  StrategyVignette,
  ActVignette,
  AttributeVignette,
} from "@/components/marketing/visuals/LoopVignettes";
import { cn } from "@/lib/utils";

/* DOSS-style stage tabs: the four loop stages; the active stage's product
   vignette slides into the panel below the fold. */
const TABS = [
  {
    key: "measure",
    stage: "Measure",
    rest: "your recommendation share",
    Panel: MeasureVignette,
  },
  {
    key: "strategy",
    stage: "Strategy",
    rest: "the moves that grow it",
    Panel: StrategyVignette,
  },
  {
    key: "act",
    stage: "Act",
    rest: "watch the work land",
    Panel: ActVignette,
  },
  {
    key: "attribute",
    stage: "Attribute",
    rest: "the lift, with receipts",
    Panel: AttributeVignette,
  },
] as const;

/* Studio Modular's hero shapes (studiomodular.be) — the exact geometry from
   their build (three adjacent panels: quarter-disc, ellipse, right half-disc),
   all in the brand lavender. One canvas scaled to viewport width, resting
   on the fold's bottom edge. */
/* Fine film grain, inline SVG turbulence — kills gradient banding and gives
   the shapes a printed feel. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Backdrop() {
  const reduced = useIsomorphicReducedMotion();
  const { scrollY } = useScroll();
  // Shapes recede a touch slower than the page scrolls.
  const y = useTransform(scrollY, [0, 900], [0, 70]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <motion.svg
        style={reduced ? undefined : { y }}
        className="absolute bottom-0 left-0 aspect-[1920/770] w-full"
        viewBox="0 0 1920 770"
        fill="none"
      >
        <ellipse
          cx="1151"
          cy="385.5"
          rx="385"
          ry="384.5"
          fill="url(#hero-shape-lavender)"
        />
        <path
          d="M766 0C342.974 0 0 344.317 0 769L766 769Z"
          fill="url(#hero-shape-lavender-left)"
        />
        <path
          d="M1921 385.5C1921 173.147 1749.08 1 1537 1L1537 770C1749.08 770 1921 597.854 1921 385.5Z"
          fill="url(#hero-shape-lavender-right)"
        />
        <defs>
          <linearGradient
            id="hero-shape-lavender"
            x1="865.726"
            y1="-84.9263"
            x2="1556.97"
            y2="665.871"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#CBC6EF" />
            <stop offset="1" stopColor="#F7F4ED" />
          </linearGradient>
          <linearGradient
            id="hero-shape-lavender-left"
            x1="70.9214"
            y1="741.352"
            x2="783.768"
            y2="113.989"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#CBC6EF" />
            <stop offset="1" stopColor="#F7F4ED" />
          </linearGradient>
          <linearGradient
            id="hero-shape-lavender-right"
            x1="1921"
            y1="385.5"
            x2="1537"
            y2="385.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#CBC6EF" />
            <stop offset="1" stopColor="#F7F4ED" />
          </linearGradient>
        </defs>
      </motion.svg>
      {/* film grain over the whole fold */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
}

/**
 * The hero fold: intro copy up top, the stage tabs pinned to the bottom of
 * the first viewport (DOSS-style — the tabs are the last thing you see
 * before scrolling), and the active stage's panel below the fold.
 */
export function HeroFold({ intro }: { intro: React.ReactNode }) {
  const reduced = useIsomorphicReducedMotion();
  const [active, setActive] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      (active + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  const { Panel } = TABS[active];

  return (
    <>
      {/* The fold: full first viewport (minus the 4rem nav). */}
      <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col">
        <Backdrop />
        {/* Horizontal rules echoing the vertical pair: dashed through the
            tab underlines, solid along the shapes' bottom edge, and a
            mirrored dashed rule the same distance below the fold. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-8 border-t border-dashed border-border/50"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 border-t border-border/70"
        />
        <Container className="flex flex-1 flex-col pb-8 pt-12 sm:pt-16 lg:pt-20">
          {intro}

          <div
            role="tablist"
            aria-label="The loop, stage by stage"
            onKeyDown={onKeyDown}
            className="mt-auto grid grid-cols-2 gap-x-8 gap-y-6 rounded-2xl bg-white/50 p-5 ring-1 ring-white/60 backdrop-blur-md sm:p-6 lg:grid-cols-4"
          >
            {TABS.map((tab, i) => (
              <button
                key={tab.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`loop-tab-${tab.key}`}
                aria-selected={i === active}
                aria-controls="loop-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i)}
                className={cn(
                  "group cursor-pointer border-b-2 pb-3.5 text-left transition-colors",
                  i === active
                    ? "border-foreground"
                    : "border-foreground/15 hover:border-foreground/40",
                )}
              >
                <span
                  className={cn(
                    "label-mono block text-[0.6rem] transition-colors",
                    i === active ? "text-accent" : "text-foreground/35",
                  )}
                >
                  0{i + 1}
                </span>
                <span
                  className={cn(
                    "mt-1.5 block text-sm font-semibold transition-colors",
                    i === active
                      ? "text-foreground"
                      : "text-foreground/55 group-hover:text-foreground/80",
                  )}
                >
                  {tab.stage}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-sm transition-colors",
                    i === active
                      ? "text-muted-foreground"
                      : "text-foreground/40",
                  )}
                >
                  {tab.rest}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* Below the fold: the active stage's panel on a full-bleed white
          band running solid line to solid line. The dashed rule sits
          exactly at the vignette frame's top edge, so frame and rule read
          as one continuous line. */}
      <div className="relative bg-card">
        <div
          aria-hidden
          className="absolute inset-x-0 top-8 border-t border-dashed border-border/50"
        />
        <Container className="pb-20 pt-8">
        <div
          id="loop-panel"
          role="tabpanel"
          aria-labelledby={`loop-tab-${TABS[active].key}`}
          className="relative h-[560px] overflow-hidden sm:h-[540px]"
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={TABS[active].key}
              custom={direction}
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, x: 72 * direction }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                reduced ? { opacity: 0 } : { opacity: 0, x: -72 * direction }
              }
              transition={{ duration: 0.45, ease: EASE }}
              className="absolute inset-0"
            >
              <Panel />
            </motion.div>
          </AnimatePresence>
          </div>
        </Container>
      </div>
    </>
  );
}
