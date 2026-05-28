import { Container } from "@/components/marketing/Container";

type Stat = {
  category: string;
  dotClass: string;
  superscript?: string;
  value: string;
  caption: string;
};

const STATS: Stat[] = [
  {
    category: "Workforce Management",
    dotClass: "bg-teal",
    value: "10–25%",
    caption: "Lower cost of labour",
  },
  {
    category: "Inventory",
    dotClass: "bg-violet",
    superscript: "Up to",
    value: "50%",
    caption: "Less food waste",
  },
  {
    category: "Business Intelligence",
    dotClass: "bg-coral",
    value: "100+",
    caption: "Hours of admin saved every month",
  },
];

export function ResultsGrid() {
  return (
    <section className="surface-cream py-24 sm:py-32">
      <Container>
        <h2 className="text-center font-display text-5xl tracking-tight sm:text-6xl md:text-7xl">
          Results that
          <br className="hidden sm:block" /> hit the P&amp;L.
        </h2>

        <div className="mt-20 grid divide-y divide-foreground/15 border-y border-foreground/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {STATS.map((stat) => (
            <article
              key={stat.category}
              className="flex flex-col items-center justify-between gap-12 px-6 py-12 text-center sm:px-10"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1.5 text-sm">
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full ${stat.dotClass}`}
                />
                {stat.category}
              </span>
              <div>
                {stat.superscript && (
                  <p className="font-display text-xl tracking-tight text-foreground/70 sm:text-2xl">
                    {stat.superscript}
                  </p>
                )}
                <p className="font-display text-6xl tracking-tighter sm:text-7xl md:text-8xl">
                  {stat.value}
                </p>
              </div>
              <p className="max-w-xs text-base text-foreground/70 sm:text-lg">
                {stat.caption}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
