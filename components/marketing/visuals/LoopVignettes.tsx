import { cn } from "@/lib/utils";

/**
 * The four hero-tab vignettes, all speaking one quiet language: white card,
 * dotted-grid ground, ghosted ink (~30%) everywhere except ONE focal element
 * per panel, mono micro-labels, dashed dividers. No window chrome, no dark
 * panels — these sit behind the fold and must not shout.
 */

/* ── shared frame ── */

/* White card lifted off the cream canvas, bounded by dashed rules
   (the fold's own dashed line reads as its top edge). */
function Frame({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-full w-full flex-col overflow-hidden border border-dashed border-border bg-card",
        className,
      )}
    >
      {/* dotted-grid ground */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.24 0.02 285 / 0.07) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div className="relative px-6 pt-5 sm:px-8">
        <span className="label-mono text-[0.6rem] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="relative flex-1 px-6 pb-6 pt-4 sm:px-8">{children}</div>
    </div>
  );
}

/* White glow behind text that feathers out into the dotted grid. Sized by
   the host's own box, so it grows with the copy. */
function Halo() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-x-10 -inset-y-8"
      style={{
        background:
          "radial-gradient(closest-side, white 45%, transparent 100%)",
      }}
    />
  );
}

function TileCaption({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="relative mt-4">
      <Halo />
      <div className="relative">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {sub}
        </p>
      </div>
    </div>
  );
}

/* The wide bottom-right cell: editorial copy + the tab's single CTA. */
function EditorialCell({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col justify-center sm:col-span-2 sm:pl-6">
      <Halo />
      <div className="relative">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {children}
        </p>
        <a
          href={href}
          className="mt-4 inline-flex w-fit items-center rounded-full bg-salmon px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-salmon/85"
        >
          Find out more
        </a>
      </div>
    </div>
  );
}

/* ── Measure: the data-rich surface, as a quiet bento ── */

function VisibilityLine() {
  return (
    <svg
      viewBox="0 0 220 90"
      preserveAspectRatio="none"
      className="h-[90px] w-full"
      aria-hidden
    >
      {[20, 45, 70].map((y) => (
        <line
          key={y}
          x1="0"
          x2="220"
          y1={y}
          y2={y}
          stroke="oklch(0.24 0.02 285 / 0.08)"
        />
      ))}
      <path
        d="M4 72C24 70 36 66 56 62C76 58 88 52 108 48C128 44 140 40 160 32C180 24 196 20 216 14"
        fill="none"
        stroke="var(--periwinkle)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="216" cy="14" r="3" fill="var(--periwinkle)" />
    </svg>
  );
}

function GhostAnswer() {
  return (
    <div className="flex h-[90px] flex-col justify-between">
      <div className="space-y-1.5">
        {["w-full", "w-[92%]", "w-[74%]"].map((w, i) => (
          <div
            key={i}
            className={cn("h-2 rounded-full bg-foreground/10", w)}
          />
        ))}
      </div>
      <span className="label-mono inline-flex w-fit items-center gap-1 rounded-full bg-brand-soft px-2 py-1 text-[0.55rem] text-accent">
        yourbrand.com +2
      </span>
    </div>
  );
}

function SentimentGauge() {
  return (
    <div className="relative flex h-[90px] items-end justify-center">
      <svg viewBox="0 0 120 64" className="h-full" aria-hidden>
        <path
          d="M12 60A48 48 0 0 1 108 60"
          fill="none"
          stroke="oklch(0.24 0.02 285 / 0.08)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M12 60A48 48 0 0 1 108 60"
          fill="none"
          stroke="var(--periwinkle)"
          strokeWidth="7"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="72 100"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <span className="text-xl font-semibold tabular-nums text-foreground">
          72
        </span>
        <span className="text-xs text-muted-foreground"> / 100</span>
      </div>
    </div>
  );
}

function FanoutPeek() {
  return (
    <div className="flex h-[90px] flex-col justify-center gap-2">
      <span className="ml-auto w-fit rounded-full bg-secondary px-3 py-1.5 text-[0.7rem] text-foreground/60">
        &ldquo;best everyday skincare nz&rdquo;
      </span>
      <span className="text-[0.7rem] text-foreground/40">
        ✓ Searched the web · 5 searches
      </span>
      <div className="flex gap-1.5">
        {["w-[30%]", "w-[24%]", "w-[34%]"].map((w, i) => (
          <div key={i} className={cn("h-2 rounded-full bg-foreground/10", w)} />
        ))}
      </div>
    </div>
  );
}

