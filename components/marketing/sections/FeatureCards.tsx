import {
  BarChart3,
  Quote,
  ListChecks,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  body: string;
  points: string[];
};

const CARDS: FeatureCard[] = [
  {
    icon: BarChart3,
    title: "Share of Voice & rankings",
    body: "Track how often AI recommends you, your Top-1 and Top-3 presence, and how you place against named competitors.",
    points: ["Visibility over time", "Per-query rankings", "Head-to-head"],
  },
  {
    icon: Quote,
    title: "Citations that move the needle",
    body: "See the domains AI cites, where you're owned versus third-party, and where you're recommended but never cited.",
    points: ["Owned vs third-party", "Mentioned vs cited", "Top sources"],
  },
  {
    icon: ListChecks,
    title: "A prioritized action plan",
    body: "Turn the signals into opportunities ranked by impact and effort — across onsite, rankings and citations — with the evidence behind each.",
    points: ["Impact × effort", "Evidence-backed", "Onsite / rankings / citations"],
  },
  {
    icon: LineChart,
    title: "Proven in real traffic",
    body: "Connect AI visibility to referral traffic and conversions from ChatGPT, Gemini and Perplexity with your GA4 data.",
    points: ["AI referral traffic", "Conversions by source", "AI traffic share"],
  },
];

export function FeatureCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <CardSpotlight key={card.title} className="p-6 sm:p-8">
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-accent ring-1 ring-brand/15">
              <Icon className="size-5" />
            </div>
            <h3
              className="mt-5 font-display text-2xl text-foreground"
              style={{ fontStretch: "85%", letterSpacing: "-0.01em" }}
            >
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {card.body}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {card.points.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[0.7rem] font-medium text-foreground/70"
                >
                  {p}
                </li>
              ))}
            </ul>
          </CardSpotlight>
        );
      })}
    </div>
  );
}
