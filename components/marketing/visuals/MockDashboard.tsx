import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Designed (illustrative) product visuals built in pure SVG/CSS - no real
 * screenshots, no chart libs. Mirrors real HeyOtis surfaces:
 *  - overview     → KPI tiles + Share-of-Voice trend + competitor rankings + per-engine
 *  - citations    → citation overview tiles, top cited domains, source distribution
 *  - competitors  → ranked share-of-voice vs named rivals + suggested competitors
 */
export type MockVariant = "overview" | "citations" | "competitors";

export function MockDashboard({
  variant = "overview",
  className,
}: {
  variant?: MockVariant;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.03),0_18px_48px_-24px_rgba(40,30,70,0.35)]",
        className,
      )}
    >
      <Chrome variant={variant} />
      <div className="flex-1 p-4 sm:p-5">
        {variant === "overview" ? <OverviewPanel /> : null}
        {variant === "citations" ? <CitationsPanel /> : null}
        {variant === "competitors" ? <CompetitorsPanel /> : null}
      </div>
    </div>
  );
}

const VARIANT_TITLE: Record<MockVariant, string> = {
  overview: "Overview",
  citations: "Citations",
  competitors: "Competitors",
};

function Chrome({ variant }: { variant: MockVariant }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
      <div className="flex items-center gap-2.5">
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-coral/70" />
          <span className="size-1.5 rounded-full bg-soft-orange/70" />
          <span className="size-1.5 rounded-full bg-chart-5/60" />
        </span>
        <span className="label-mono text-[0.65rem] text-muted-foreground">
          {VARIANT_TITLE[variant]}
        </span>
        <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-accent">
          Sample
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.65rem] font-medium text-muted-foreground">
          Last 30 days
        </span>
        <span className="hidden rounded-full border border-border px-2.5 py-1 text-[0.65rem] font-medium text-foreground/70 sm:inline">
          Acme Co.
        </span>
      </div>
    </div>
  );
}

/* ── Shared bits ───────────────────────────────────────────────────────── */

function KpiTile({
  label,
  value,
  delta,
  sub,
}: {
  label: string;
  value: string;
  delta?: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-3">
      <p className="label-mono text-[0.55rem] text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span
          className="font-display text-xl text-foreground sm:text-2xl"
          style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
        >
          {value}
        </span>
        {delta ? (
          <span className="text-[0.6rem] font-semibold text-emerald-700">
            {delta}
          </span>
        ) : null}
      </div>
      {sub ? (
        <p className="mt-0.5 text-[0.6rem] text-muted-foreground">{sub}</p>
      ) : null}
    </div>
  );
}

/* ── Overview ──────────────────────────────────────────────────────────── */

const KPIS = [
  { label: "Visibility", value: "34.8%", delta: "▲ 12.4 pts" },
  { label: "Active campaigns", value: "3", sub: "running" },
  { label: "Prompts tracked", value: "75", sub: "unique queries" },
  { label: "AI responses", value: "300", sub: "across campaigns" },
];

const ENGINES = [
  { name: "ChatGPT", status: "Recommended", tone: "emerald" },
  { name: "Claude", status: "Recommended", tone: "emerald" },
  { name: "Gemini", status: "Mentioned", tone: "amber" },
  { name: "Perplexity", status: "Missing", tone: "zinc" },
] as const;

