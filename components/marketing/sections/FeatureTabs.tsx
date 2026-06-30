"use client";

import * as React from "react";
import { useInView } from "motion/react";
import { Check, Pause, Play } from "lucide-react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

export type FeatureTab = {
  id: string;
  label: string;
  title: string;
  blurb: string;
  bullets: string[];
  visual: React.ReactNode;
};

export function FeatureTabs({
  tabs,
  autoRotateMs = 6000,
}: {
  tabs: FeatureTab[];
  autoRotateMs?: number;
}) {
  const [active, setActive] = React.useState(0);
  const [userPaused, setUserPaused] = React.useState(false);
  // Pause on MOUSE hover only while the visitor is over the *content* panel
  // (reading the showcased feature) — NOT when merely mousing over the tab rail,
  // which previously made the bar look frozen.
  const [panelHovered, setPanelHovered] = React.useState(false);
  // Pause when KEYBOARD focus is anywhere inside the widget (WAI-ARIA carousel
  // guidance: rotation stops when focus enters). Gated on :focus-visible so a
  // mouse click on a tab doesn't pause the tour.
  const [keyboardFocus, setKeyboardFocus] = React.useState(false);
  const reduced = useIsomorphicReducedMotion();
  // The tab list is a horizontal scroller on mobile, a vertical column at lg+.
  const isLgUp = useMediaQuery("(min-width: 1024px)");

  // Only auto-rotate while the section is actually on screen — no point burning
  // frames (or advancing tabs nobody can see) when it's scrolled out of view.
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { margin: "0px" });

  const current = tabs[active];
  const autoRotate = !reduced && tabs.length > 1;
  const paused = userPaused || panelHovered || keyboardFocus;

  // Keep the latest `paused` in a ref so the rAF loop reads it without
  // restarting (which would lose elapsed progress).
  const pausedRef = React.useRef(paused);
  React.useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Auto-rotation driven by requestAnimationFrame. We grow the active tab's
  // progress bar by mutating its transform directly (no per-frame re-render),
  // and advance to the next tab once it fills. This is fully self-contained JS:
  // it never depends on a CSS @keyframes surviving the production build, nor on
  // `animationend` firing — the two things that made earlier versions flaky.
  const barRef = React.useRef<HTMLSpanElement | null>(null);
  React.useEffect(() => {
    const bar = barRef.current;
    if (bar) bar.style.transform = "scaleX(0)";
    if (!autoRotate || !inView) return;

    let raf = 0;
    let last: number | null = null;
    let elapsed = 0;

    const tick = (now: number) => {
      if (last === null) last = now;
      const dt = now - last;
      last = now;
      if (!pausedRef.current) {
        elapsed += dt;
        const progress = elapsed < autoRotateMs ? elapsed / autoRotateMs : 1;
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${progress})`;
        }
        if (progress >= 1) {
          setActive((a) => (a + 1) % tabs.length);
          return; // effect re-runs on `active` change, resetting the bar
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, autoRotate, autoRotateMs, tabs.length, inView]);

  // Roving-tabindex keyboard nav for the WAI-ARIA tabs pattern.
  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      next = (active + 1) % tabs.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (active - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`feattab-${tabs[next].id}`)?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="grid gap-8 lg:grid-cols-12 lg:gap-12"
      onFocusCapture={(e) => {
        // Treat as a pause trigger only for keyboard focus (:focus-visible),
        // so a mouse click on a tab doesn't freeze the tour. Fall back to
        // pausing if the browser can't evaluate :focus-visible.
        const t = e.target as HTMLElement;
        let keyboard = true;
        try {
          keyboard = t.matches(":focus-visible");
        } catch {
          keyboard = true;
        }
        if (keyboard) setKeyboardFocus(true);
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setKeyboardFocus(false);
      }}
    >
      {/* Tab list + pause control */}
      <div className="lg:col-span-5">
        <div
          role="tablist"
          aria-label="Features"
          aria-orientation={isLgUp ? "vertical" : "horizontal"}
          onKeyDown={onKeyDown}
          className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0"
        >
          {tabs.map((tab, i) => {
            const isActive = i === active;
            return (
              <button
                key={tab.id}
                id={`feattab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls="feature-tabpanel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "group relative shrink-0 overflow-hidden rounded-xl px-4 py-3 text-left transition-colors lg:shrink",
                  isActive
                    ? "bg-card shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-card/60",
                )}
              >
                <span
                  className={cn(
                    "block text-sm font-semibold lg:text-base",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {tab.label}
                </span>
                <span className="hidden text-sm text-muted-foreground lg:mt-0.5 lg:block">
                  {isActive ? tab.blurb : ""}
                </span>
                {isActive && autoRotate ? (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-border/60">
                    <span
                      ref={barRef}
                      className="block h-full w-full origin-left bg-accent will-change-transform"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {autoRotate ? (
          <button
            type="button"
            onClick={() => setUserPaused((v) => !v)}
            aria-pressed={userPaused}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            {userPaused ? (
              <Play className="size-3.5" />
            ) : (
              <Pause className="size-3.5" />
            )}
            {userPaused ? "Play tour" : "Pause tour"}
          </button>
        ) : null}
      </div>

      {/* Active panel — hovering/focusing here pauses the tour so content
          isn't yanked while the visitor is reading it. */}
      <div
        className="lg:col-span-7"
        role="tabpanel"
        id="feature-tabpanel"
        aria-labelledby={`feattab-${current.id}`}
        tabIndex={0}
        onMouseEnter={() => setPanelHovered(true)}
        onMouseLeave={() => setPanelHovered(false)}
      >
        <div className="mb-5">
          <h3 className="display-sm text-foreground">{current.title}</h3>
          <p className="mt-2 text-muted-foreground">{current.blurb}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {current.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-sm text-foreground/80"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          key={current.id}
          className="animate-in fade-in duration-500 lg:flex lg:min-h-[30rem] lg:flex-col lg:[&>*]:flex-1"
        >
          {current.visual}
        </div>
      </div>
    </div>
  );
}
