"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { useReducedMotion } from "motion/react";
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
  const [paused, setPaused] = React.useState(false);
  const reduced = useReducedMotion();

  const current = tabs[active];
  // Auto-rotation is purely CSS-animation driven: the active tab's progress bar
  // scales 0→1 over `autoRotateMs`, and we advance on `animationend`. A paused
  // animation never fires `animationend`, so hover/focus pause is exact.
  const autoRotate = !reduced && tabs.length > 1;
  const advance = () => setActive((a) => (a + 1) % tabs.length);

  return (
    <div
      className="grid gap-8 lg:grid-cols-12 lg:gap-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Features"
        className="flex gap-2 overflow-x-auto pb-2 lg:col-span-5 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0"
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
                    key={active}
                    onAnimationEnd={advance}
                    className="block h-full w-full origin-left bg-accent animate-tab-progress will-change-transform"
                    style={
                      {
                        "--tab-ms": `${autoRotateMs}ms`,
                        animationPlayState: paused ? "paused" : "running",
                      } as React.CSSProperties
                    }
                  />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div
        className="lg:col-span-7"
        role="tabpanel"
        id="feature-tabpanel"
        aria-labelledby={`feattab-${current.id}`}
        tabIndex={0}
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
        <div key={current.id} className="animate-in fade-in duration-500">
          {current.visual}
        </div>
      </div>
    </div>
  );
}