function OverviewPanel() {
  const max = Math.max(...RIVALS.map((r) => r.share));
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {KPIS.map((k) => (
          <KpiTile key={k.label} {...k} />
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <div className="rounded-xl border border-border bg-background/60 p-4 md:col-span-3">
          <div className="flex items-center justify-between">
            <p className="label-mono text-[0.6rem] text-muted-foreground">
              Avg visibility over time
            </p>
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[0.6rem] font-semibold text-accent">
              Avg Visibility
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex flex-col justify-between py-0.5 text-[0.5rem] tabular-nums text-muted-foreground/70">
              <span>40%</span>
              <span>20%</span>
              <span>0%</span>
            </div>
            <div className="flex-1">
              <SovChart />
              <div className="mt-1 flex justify-between text-[0.5rem] text-muted-foreground/70">
                <span>Jun 1</span>
                <span>Jun 15</span>
                <span>Jun 30</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-4 md:col-span-2">
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Competitor rankings
          </p>
          <ol className="mt-3 space-y-2.5">
            {RIVALS.map((r, i) => (
              <li key={r.name} className="flex items-center gap-2">
                <span className="w-3.5 text-center text-[0.7rem] font-semibold tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "w-16 shrink-0 truncate text-xs font-medium",
                    r.you ? "text-accent" : "text-foreground",
                  )}
                >
                  {r.name}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      r.you ? "bg-brand-strong" : "bg-foreground/25",
                    )}
                    style={{ width: `${(r.share / max) * 100}%` }}
                  />
                </div>
                <span className="w-9 text-right text-[0.7rem] tabular-nums text-foreground">
                  {r.share}%
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background/60 p-3">
        <p className="label-mono text-[0.6rem] text-muted-foreground">
          How AI answers you
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ENGINES.map((e) => (
            <div
              key={e.name}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5"
            >
              <span className={cn("size-1.5 rounded-full", TONE_DOT[e.tone])} />
              <span className="text-xs font-medium text-foreground">{e.name}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.6rem] font-semibold",
                  TONE_BADGE[e.tone],
                )}
              >
                {e.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TONE_DOT = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  zinc: "bg-zinc-300",
} as const;

const TONE_BADGE = {
  emerald: "bg-emerald-500/12 text-emerald-700",
  amber: "bg-amber-500/15 text-amber-800",
  zinc: "bg-secondary text-muted-foreground",
} as const;

function SovChart() {
  return (
    <svg
      viewBox="0 0 600 180"
      className="h-24 w-full sm:h-28"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="sov-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.16 280)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="oklch(0.6 0.16 280)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 80, 130].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="600"
          y2={y}
          stroke="currentColor"
          className="text-border"
          strokeWidth="1"
        />
      ))}
      <path
        d="M0,150 C50,148 90,150 130,150 C175,150 195,118 235,118 C280,118 300,96 340,90 C385,84 420,70 460,66 C500,62 530,46 560,40 C580,36 592,32 600,30 L600,180 L0,180 Z"
        fill="url(#sov-fill)"
      />
      <path
        d="M0,150 C50,148 90,150 130,150 C175,150 195,118 235,118 C280,118 300,96 340,90 C385,84 420,70 460,66 C500,62 530,46 560,40 C580,36 592,32 600,30"
        stroke="oklch(0.5 0.16 280)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="600" cy="30" r="5" fill="oklch(0.5 0.16 280)" />
      <circle cx="600" cy="30" r="9" fill="oklch(0.5 0.16 280)" fillOpacity="0.18" />
    </svg>
  );
}

/* ── Citations ─────────────────────────────────────────────────────────── */

const OWNED_DOMAINS = [
  { domain: "yourbrand.com/best-sellers", n: 14 },
  { domain: "yourbrand.com/reviews", n: 9 },
  { domain: "yourbrand.com/compare", n: 7 },
];

const SOURCE_SEGMENTS = [
  { label: "yourbrand.com", pct: 38, color: "var(--chart-1)" },
  { label: "reddit.com", pct: 24, color: "var(--chart-2)" },
  { label: "wirecutter.com", pct: 18, color: "var(--chart-3)" },
  { label: "g2.com", pct: 12, color: "var(--chart-5)" },
  { label: "Other", pct: 8, color: "oklch(0.7 0.02 285)" },
];

// Build the conic-gradient stops once (static) - avoids mutating during render.
const SOURCE_STOPS = (() => {
  let acc = 0;
  return SOURCE_SEGMENTS.map((s) => {
    const start = acc;
    acc += s.pct;
    return `${s.color} ${start}% ${acc}%`;
  }).join(", ");
})();

