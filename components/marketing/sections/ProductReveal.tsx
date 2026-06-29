import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { MockDashboard } from "@/components/marketing/visuals/MockDashboard";

export function ProductReveal() {
  return (
    <section id="product" className="surface-cream">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-4 pb-2">
            <Eyebrow>The platform</Eyebrow>
            <h2
              className="display-md max-w-2xl text-balance text-foreground"
              style={{ letterSpacing: "-0.02em" }}
            >
              Your brand&rsquo;s standing in AI search, in one place
            </h2>
          </div>
        }
      >
        <MockDashboard
          variant="overview"
          className="h-full border-0 bg-card shadow-none"
        />
      </ContainerScroll>
    </section>
  );
}
