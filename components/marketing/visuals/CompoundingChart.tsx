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
 * Recommendation share climbing across campaign cycles - the visible shape
 * of the feedback loop. A smooth monotone curve through the four cycle
 * datapoints (eased horizontal-midpoint cubics, so it never overshoots);
 * illustrative numbers, real mechanism. The SVG is decorative; the sr-only
 * list carries the values.
 */
export function CompoundingChart({ className }: { className?: string }) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const uid = React.useId().replace(/:/g, "");

  const pts = COMPOUNDING_POINTS;
  const last = pts.length - 1;
  const lineD = pts
    .map((p, i) => {
      const x = px(i);
      const y = py(p.share);
      if (i === 0) return `M ${x} ${y}`;
      const mx = (px(i - 1) + x) / 2;
      return `C ${mx} ${py(pts[i - 1].share)}, ${mx} ${y}, ${x} ${y}`;
    })
    .join(" ");
  const areaD = `${lineD} V ${py(0)} H ${px(0)} Z`;

  return (
    <div
      ref={ref}
      className={cn("rounded-2xl border border-border bg-card p-6", className)}
    >
      <div>
        <p className="label-mono text-[0.6rem] text-muted-foreground">
          The compounding loop
        </p>
        <h3 className="mt-1 font-display text-base font-semibold tracking-tight text-foreground">
          Recommendation share, by campaign cycle
        </h3>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" aria-hidden>
        <defs>
          <linearGradient id={`compound-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="var(--brand-strong)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--brand-strong)" stopOpacity="0" />
          </linearGradient>
        </defs>
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

        {/* the fill breathes in once the line has drawn */}
        {reduced ? (
          <path d={areaD} fill={`url(#compound-fill-${uid})`} />
        ) : (
          <motion.path
            d={areaD}
            fill={`url(#compound-fill-${uid})`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
          />
        )}
        {reduced ? (
          <path
            d={lineD}
            fill="none"
            stroke="var(--brand-strong)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : (
          <motion.path
            d={lineD}
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
              {/* each datapoint pops as the line draws past it */}
              {reduced ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  fill="var(--brand-strong)"
                  stroke="var(--card)"
                  strokeWidth="2"
                />
              ) : (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  fill="var(--brand-strong)"
                  stroke="var(--card)"
                  strokeWidth="2"
                  style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : undefined}
                  transition={{
                    delay: (i / last) * 1.1 + 0.1,
                    type: "spring",
                    stiffness: 420,
                    damping: 18,
                  }}
                />
              )}
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
    </div>
  );
}
