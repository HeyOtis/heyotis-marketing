import {
  Gauge,
  Trophy,
  Quote,
  ListChecks,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Pillar = {
  icon: LucideIcon;
  title: string;
  body: string;
  span: string;
  feature?: boolean;
};

const PILLARS: Pillar[] = [
  {
    icon: Gauge,
    title: "Measure",
    body: "Track your visibility and Share of Voice across the assistants people actually use — ChatGPT, Gemini and Perplexity — with scheduled campaigns of unbiased queries.",
    span: "md:col-span-4",
    feature: true,
  },
  {
    icon: Trophy,
    title: "Benchmark",
    body: "See exactly where you rank against named competitors in AI answers — Top-1 and Top-3 presence, head to head.",
    span: "md:col-span-2",
  },
  {
    icon: Quote,
    title: "Own your citations",
    body: "Find where you're recommended but not cited, and which domains the AI trusts to ground its answers.",
    span: "md:col-span-2",
  },
  {
    icon: ListChecks,
    title: "Act",
    body: "Turn signals into a prioritized action plan — opportunities ranked by impact and effort, backed by evidence.",
    span: "md:col-span-2",
  },
  {
    icon: TrendingUp,
    title: "Prove ROI",
    body: "Connect AI visibility to real referral traffic and conversions from AI sources via GA4.",
    span: "md:col-span-2",
  },
];

export function PillarBento({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-6", className)}>
      {PILLARS.map((p) => (
        <PillarCard key={p.title} pillar={p} />
      ))}
    </div>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const Icon = pillar.icon;
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-[0_18px_48px_-28px_rgba(40,30,70,0.4)]",
        pillar.span,
      )}
    >
      {pillar.feature ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.1 280 / 0.16), transparent 70%)",
          }}
        />
      ) : null}
      <div className="relative flex size-11 items-center justify-center rounded-xl bg-brand/10 text-accent ring-1 ring-brand/15">
        <Icon className="size-5" />
      </div>
      <h3
        className="relative mt-5 font-display text-2xl text-foreground"
        style={{ fontStretch: "85%", letterSpacing: "-0.01em" }}
      >
        {pillar.title}
      </h3>
      <p
        className={cn(
          "relative mt-2 text-sm leading-relaxed text-muted-foreground",
          pillar.feature && "max-w-md text-base",
        )}
      >
        {pillar.body}
      </p>
    </div>
  );
}