function CitationsPanel() {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <KpiTile label="Own citations" value="154" />
        <KpiTile label="Citation share" value="12.4%" delta="▲ 3.1 pts" />
        <KpiTile label="Top competitor" value="Northwind" sub="58 citations" />
        <KpiTile label="Total citations" value="1,240" />
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <div className="rounded-xl border border-border bg-background/60 p-4 md:col-span-3">
          <div className="flex items-center justify-between">
            <p className="label-mono text-[0.6rem] text-muted-foreground">
              Top cited domains
            </p>
            <div className="flex items-center gap-2.5 text-[0.6rem]">
              <span className="flex items-center gap-1 text-foreground/70">
                <span className="size-1.5 rounded-full bg-brand" /> Owned
              </span>
              <span className="flex items-center gap-1 text-foreground/70">
                <span className="size-1.5 rounded-full bg-soft-orange" /> Third-party
              </span>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {CITATIONS.map((c) => (
              <div key={c.domain} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-xs font-medium text-foreground">
                  {c.domain}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      c.owned ? "bg-brand" : "bg-soft-orange",
                    )}
                    style={{ width: `${c.share * 2.4}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[0.7rem] tabular-nums text-muted-foreground">
                  {c.share}%
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-lg bg-secondary/70 px-2.5 py-1.5 text-[0.7rem] text-muted-foreground">
            <span className="font-semibold text-foreground">
              Recommended, not cited:
            </span>{" "}
            you appear in answers but rarely as the source.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-4 md:col-span-2">
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Source distribution
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div
              className="relative size-20 shrink-0 rounded-full"
              style={{ background: `conic-gradient(${SOURCE_STOPS})` }}
            >
              <div className="absolute inset-[26%] flex flex-col items-center justify-center rounded-full bg-card">
                <span
                  className="font-display text-sm text-foreground"
                  style={{ fontStretch: "80%" }}
                >
                  1.2k
                </span>
                <span className="text-[0.4rem] text-muted-foreground">
                  citations
                </span>
              </div>
            </div>
            <ul className="flex-1 space-y-1.5 text-[0.65rem]">
              {SOURCE_SEGMENTS.map((s) => (
                <li key={s.label} className="flex items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: s.color }}
                  />
                  <span className="flex-1 truncate text-foreground/80">
                    {s.label}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {s.pct}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 border-t border-border pt-2.5">
            <p className="label-mono text-[0.55rem] text-muted-foreground">
              Your cited pages
            </p>
            <ul className="mt-1.5 space-y-1">
              {OWNED_DOMAINS.map((d) => (
                <li
                  key={d.domain}
                  className="flex items-center justify-between gap-2 text-[0.7rem]"
                >
                  <span className="truncate text-foreground/80">{d.domain}</span>
                  <span className="tabular-nums text-muted-foreground">{d.n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const CITATIONS = [
  { domain: "yourbrand.com", share: 38, owned: true },
  { domain: "reddit.com", share: 24, owned: false },
  { domain: "wirecutter.com", share: 18, owned: false },
  { domain: "g2.com", share: 12, owned: false },
];

/* ── Competitors ───────────────────────────────────────────────────────── */

const RIVALS = [
  { name: "Acme Co.", share: 34.8, you: true, avatar: "bg-brand/15 text-accent" },
  { name: "Northwind", share: 28.1, you: false, avatar: "bg-sky/40 text-foreground" },
  { name: "Globex", share: 19.5, you: false, avatar: "bg-peach/50 text-foreground" },
  { name: "Initech", share: 11.2, you: false, avatar: "bg-coral/40 text-foreground" },
];

const SUGGESTED = ["Stark Outfitters", "Wayne Apparel", "Umbrella Co."];

function CompetitorsPanel() {
  const max = Math.max(...RIVALS.map((r) => r.share));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Share of Voice - ranked
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            How you place against named rivals in AI answers
          </p>
        </div>
        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-accent">
          #1 of 4
        </span>
      </div>

      <div className="space-y-2.5">
        {RIVALS.map((r, i) => (
          <div
            key={r.name}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-2.5 sm:p-3",
              r.you
                ? "border-brand/40 bg-brand/5"
                : "border-border bg-background/60",
            )}
          >
            <span className="w-4 shrink-0 text-center text-sm font-semibold tabular-nums text-muted-foreground">
              {i + 1}
            </span>
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-md text-[0.6rem] font-bold",
                r.avatar,
              )}
            >
              {r.name.slice(0, 2).toUpperCase()}
            </span>
            <span
              className={cn(
                "w-24 shrink-0 truncate text-sm font-medium",
                r.you ? "text-accent" : "text-foreground",
              )}
            >
              {r.name}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full rounded-full",
                  r.you ? "bg-brand-strong" : "bg-foreground/25",
                )}
                style={{ width: `${(r.share / max) * 100}%` }}
              />
            </div>
            {r.you ? (
              <span className="hidden shrink-0 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[0.6rem] font-semibold text-emerald-700 sm:inline">
                Top-1
              </span>
            ) : null}
            <span className="w-12 shrink-0 text-right text-sm tabular-nums text-foreground">
              {r.share}%
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-border bg-background/40 p-3">
        <p className="label-mono text-[0.6rem] text-muted-foreground">
          Suggested competitors to track
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTED.map((name) => (
            <span
              key={name}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground/80"
            >
              <Plus className="size-3 text-accent" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
