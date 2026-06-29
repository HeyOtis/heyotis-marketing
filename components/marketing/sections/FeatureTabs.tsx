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

const STEP_MS = 50;

export function FeatureTabs({
  tabs,
  autoRotateMs = 6000,
}: {
  tabs: FeatureTab[];
  autoRotateMs?: number;
}) {
  const [active, setActive] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced || paused || tabs.length <= 1) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + STEP_MS / autoRotateMs;
        if (next >= 1) {
          setActive((a) => (a + 1) % tabs.length);
          return 0;
        }
        return next;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [reduced, paused, autoRotateMs, tabs.length]);

  const select = (i: number) => {
    setActive(i);
    setProgress(0);
  };

  const current = tabs[active];

  return (
    <div
      className="grid gap-8 lg:grid-cols-12 lg:gap-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
              role="tab"
              aria-selected={isActive}
              onClick={() => select(i)}
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
              {isActive && !reduced ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-border/60">
                  <span
                    className="block h-full bg-accent"
                    style={{ width: `${progress * 100}%` }}
                  />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div className="lg:col-span-7" role="tabpanel">
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
