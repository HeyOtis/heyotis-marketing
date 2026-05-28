import { ArrowUpRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/marketing/Container";

export function PlatformShowcase() {
  return (
    <section className="surface-cream pb-12">
      <Container>
        <Card className="overflow-hidden rounded-[2rem] border-transparent bg-card p-8 shadow-none sm:p-12 lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
                One platform.
                <br />
                Every venue.
              </h2>
              <p
                className="mt-6 max-w-md text-base text-foreground/70 sm:text-lg"
                data-speakable
              >
                A unified management layer that scales with you — so you can
                grow margin and headcount without growing the back office.
              </p>
            </div>

            <div className="rounded-3xl bg-background p-5 sm:p-7">
              <div className="flex w-full items-center justify-between rounded-2xl bg-accent px-5 py-3 text-foreground">
                <span className="inline-flex items-center gap-2 font-display text-lg tracking-tight">
                  <MapPin aria-hidden className="size-4" />
                  South London
                </span>
              </div>

              <MetricRow
                label="Sales"
                value="€33,796.10"
                deltaLabel="25%"
                deltaTone="up"
                forecastLabel="Forecast"
                forecastValue="€113,109.77"
              />

              <MetricRow
                label="Labour"
                value="€8,195.93"
                deltaLabel="+9%"
                deltaTone="warn"
                forecastLabel="Forecast"
                forecastValue="€13,287.07"
                className="mt-3"
              />
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
}

type MetricRowProps = {
  label: string;
  value: string;
  deltaLabel: string;
  deltaTone: "up" | "warn";
  forecastLabel: string;
  forecastValue: string;
  className?: string;
};

function MetricRow({
  label,
  value,
  deltaLabel,
  deltaTone,
  forecastLabel,
  forecastValue,
  className,
}: MetricRowProps) {
  return (
    <div className={`mt-4 rounded-2xl bg-card px-5 py-4 ${className ?? ""}`}>
      <div className="flex items-start justify-between">
        <span className="rounded-md bg-foreground/5 px-3 py-1 text-sm font-medium">
          {label}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm font-semibold ${
            deltaTone === "up"
              ? "bg-lime text-lime-foreground"
              : "bg-coral text-coral-foreground"
          }`}
        >
          <ArrowUpRight aria-hidden className="size-3.5" />
          {deltaLabel}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl tracking-tight text-foreground sm:text-4xl">
        {value}
      </p>
      <div className="mt-3 border-t border-foreground/10 pt-3 text-xs text-muted-foreground">
        <p>{forecastLabel}</p>
        <p className="mt-0.5 text-foreground/60">{forecastValue}</p>
      </div>
    </div>
  );
}
