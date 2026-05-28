import { CalendarClock, CloudSun } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/marketing/Container";

export function FeatureTwoCol() {
  return (
    <section className="surface-cream py-12 sm:py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <FeatureCard
            title={
              <>
                Decisions,
                <br />
                not guesswork.
              </>
            }
            description="Heyotis agents read live sales, weather, and event signals so your team always knows what to act on next."
            visual={<RecommendationsVisual />}
          />
          <FeatureCard
            title="Plugs into your stack"
            description="POS, payroll, accounting, ordering — connect what you already use and let Heyotis orchestrate the flow."
            visual={<IntegrationsVisual />}
          />
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({
  title,
  description,
  visual,
}: {
  title: React.ReactNode;
  description: string;
  visual: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-8 rounded-[2rem] border-transparent bg-card p-8 shadow-sm sm:p-10 lg:p-12">
      <header>
        <h3 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h3>
        <p className="mt-5 max-w-md text-base text-foreground/70 sm:text-lg">
          {description}
        </p>
      </header>
      <div className="mt-auto rounded-3xl bg-background p-8 sm:p-12">
        {visual}
      </div>
    </Card>
  );
}

function RecommendationsVisual() {
  return (
    <ul className="space-y-4">
      <RecRow
        Icon={CalendarClock}
        iconBg="bg-primary"
        iconColor="text-lime"
        label="Your schedule is over budget"
      />
      <RecRow
        Icon={CloudSun}
        iconBg="bg-violet"
        iconColor="text-primary-foreground"
        label="You're running low on chicken"
      />
    </ul>
  );
}

function RecRow({
  Icon,
  iconBg,
  iconColor,
  label,
}: {
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  iconBg: string;
  iconColor: string;
  label: string;
}) {
  return (
    <li className="flex items-center gap-4">
      <span
        aria-hidden
        className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon className={`size-5 ${iconColor}`} aria-hidden />
      </span>
      <span className="flex-1 rounded-2xl bg-card px-5 py-4 text-sm font-medium shadow-sm">
        {label}
      </span>
    </li>
  );
}

function IntegrationsVisual() {
  const tiles: Array<{ glyph: string; tone: string }> = [
    { glyph: "▢", tone: "bg-foreground text-background" },
    { glyph: "e", tone: "bg-card text-primary" },
    { glyph: "◖", tone: "bg-card text-coral" },
    { glyph: "✦", tone: "bg-card text-violet" },
    { glyph: "4", tone: "bg-card text-primary" },
    { glyph: "x", tone: "bg-card text-teal" },
    { glyph: "n", tone: "bg-primary text-lime" },
    { glyph: "◖", tone: "bg-card text-coral" },
    { glyph: "✦", tone: "bg-card text-violet" },
    { glyph: "4", tone: "bg-card text-primary" },
    { glyph: "x", tone: "bg-card text-teal" },
    { glyph: "≡", tone: "bg-card text-foreground" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {tiles.map((tile, i) => {
        const isCenter = i === 6;
        return (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-2xl font-display text-lg shadow-sm sm:text-xl ${tile.tone} ${
              isCenter ? "scale-125 shadow-lg" : ""
            }`}
          >
            {tile.glyph}
          </div>
        );
      })}
    </div>
  );
}
