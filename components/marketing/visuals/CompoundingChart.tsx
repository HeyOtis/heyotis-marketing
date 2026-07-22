"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { COMPOUNDING_POINTS } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/* Geometry: viewBox 560×240, y-scale 0-6% */
const W = 560;
const H = 240;
const PL = 44;
const PR = 16;
const PT = 24;
const PB = 36;
const Y_MAX = 6;
const px = (i: number) =>
  PL + (i * (W - PL - PR)) / (COMPOUNDING_POINTS.length - 1);
const py = (share: number) => PT + (H - PT - PB) * (1 - share / Y_MAX);

/**
 * Recommendation share stepping up across campaign cycles - the visible shape
 * of the feedback loop. Stepped single-series line per the dataviz specs;
 * illustrative numbers, real mechanism. The SVG is decorative; the sr-only
 * list carries the values.
 */
export function CompoundingChart({ className }: { className?: string }) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const pts = COMPOUNDING_POINTS;
  const last = pts.length - 1;
  const stepD = pts
    .map((p, i) =>
      i === 0 ? `M ${px(0)} ${py(p.share)}` : `H ${px(i)} V ${py(p.share)}`,
    )
    .join(" ");
  const areaD = `${stepD} V ${py(0)} H ${px(0)} Z`;

  return (
    <div
      ref={ref}
      className={cn("rounded-2xl border border-border bg-card p-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            The compounding loop
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
            Recommendation share, by campaign cycle
          </h3>
        </div>
        <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-accent">
          Sample
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" aria-hidden>
        {[0, 2, 4, 6].map((v) => (
          <g key={v}>
            <line
              x1={PL}
              x2={W - PR}
              y1={py(v)}
              y2={py(v)}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x={PL - 8}
              y={py(v) + 3}
              textAnchor="end"
              fontSize="10"
              className="font-mono"
              fill="var(--muted-foreground)"
            >
              {v}%
            </text>
          </g>
        ))}

        <path d={areaD} fill="var(--brand-strong)" opacity={0.08} />
        {reduced ? (
          <path
            d={stepD}
            fill="none"
            stroke="var(--brand-strong)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : (
          <motion.path
            d={stepD}
            fill="none"
            stroke="var(--brand-strong)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}

        {pts.map((p, i) => {
          const cx = px(i);
          const cy = py(p.share);
          const tx = Math.min(Math.max(cx - 78, 8), W - 164);
          return (
            <g key={p.cycle} className="group">
              <circle cx={cx} cy={cy} r="14" fill="transparent" />
              <circle
                cx={cx}
                cy={cy}
                r="4.5"
                fill="var(--brand-strong)"
                stroke="var(--card)"
                strokeWidth="2"
              />
              <g className="pointer-events-none opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <rect
                  x={tx}
                  y={cy - 46}
                  width="156"
                  height="34"
                  rx="8"
                  fill="var(--surface-dark)"
                />
                <text x={tx + 10} y={cy - 32} fontSize="10" fontWeight="600" fill="var(--surface-dark-foreground)">
                  {p.share}% · {p.cycle}
                </text>
                <text x={tx + 10} y={cy - 19} fontSize="9" fill="var(--surface-dark-foreground)" opacity="0.7">
                  {p.note}
                </text>
              </g>
            </g>
          );
        })}

        {pts.map((p, i) => (
          <text
            key={p.cycle}
            x={px(i)}
            y={H - 12}
            textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"}
            fontSize="10"
            className="font-mono"
            fill="var(--muted-foreground)"
          >
            {p.cycle}
          </text>
        ))}

        <text
          x={px(0) + 8}
          y={py(pts[0].share) - 10}
          fontSize="11"
          className="font-mono"
          fill="var(--muted-foreground)"
        >
          {pts[0].share}%
        </text>
        <text
          x={px(last) - 8}
          y={py(pts[last].share) - 12}
          textAnchor="end"
          fontSize="12"
          fontWeight="600"
          fill="var(--foreground)"
        >
          {pts[last].share}%
        </text>
      </svg>

      <ul className="sr-only">
        {pts.map((p) => (
          <li key={p.cycle}>
            {p.cycle}: {p.share}% recommendation share - {p.note}
          </li>
        ))}
      </ul>
      <p className="label-mono mt-3 border-t border-border pt-3 text-[0.6rem] text-muted-foreground">
        Illustrative - the compounding mechanism is real
      </p>
    </div>
  );
}
