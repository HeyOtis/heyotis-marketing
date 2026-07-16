"use client";

import * as React from "react";

/* Spec easing: confident, no bounce. Shared by orchestrator and vignettes. */
export const EASE = [0.32, 0.72, 0, 1] as const;

/* Placeholder scenes — replaced stage by stage in follow-up tasks. */
function makePlaceholder(verb: string, title: string) {
  return function PlaceholderVignette() {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 p-3 text-center">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          {verb}
        </p>
        <p className="text-[0.6rem] text-muted-foreground">{title}</p>
      </div>
    );
  };
}

/**
 * One micro-scene per loop stage, keyed by LOOP_STAGES id. Each component
 * takes no props, plays on mount, and must clear its own timers on unmount
 * (the orchestrator mounts/unmounts vignettes via AnimatePresence).
 */
export const VIGNETTES: Record<string, React.ComponentType> = {
  define: makePlaceholder("Define", "Scope the campaign"),
  measure: makePlaceholder("Measure", "See how AI answers"),
  diagnose: makePlaceholder("Diagnose", "Find the weak signals"),
  prioritize: makePlaceholder("Prioritize", "Rank the moves"),
  verify: makePlaceholder("Verify", "Confirm it shipped"),
  prove: makePlaceholder("Prove", "Measure the lift"),
};
