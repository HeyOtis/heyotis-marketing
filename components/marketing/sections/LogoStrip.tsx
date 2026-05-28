import { Container } from "@/components/marketing/Container";
import { Card } from "@/components/ui/card";

const BRANDS = [
  "Berryfield",
  "Tasty",
  "Badiani",
  "Black Sheep",
  "Bubble Citea",
  "Roasting Plant",
  "Camile",
  "Cup",
];

export function LogoStrip() {
  return (
    <section className="surface-cream py-20 sm:py-28">
      <Container>
        <h2 className="text-center font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
          The operators powering Heyotis
        </h2>

        <div className="relative mt-14 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
          />
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {BRANDS.slice(0, 6).map((brand) => (
              <li key={brand}>
                <Card className="flex h-24 items-center justify-center rounded-2xl border-transparent bg-card shadow-none">
                  <span
                    className="font-display text-xl tracking-tight text-foreground/80"
                  >
                    {brand}
                  </span>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
