import { cn } from "@/lib/utils";

/**
 * Designed (illustrative) product visuals built in pure SVG/CSS — no real
 * screenshots, no chart libs. Three panels mirror real HeyOtis surfaces:
 *  - overview     → Share of Voice trend + per-engine scorecard
 *  - citations    → top cited domains, owned vs third-party
 *  - competitors  → ranked share-of-voice vs named rivals
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
        "w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.03),0_18px_48px_-24px_rgba(40,30,70,0.35)]",
        className,
      )}
    >
      <Chrome variant={variant} />
      <div className="p-4 sm:p-6">
        {variant === "overview" ? <OverviewPanel /> : null}
        {variant === "citations" ? <CitationsPanel /> : null}
        {variant === "competitors" ? <CompetitorsPanel /> : null}
      </div>
    </div>
  );
}

const VARIANT_TITLE: Record<MockVariant, string> = {
  overview: "AI Visibility",
  citations: "Citations",
  competitors: "Competitors",
};

function Chrome({ variant }: { variant: MockVariant }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
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

/* ── Overview ──────────────────────────────────────────────────────────── */

function OverviewPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <div className="rounded-xl border border-border bg-background/60 p-4 md:col-span-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="label-mono text-[0.6rem] text-muted-foreground">
              Share of Voice
            </p>
            <p
              className="mt-1 font-display text-4xl text-foreground"
              style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
            >
              34.8%
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/12 px-2 py-1 text-xs font-semibold text-emerald-600">
            ▲ 12.4 pts
          </span>
        </div>
        <SovChart />
      </div>

      <div className="space-y-2.5 md:col-span-2">
        <p className="label-mono text-[0.6rem] text-muted-foreground">
          How AI answers you
        </p>
        <ScoreRow engine="ChatGPT" status="Recommended" tone="emerald" />
        <ScoreRow engine="Gemini" status="Mentioned" tone="amber" />
        <ScoreRow engine="Perplexity" status="Missing" tone="zinc" />
      </div>
    </div>
  );
}

function SovChart() {
  return (
    <svg
      viewBox="0 0 600 200"
      className="mt-4 h-28 w-full sm:h-32"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="sov-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.1 280)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="oklch(0.68 0.1 280)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 90, 140].map((y) => (
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
      {/* competitor (flat) */}
      <path
        d="M0,150 C60,148 120,146 180,144 C240,142 300,140 360,138 C420,136 480,135 540,134 C570,133 588,133 600,132"
        stroke="oklch(0.78 0.04 30)"
        strokeWidth="2.5"
        strokeDasharray="4 5"
        strokeLinecap="round"
      />
      {/* brand area + line */}
      <path
        d="M0,160 C40,150 80,150 120,156 C160,162 180,118 220,122 C260,126 280,98 320,92 C360,86 400,62 440,66 C480,70 510,42 540,38 C570,34 588,30 600,28 L600,200 L0,200 Z"
        fill="url(#sov-fill)"
      />
      <path
        d="M0,160 C40,150 80,150 120,156 C160,162 180,118 220,122 C260,126 280,98 320,92 C360,86 400,62 440,66 C480,70 510,42 540,38 C570,34 588,30 600,28"
        stroke="oklch(0.5 0.16 280)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="600" cy="28" r="5" fill="oklch(0.5 0.16 280)" />
      <circle cx="600" cy="28" r="9" fill="oklch(0.5 0.16 280)" fillOpacity="0.18" />
    </svg>
  );
}

const TONE_BADGE = {
  emerald: "bg-emerald-500/12 text-emerald-600",
  amber: "bg-amber-500/15 text-amber-600",
  zinc: "bg-secondary text-muted-foreground",
} as const;

const TONE_BAR = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  zinc: "bg-border",
} as const;

const TONE_WIDTH = { emerald: "92%", amber: "54%", zinc: "14%" } as const;

function ScoreRow({
  engine,
  status,
  tone,
}: {
  engine: string;
  status: string;
  tone: keyof typeof TONE_BADGE;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{engine}</span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[0.65rem] font-semibold",
            TONE_BADGE[tone],
          )}
        >
          {status}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full", TONE_BAR[tone])}
          style={{ width: TONE_WIDTH[tone] }}
        />
      </div>
    </div>
  );
}

/* ── Citations ─────────────────────────────────────────────────────────── */

const CITATIONS = [
  { domain: "yourbrand.com", type: "Owned", share: 38, owned: true },
  { domain: "reddit.com", type: "Third-party", share: 24, owned: false },
  { domain: "wirecutter.com", type: "Third-party", share: 18, owned: false },
  { domain: "g2.com", type: "Third-party", share: 12, owned: false },
];

function CitationsPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Citation share
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            Which sources AI grounds its answers on
          </p>
        </div>
        <div className="flex items-center gap-3 text-[0.65rem]">
          <span className="flex items-center gap-1.5 text-foreground/70">
            <span className="size-2 rounded-full bg-brand" /> Owned
          </span>
          <span className="flex items-center gap-1.5 text-foreground/70">
            <span className="size-2 rounded-full bg-soft-orange" /> Third-party
          </span>
        </div>
      </div>
      <div className="space-y-2.5">
        {CITATIONS.map((c) => (
          <div
            key={c.domain}
            className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3"
          >
            <span className="w-36 shrink-0 truncate text-sm font-medium text-foreground">
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
            <span className="w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
              {c.share}%
            </span>
          </div>
        ))}
      </div>
      <p className="rounded-lg bg-secondary/70 px-3 py-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Recommended, not cited:</span>{" "}
        you appear in answers but rarely as the source — a citation gap to close.
      </p>
    </div>
  );
}

/* ── Competitors ───────────────────────────────────────────────────────── */

const RIVALS = [
  { name: "Acme Co.", share: 34.8, you: true },
  { name: "Northwind", share: 28.1, you: false },
  { name: "Globex", share: 19.5, you: false },
  { name: "Initech", share: 11.2, you: false },
];

function CompetitorsPanel() {
  const max = Math.max(...RIVALS.map((r) => r.share));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Share of Voice — ranked
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
              "flex items-center gap-3 rounded-xl border p-3",
              r.you
                ? "border-brand/40 bg-brand/5"
                : "border-border bg-background/60",
            )}
          >
            <span className="w-5 shrink-0 text-center text-sm font-semibold tabular-nums text-muted-foreground">
              {i + 1}
            </span>
            <span
              className={cn(
                "w-28 shrink-0 truncate text-sm font-medium",
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
            <span className="w-12 shrink-0 text-right text-sm tabular-nums text-foreground">
              {r.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
