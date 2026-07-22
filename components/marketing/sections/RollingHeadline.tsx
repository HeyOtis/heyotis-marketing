"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { EASE } from "@/lib/ease";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";

/* Framer-style "text roll" scoped to the payoff line. Each glyph of
   "Prove it moved." sits in a clipped box over an identical twin; hovering
   the phrase rolls each glyph to its twin - but alternating letters roll in
   opposite directions (up, down, up…) at slightly different speeds, so the
   line reads like tumblers settling rather than a single clean sweep. */

const LEAD = "AI search has an opinion about your brand. ";
const ROLL = "Here’s how to shape it.";

/* Per-glyph cascade offset, and a short cycle of durations so no two adjacent
   letters roll at exactly the same speed. */
const STEP = 0.036;
const DURATIONS = [0.54, 0.7, 0.6, 0.76, 0.58];

type CharCustom = { i: number; dir: "up" | "down"; dur: number };

const charVariants: Variants = {
  // Resting state doubles as the settle target for both the load-in roll and
  // the return from hover, so it cascades too (per-glyph delay + varied speed).
  rest: (c: CharCustom) => ({
    y: "0%",
    transition: { delay: c.i * STEP, duration: c.dur, ease: EASE },
  }),
  rolled: (c: CharCustom) => ({
    y: c.dir === "up" ? "-100%" : "100%",
    transition: { delay: c.i * STEP, duration: c.dur, ease: EASE },
  }),
};

export function RollingHeadline({ className }: { className?: string }) {
  const reduced = useIsomorphicReducedMotion();

  // No roll under reduced motion - plain, static headline.
  if (reduced) {
    return <h1 className={className}>{LEAD + ROLL}</h1>;
  }

  const words = ROLL.split(" ");
  let index = 0; // running glyph index across the rolling phrase

  return (
    <h1 className={className}>
      {LEAD}
      {/* Only this phrase rolls: it tumbles in once on load (rolled → rest),
          then hover re-triggers it. aria-label gives AT one clean read of the
          phrase - the split glyphs are decorative twins. */}
      <motion.span
        aria-label={ROLL}
        initial="rolled"
        animate="rest"
        whileHover="rolled"
      >
        <span aria-hidden="true">
          {words.map((word, wi) => (
            <React.Fragment key={wi}>
              <span className="inline-block whitespace-nowrap">
                {[...word].map((ch, ci) => {
                  const i = index++;
                  const dir: CharCustom["dir"] = i % 2 === 0 ? "up" : "down";
                  const dur = DURATIONS[i % DURATIONS.length];
                  return (
                    <span
                      key={ci}
                      className="relative inline-block overflow-hidden"
                      style={{ verticalAlign: "bottom" }}
                    >
                      <motion.span
                        className="inline-block"
                        custom={{ i, dir, dur }}
                        variants={charVariants}
                      >
                        <span className="block">{ch}</span>
                        <span
                          className={
                            dir === "up"
                              ? "absolute left-0 top-full block"
                              : "absolute bottom-full left-0 block"
                          }
                        >
                          {ch}
                        </span>
                      </motion.span>
                    </span>
                  );
                })}
              </span>
              {/* breakable space between words so the phrase can still wrap */}
              {wi < words.length - 1 ? " " : null}
            </React.Fragment>
          ))}
        </span>
      </motion.span>
    </h1>
  );
}