export function MeasureVignette() {
  return (
    <Frame label="Measure · Overview">
      <div className="grid h-full grid-rows-[auto_1fr] gap-0">
        {/* top row: the three measurement surfaces */}
        <div className="grid gap-6 pb-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <div className="sm:pr-6">
            <VisibilityLine />
            <TileCaption
              title="Visibility"
              sub="Rankings, share of voice and average position across AI platforms."
            />
          </div>
          <div className="sm:px-6">
            <SentimentGauge />
            <TileCaption
              title="Sentiment"
              sub="How assistants frame you, measured across every model."
            />
          </div>
          <div className="sm:pl-6">
            <GhostAnswer />
            <TileCaption
              title="Citations"
              sub="Every response, mention trend and the sources AI leans on."
            />
          </div>
        </div>
        {/* bottom row: fanouts + the AEO insights editorial cell */}
        <div className="grid gap-6 border-t border-dashed border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <div className="sm:pr-6">
            <FanoutPeek />
            <TileCaption
              title="Fanouts"
              sub="The follow-up queries assistants run behind every answer."
            />
          </div>
          <EditorialCell title="AEO Insights" href="/features">
            Understand what&rsquo;s actually driving your visibility. Every
            answer is scored, every citation traced, and every shift
            explained — so you can see which pages, sources and topics move
            your recommendation share, and where the next point of share
            will come from.
          </EditorialCell>
        </div>
      </div>
    </Frame>
  );
}

/* ── Strategy: insights → recommendations → the plan ── */

const INSIGHTS = [
  { text: "Assistants cite a retailer's page, not yours", focal: true },
  { text: "No comparison page for 'best everyday'", focal: false },
  { text: "Sentiment dips on price questions", focal: false },
];

function InsightList() {
  return (
    <div className="flex h-[104px] flex-col justify-center gap-2.5">
      {INSIGHTS.map(({ text, focal }) => (
        <div key={text} className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              focal ? "bg-periwinkle" : "bg-foreground/15",
            )}
          />
          <span
            className={cn(
              "truncate text-[0.7rem]",
              focal ? "text-foreground/70" : "text-foreground/35",
            )}
          >
            {text}
          </span>
        </div>
      ))}
    </div>
  );
}

function RecommendationList() {
  return (
    <div className="flex h-[104px] flex-col justify-center gap-1.5">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 py-2 shadow-[0_1px_2px_0_rgba(40,30,70,0.05)]">
        <span className="truncate text-[0.7rem] font-medium leading-none text-foreground">
          1 · Own &ldquo;best for everyday&rdquo;
        </span>
        <span className="label-mono shrink-0 rounded-full bg-brand-soft px-1.5 py-0.5 text-[0.5rem] leading-none text-accent">
          High
        </span>
      </div>
      {["2 · Add Product & FAQ schema", "3 · Answer the price question"].map(
        (move) => (
          <div
            key={move}
            className="truncate rounded-lg border border-border/60 bg-card px-3.5 py-2 text-[0.7rem] leading-none text-foreground/35"
          >
            {move}
          </div>
        ),
      )}
    </div>
  );
}

const GANTT_BARS = [
  { left: "0%", width: "38%", focal: true },
  { left: "24%", width: "30%", focal: false },
  { left: "42%", width: "34%", focal: false },
  { left: "64%", width: "30%", focal: false },
];

