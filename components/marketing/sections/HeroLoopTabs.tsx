"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { EASE } from "@/lib/ease";
import { Container } from "@/components/marketing/Container";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";
import {
  MeasureVignette,
  StrategyVignette,
  ActVignette,
  AttributeVignette,
} from "@/components/marketing/visuals/LoopVignettes";
import { cn } from "@/lib/utils";

/* DOSS-style stage tabs: the four loop stages; the active stage's product
   vignette slides into the panel below. */
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

/* Studio Modular's hero shapes (studiomodular.be) - the exact geometry from
   their build (three adjacent panels: quarter-disc, ellipse, right half-disc),
   all in the brand lavender. One canvas scaled to viewport width, resting
   on the fold's bottom edge. */
/* Fine film grain, inline SVG turbulence - kills gradient banding and gives
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
 * The hero fold: intro copy over the lavender shapes, filling the first
 * viewport (minus the 4rem nav). The loop stages that used to live pinned
 * to the fold now sit in their own `LoopStages` section further down.
 */
export function HeroFold({ intro }: { intro: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] flex-col">
      <Backdrop />
      {/* Solid rule along the shapes' bottom edge, closing the fold. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 border-t border-border/70"
      />
      <Container className="flex flex-1 flex-col pb-8 pt-12 sm:pt-16 lg:pt-20">
        {intro}
      </Container>
    </div>
  );
}

/* One viewport of scroll per stage: the pinned wrapper is this many screens
   tall, so its scrollable distance (height − one pinned viewport) is
   (WRAPPER_SCREENS − 1) screens ≈ one per stage. */
const WRAPPER_SCREENS = TABS.length + 1;

/**
 * The loop, as its own section. On large screens (and when motion is allowed)
 * it renders a scroll-driven pinned stepper: the frame pins to the viewport
 * while the visitor's scroll advances the stages one at a time; past the last
 * stage the frame unpins and the page scrolls on. On small screens or under
 * reduced-motion it falls back to the four stages stacked as ordinary content.
 */
export function LoopStages() {
  const reduced = useIsomorphicReducedMotion();
  const isLgUp = useMediaQuery("(min-width: 1024px)");
  // `useMediaQuery`/reduced-motion both report `false` on the server and first
  // client render, so the stacked path is the hydration-safe default; desktop
  // swaps to the pinned stepper once mounted.
  const pinned = isLgUp && !reduced;

  return (
    <section className="surface-card border-t border-border">
      {pinned ? <PinnedStepper /> : <StackedStages />}
    </section>
  );
}

/* The compact heading carried at the top of the pinned frame (and reused,
   larger, by the stacked fallback). */
function LoopHeading({ compact = false }: { compact?: boolean }) {
  return (
    <SectionHeading
      eyebrow="The loop"
      title="One loop that compounds"
      sub="Each stage feeds the next - and every turn raises how often AI recommends you."
      className={cn("max-w-2xl", compact && "gap-2")}
      titleClassName={compact ? "display-sm" : undefined}
      subClassName={compact ? "text-sm sm:text-base" : undefined}
    />
  );
}

/**
 * Scroll-driven pinned stepper. A tall wrapper provides the scroll distance; a
 * `sticky` inner frame stays pinned to the viewport. `scrollYProgress` (0→1
 * across the wrapper) drives both the active stage and the rail's fill line,
 * so the whole thing rides native scroll - no wheel interception.
 */
function PinnedStepper() {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Map progress into an equal band per stage. Tracking the current index in a
  // ref keeps the direction (up vs down) correct without re-subscribing.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(TABS.length - 1, Math.max(0, Math.floor(p * TABS.length)));
    if (next === activeRef.current) return;
    setDirection(next > activeRef.current ? 1 : -1);
    activeRef.current = next;
    setActive(next);
  });

  // Scroll the page to the middle of stage `i`'s band so the pinned state and
  // the scroll position stay in sync when the rail is clicked or arrowed.
  const goToStage = (i: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const distance = el.offsetHeight - window.innerHeight;
    const top = window.scrollY + el.getBoundingClientRect().top;
    window.scrollTo({
      top: top + ((i + 0.5) / TABS.length) * distance,
      behavior: "smooth",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      (active + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
    goToStage(next);
    tabRefs.current[next]?.focus();
  };

  const { Panel } = TABS[active];

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${WRAPPER_SCREENS * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden">
        <Container className="flex flex-1 flex-col justify-center py-10">
          <LoopHeading compact />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-stretch lg:gap-0">
            {/* Stage rail: boxed items stacked against a left rule, the active
                one shaded (DOSS-style). No progress bar. The rule runs the full
                panel height, so it extends past the last item. */}
            <div
              role="tablist"
              aria-label="The loop, stage by stage"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              // Bleed left to the column rule so the rule is the rail's left
              // edge and the active box fills to it (DOSS-style). A right rule
              // divides the rail from the content, which butts right up to it.
              className="relative -ml-4 border-l border-border/70 sm:-ml-6 lg:-ml-8 lg:border-r"
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
                  onClick={() => goToStage(i)}
                  className={cn(
                    // Text sits at the content edge (aligned with the heading);
                    // the box background still fills back to the rule.
                    "group block w-full cursor-pointer border-b border-border/40 py-5 pl-4 pr-6 text-left transition-colors last:border-b-0 sm:pl-6 lg:pl-8",
                    i === active
                      ? "bg-foreground/[0.045]"
                      : "hover:bg-foreground/[0.02]",
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
                      "mt-1.5 block text-base font-semibold transition-colors",
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

            {/* The active stage's vignette, sliding vertically with scroll. The
                negative right margin bleeds the panel out to the column rule so
                the dashed bands run to the page's right edge. */}
            <div
              id="loop-panel"
              role="tabpanel"
              aria-labelledby={`loop-tab-${TABS[active].key}`}
              className="relative -mr-4 h-[clamp(440px,70vh,700px)] overflow-hidden sm:-mr-6 lg:-mr-8"
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={TABS[active].key}
                  custom={direction}
                  initial={{ opacity: 0, y: 48 * direction }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -48 * direction }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Panel />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

/**
 * Mobile / reduced-motion fallback: every stage rendered in order as ordinary
 * flowing content - number, stage, subline, then its vignette - with normal
 * scroll and no pin or timer.
 */
function StackedStages() {
  return (
    <Container className="py-20 md:py-28">
      <LoopHeading />
      <div className="mt-12 flex flex-col gap-16">
        {TABS.map((tab, i) => {
          const { Panel } = tab;
          return (
            <div key={tab.key}>
              <div className="border-l border-border/60 pl-5">
                <span className="label-mono block text-[0.6rem] text-accent">
                  0{i + 1}
                </span>
                <span className="mt-1.5 block text-base font-semibold text-foreground">
                  {tab.stage}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {tab.rest}
                </span>
              </div>
              <div className="mt-6 h-[520px] overflow-hidden">
                <Panel />
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
