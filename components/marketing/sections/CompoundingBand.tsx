import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { Section } from "@/components/marketing/primitives/Section";
import { CompoundingChart } from "@/components/marketing/visuals/CompoundingChart";

/**
 * Slim full-width band that closes the loop section: "and then it
 * compounds." Reuses `CompoundingChart` unmodified, wrapped to a max width
 * so its own card doesn't fight this band's proportions.
 */
export function CompoundingBand() {
  return (
    <Section id="compounds" surface="cream" className="py-14 md:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <Eyebrow>The compounding loop</Eyebrow>
          <h2
            className="display-md mt-4 max-w-md text-balance text-foreground"
            style={{ letterSpacing: "-0.02em" }}
          >
            And then it compounds.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Most tools reset every month. HeyOtis gets sharper: every move it
            proves - or disproves - teaches it what to recommend next, for
            your brand and your category.
          </p>
        </div>
        <div className="mx-auto w-full max-w-md">
          <CompoundingChart />
        </div>
      </div>
    </Section>
  );
}