function PlanGantt() {
  return (
    <div className="flex h-[104px] flex-col justify-center">
      <div className="flex justify-between font-mono text-[0.55rem] uppercase tracking-widest text-foreground/35">
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
      </div>
      <div className="relative mt-2 flex flex-col gap-2.5">
        {/* month gridlines */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-1/2 border-l border-dashed border-border"
        />
        {GANTT_BARS.map(({ left, width, focal }, i) => (
          <div key={i} className="relative h-2">
            <div
              className={cn(
                "absolute inset-y-0 rounded-full",
                focal ? "bg-periwinkle" : "bg-foreground/10",
              )}
              style={{ left, width }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactMatrix() {
  const dots = [
    { left: "18%", top: "22%", focal: true },
    { left: "44%", top: "46%", focal: false },
    { left: "66%", top: "30%", focal: false },
    { left: "34%", top: "68%", focal: false },
    { left: "76%", top: "64%", focal: false },
  ];
  return (
    <div className="flex h-[104px] items-center gap-4">
      <div className="relative aspect-square h-full rounded-lg border border-border/60">
        <div
          aria-hidden
          className="absolute inset-y-0 left-1/2 border-l border-dashed border-border/60"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/2 border-t border-dashed border-border/60"
        />
        {dots.map(({ left, top, focal }, i) => (
          <span
            key={i}
            className={cn(
              "absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
              focal ? "bg-periwinkle" : "bg-foreground/15",
            )}
            style={{ left, top }}
          />
        ))}
      </div>
      <div className="font-mono text-[0.55rem] uppercase leading-relaxed tracking-widest text-foreground/35">
        Impact
        <br />×<br />
        Effort
      </div>
    </div>
  );
}

export function StrategyVignette() {
  return (
    <Frame label="Strategy · Action plan">
      <div className="grid h-full grid-rows-[auto_1fr] gap-0">
        {/* top row: the pipeline, left to right */}
        <div className="grid gap-6 pb-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <div className="sm:pr-6">
            <InsightList />
            <TileCaption
              title="Insights"
              sub="What the measurement surfaced — cited, missing, slipping."
            />
          </div>
          <div className="sm:px-6">
            <RecommendationList />
            <TileCaption
              title="Recommendations"
              sub="Ranked moves with the why attached, never vibes."
            />
          </div>
          <div className="sm:pl-6">
            <PlanGantt />
            <TileCaption
              title="The plan"
              sub="Sequenced into a quarter you can actually run."
            />
          </div>
        </div>
        {/* bottom row: scoring + the engine, editorially */}
        <div className="grid gap-6 border-t border-dashed border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <div className="sm:pr-6">
            <ImpactMatrix />
            <TileCaption
              title="Impact × effort"
              sub="Every move is scored before it's ranked."
            />
          </div>
          <EditorialCell title="The Strategy Engine" href="/strategy-engine">
            Every recommendation is written from measured findings. Moves
            are scored on impact and effort, ranked, and sequenced into a
            plan — each step carrying the evidence it came from, so you
            always know why it&rsquo;s worth doing and what it should move.
          </EditorialCell>
        </div>
      </div>
    </Frame>
  );
}

/* ── Act: the plan becomes shipped, verified work ── */

const WORK_ITEMS = [
  { label: "Publish /best-everyday comparison", done: true, focal: true },
  { label: "Add Product & FAQ schema", done: true, focal: false },
  { label: "Rewrite the pricing FAQ", done: false, focal: false },
];

function WorkList() {
  return (
    <div className="flex h-[104px] flex-col justify-center gap-2.5">
      {WORK_ITEMS.map(({ label, done, focal }) => (
        <div key={label} className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={cn(
              "flex size-3.5 shrink-0 items-center justify-center rounded border text-[0.5rem] leading-none",
              done
                ? focal
                  ? "border-transparent bg-periwinkle text-foreground"
                  : "border-transparent bg-foreground/15 text-card"
                : "border-border bg-card",
            )}
          >
            {done ? "✓" : ""}
          </span>
          <span
            className={cn(
              "truncate text-[0.7rem]",
              focal ? "text-foreground/70" : "text-foreground/35",
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

const LANDING_STEPS = [
  { label: "Shipped", time: "09:12", focal: false },
  { label: "Fetched", time: "11:47", focal: false },
  { label: "Re-answered", time: "Jun 21", focal: true },
];

function LandingSteps() {
  return (
    <div className="flex h-[104px] flex-col justify-center">
      <div className="relative flex items-center justify-between">
        <div
          aria-hidden
          className="absolute inset-x-2 top-1/2 border-t border-dashed border-border"
        />
        {LANDING_STEPS.map(({ label, focal }) => (
          <span
            key={label}
            aria-hidden
            className={cn(
              "relative size-2.5 rounded-full border",
              focal ? "border-transparent bg-lime" : "border-border bg-card",
            )}
          />
        ))}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        {LANDING_STEPS.map(({ label, time, focal }) => (
          <div key={label} className="min-w-0">
            <p
              className={cn(
                "text-[0.7rem] font-medium",
                focal ? "text-foreground" : "text-foreground/40",
              )}
            >
              {label}
            </p>
            <p
              className={cn(
                "mt-0.5 font-mono text-[0.55rem]",
                focal ? "text-muted-foreground" : "text-foreground/30",
              )}
            >
              {time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const VERIFY_ROWS = [
  { path: "/best-everyday", status: "Verified", live: true },
  { path: "/pricing-faq", status: "Pending", live: false },
  { path: "/product-schema", status: "Queued", live: false },
];

function VerifyList() {
  return (
    <div className="flex h-[104px] flex-col justify-center gap-1.5">
      {VERIFY_ROWS.map(({ path, status, live }) => (
        <div
          key={path}
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg border bg-card px-3.5 py-2",
            live ? "border-border" : "border-border/60",
          )}
        >
          <span
            className={cn(
              "truncate font-mono text-[0.65rem] leading-none",
              live ? "text-foreground/80" : "text-foreground/35",
            )}
          >
            {path}
          </span>
          <span
            className={cn(
              "label-mono shrink-0 rounded-full px-1.5 py-0.5 text-[0.5rem] leading-none",
              live ? "bg-lime text-foreground" : "bg-secondary text-foreground/40",
            )}
          >
            {status}
          </span>
        </div>
      ))}
    </div>
  );
}

function AnswerShift() {
  return (
    <div className="flex h-[104px] flex-col justify-center gap-3">
      <div>
        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-foreground/35">
          Before
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="h-2 w-[55%] rounded-full bg-foreground/10" />
          <div className="h-2 w-[20%] rounded-full bg-foreground/10" />
        </div>
      </div>
      <div>
        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">
          After
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="h-2 w-[30%] rounded-full bg-foreground/10" />
          <span className="label-mono rounded-full bg-brand-soft px-2 py-0.5 text-[0.5rem] leading-none text-accent">
            yourbrand
          </span>
          <div className="h-2 w-[24%] rounded-full bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}

export function ActVignette() {
  return (
    <Frame label="Act · Implementation">
      <div className="grid h-full grid-rows-[auto_1fr] gap-0">
        {/* top row: work → landing → verification */}
        <div className="grid gap-6 pb-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <div className="sm:pr-6">
            <WorkList />
            <TileCaption
              title="Work items"
              sub="The plan broken into concrete, owned tasks."
            />
          </div>
          <div className="sm:px-6">
            <LandingSteps />
            <TileCaption
              title="Watch it land"
              sub="From ship, to crawl, to a changed answer — within days."
            />
          </div>
          <div className="sm:pl-6">
            <VerifyList />
            <TileCaption
              title="Verified live"
              sub="Every change checked in production before it counts."
            />
          </div>
        </div>
        {/* bottom row: the answer shift + editorial */}
        <div className="grid gap-6 border-t border-dashed border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <div className="sm:pr-6">
            <AnswerShift />
            <TileCaption
              title="The answer moves"
              sub="The work shows up in the words assistants use."
            />
          </div>
          <EditorialCell title="Act on the strategy" href="/strategy-engine#verify">
            A plan only counts once it ships. Each move becomes tracked
            work: HeyOtis watches the crawlers pick up the change, verifies
            it&rsquo;s live in production, and confirms the answer actually
            moved — so acting is measured, never assumed.
          </EditorialCell>
        </div>
      </div>
    </Frame>
  );
}

/* ── Attribute: the lift, receipts attached ── */

function StepChart() {
  /* The share responding to the shipped move: flat, then climbing. The
     dashed marker is the ship date; the area fill grounds the line. */
  const line =
    "M0 48C34 48 62 47 92 44C122 41 148 30 192 21C232 13 268 8 300 6";
  return (
    <svg
      viewBox="0 0 300 64"
      preserveAspectRatio="none"
      className="h-16 w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="lift-fill" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--periwinkle)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--periwinkle)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[24, 48].map((y) => (
        <line
          key={y}
          x1="0"
          x2="300"
          y1={y}
          y2={y}
          stroke="oklch(0.24 0.02 285 / 0.07)"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path d={`${line}L300 64L0 64Z`} fill="url(#lift-fill)" />
      <line
        x1="92"
        y1="8"
        x2="92"
        y2="60"
        stroke="oklch(0.24 0.02 285 / 0.18)"
        strokeDasharray="3 4"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={line}
        fill="none"
        stroke="var(--periwinkle)"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="92" cy="44" r="3" fill="var(--periwinkle)" />
      <circle cx="297" cy="6" r="3.5" fill="var(--periwinkle)" />
    </svg>
  );
}

function LiftStat() {
  return (
    <div className="flex h-[104px] flex-col justify-center gap-2.5">
      <div className="flex items-baseline gap-2.5">
        <span className="text-lg font-semibold tabular-nums text-foreground/30 line-through decoration-1">
          1.4%
        </span>
        <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
          4.9%
        </span>
        <span className="label-mono rounded-full bg-salmon px-2 py-0.5 text-[0.5rem] leading-none text-foreground">
          ▲ 3.5 pts
        </span>
      </div>
      <StepChart />
    </div>
  );
}

const LEDGERS = [
  { tag: "Web", line: "chatgpt.com referral sessions", value: "▲ 96%", focal: true },
  { tag: "Bots", line: "GPTBot fetches of changed pages", value: "▲ 3.1×", focal: false },
];

function LedgerRows() {
  return (
    <div className="flex h-[104px] flex-col justify-center gap-2">
      {LEDGERS.map(({ tag, line, value, focal }) => (
        <div
          key={tag}
          className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card px-3.5 py-2.5"
        >
          <span className="label-mono shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[0.5rem] leading-none text-foreground/50">
            {tag}
          </span>
          <span
            className={cn(
              "min-w-0 truncate text-[0.7rem] leading-none",
              focal ? "text-foreground/70" : "text-foreground/40",
            )}
          >
            {line}
          </span>
          <span
            className={cn(
              "ml-auto shrink-0 text-[0.7rem] font-semibold tabular-nums leading-none",
              focal ? "text-foreground" : "text-foreground/45",
            )}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

const RECEIPTS = [
  ["09:41", "GPTBot GET /best-everyday · 200"],
  ["09:58", "Session · chatgpt.com → /pricing"],
  ["10:04", "Order #48211 · first-touch: ChatGPT"],
];

function ReceiptTrail() {
  return (
    <div className="flex h-[104px] flex-col justify-center">
      <div className="flex flex-col divide-y divide-dashed divide-border/70 rounded-lg border border-border/60 bg-card">
        {RECEIPTS.map(([time, line], i) => (
          <div
            key={time}
            className={cn(
              "flex items-baseline gap-2.5 px-3 py-[7px] font-mono text-[0.6rem] leading-none",
              i === RECEIPTS.length - 1
                ? "text-foreground/70"
                : "text-foreground/30",
            )}
          >
            <span className="tabular-nums">{time}</span>
            <span className="truncate">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CauseEffectWaterfall() {
  /* The lift as a waterfall: before, plus each shipped move's measured
     contribution, landing on after. Deterministic attribution, drawn. */
  return (
    <div className="flex h-[104px] flex-col justify-center">
      <svg viewBox="0 0 300 64" className="h-16 w-full" aria-hidden>
        {/* connectors: each level carries across to the next bar */}
        {[
          { x1: 60, x2: 90, y: 48 },
          { x1: 140, x2: 170, y: 26 },
          { x1: 220, x2: 250, y: 10 },
        ].map(({ x1, x2, y }) => (
          <line
            key={x1}
            x1={x1}
            x2={x2}
            y1={y}
            y2={y}
            stroke="oklch(0.24 0.02 285 / 0.25)"
            strokeDasharray="3 3"
          />
        ))}
        <rect x="10" y="48" width="50" height="16" rx="2" fill="oklch(0.24 0.02 285 / 0.12)" />
        <rect x="90" y="26" width="50" height="22" rx="2" fill="var(--periwinkle)" fillOpacity="0.55" />
        <rect x="170" y="10" width="50" height="16" rx="2" fill="var(--periwinkle)" fillOpacity="0.55" />
        <rect x="250" y="10" width="50" height="54" rx="2" fill="var(--periwinkle)" />
      </svg>
      <div className="mt-2 flex font-mono text-[0.5rem] uppercase tracking-wider text-foreground/40">
        <span className="w-1/4">1.4%</span>
        <span className="w-1/4 text-center">+1.8</span>
        <span className="w-1/4 text-center">+1.7</span>
        <span className="w-1/4 text-right font-semibold text-foreground/70">
          4.9%
        </span>
      </div>
    </div>
  );
}

export function AttributeVignette() {
  return (
    <Frame label="Attribute · 30-day window">
      <div className="grid h-full grid-rows-[auto_1fr] gap-0">
        {/* top row: the lift → the two ledgers → the receipts */}
        <div className="grid gap-6 pb-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <div className="sm:pr-6">
            <LiftStat />
            <TileCaption
              title="The lift"
              sub="Recommendation share, before and after the work shipped."
            />
          </div>
          <div className="sm:px-6">
            <LedgerRows />
            <TileCaption
              title="Two ledgers"
              sub="Web analytics and agent analytics, joined in one record."
            />
          </div>
          <div className="sm:pl-6">
            <ReceiptTrail />
            <TileCaption
              title="The receipts"
              sub="Every number traces back to a logged event."
            />
          </div>
        </div>
        {/* bottom row: cause-and-effect + editorial */}
        <div className="grid gap-6 border-t border-dashed border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <div className="sm:pr-6">
            <CauseEffectWaterfall />
            <TileCaption
              title="Cause, then effect"
              sub="The lift, decomposed into the moves that caused it."
            />
          </div>
          <EditorialCell title="Deterministic attribution" href="/features#traffic">
            No modelled guesswork. Web analytics and agent analytics are
            joined into one deterministic record, so every lift is
            attributed to the move that caused it — and what worked feeds
            straight back into the next plan. That&rsquo;s the feedback
            loop, compounding.
          </EditorialCell>
        </div>
      </div>
    </Frame>
  );
}
