"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { LOG_LINES, type LogLine } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

const VISIBLE = 6;
const TICK_MS = 2200;

/* Monotonic clock: the feed loops through LOG_LINES, so stored times would
   rewind on wrap — derive each line's time from its position instead. */
const BASE_SECONDS = 9 * 3600 + 41 * 60 + 7; // 09:41:07
function timeAt(i: number) {
  const t = BASE_SECONDS + i * 47;
  const h = Math.floor(t / 3600) % 24;
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function tagTone(kind: LogLine["kind"]) {
  switch (kind) {
    case "bot":
      return "text-[oklch(0.78_0.09_280)]";
    case "referral":
      return "text-[oklch(0.8_0.12_160)]";
    case "session":
      return "text-[oklch(0.85_0.09_85)]";
  }
}

/**
 * Terminal-style ingest feed: crawler hits, assistant referrals and the
 * sessions they become, ticking upward while in view. Illustrative lines that
 * mirror the product's real log ingestion. Reduced motion / off-screen: a
 * static window of lines.
 */
export function BotLogFeed({ className }: { className?: string }) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const [count, setCount] = React.useState(VISIBLE);

  React.useEffect(() => {
    if (reduced || !inView) return;
    const id = setInterval(() => setCount((c) => c + 1), TICK_MS);
    return () => clearInterval(id);
  }, [reduced, inView]);

  const start = Math.max(0, count - VISIBLE);
  const lines: (LogLine & { key: number })[] = [];
  for (let i = start; i < count; i++) {
    lines.push({ ...LOG_LINES[i % LOG_LINES.length], key: i });
  }

  return (
    <div ref={ref} className={className}>
      <div
        aria-hidden
        className="overflow-hidden rounded-2xl border border-border bg-surface-dark text-surface-dark-foreground shadow-lg"
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="ml-2 font-mono text-[0.65rem] text-surface-dark-foreground/60">
            otis-ingest · access.log
          </span>
        </div>
        {/* overflow-hidden: transient enter/exit states must never paint
            over the window-chrome row above. */}
        <div className="flex h-[216px] flex-col justify-end gap-1 overflow-hidden px-4 py-3 font-mono text-[0.7rem] leading-relaxed sm:text-xs">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.p
                key={l.key}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex gap-2 whitespace-nowrap"
              >
                <span className="text-surface-dark-foreground/35">{timeAt(l.key)}</span>
                <span className={cn("font-semibold", tagTone(l.kind))}>{l.tag}</span>
                <span className="min-w-0 truncate text-surface-dark-foreground/70">{l.text}</span>
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <p className="label-mono mt-3 text-[0.6rem] text-muted-foreground">
        Illustrative — mirrors the product&apos;s log ingestion
      </p>
    </div>
  );
}
