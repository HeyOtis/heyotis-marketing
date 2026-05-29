import { Card } from "@/components/ui/card";
import { Container } from "@/components/marketing/Container";

const STEPS = [
  {
    title: "Define the campaign",
    description:
      "Set the objective, brand, market, products, competitors, personas and buying journeys that matter.",
  },
  {
    title: "Build the intelligence layer",
    description:
      "Measure how AI assistants understand, compare and recommend your brand across the prompts that shape decisions.",
  },
  {
    title: "Diagnose the gaps",
    description:
      "Identify the weak or missing signals that explain why your brand is absent, misrepresented or losing to competitors.",
  },
  {
    title: "Prioritise the strategy",
    description:
      "Turn the findings into a focused plan across content, product pages, retailer presence, reviews, PR and comparison assets.",
  },
  {
    title: "Track the outcome",
    description:
      "Measure whether the campaign improves recommendation share, AI presence, message accuracy and commercial outcomes.",
  },
];

export function PlatformShowcase() {
  return (
    <section id="how-it-works" className="surface-cream scroll-mt-24 pb-12">
      <Container>
        <Card className="overflow-hidden rounded-[2rem] border-transparent bg-card p-8 shadow-none sm:p-12 lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
                A campaign-led loop
                <br />
                for AI discovery.
              </h2>
              <p
                className="mt-6 max-w-md text-base text-foreground/70 sm:text-lg"
                data-speakable
              >
                Not a dashboard for dashboard&rsquo;s sake. A campaign system
                that measures how AI presents your brand to consumers — then
                turns that intelligence into action.
              </p>
            </div>

            <ol className="rounded-3xl bg-background p-5 sm:p-7">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className={`flex gap-4 rounded-2xl bg-card px-5 py-4 ${
                    i > 0 ? "mt-3" : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-base text-accent-foreground"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm text-foreground/60">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Card>
      </Container>
    </section>
  );
}
