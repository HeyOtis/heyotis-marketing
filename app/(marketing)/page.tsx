import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Hero } from "@/components/marketing/sections/Hero";
import { LogoStrip } from "@/components/marketing/sections/LogoStrip";
import { ValueStatement } from "@/components/marketing/sections/ValueStatement";
import { PlatformShowcase } from "@/components/marketing/sections/PlatformShowcase";
import { FeatureTwoCol } from "@/components/marketing/sections/FeatureTwoCol";
import { ResultsGrid } from "@/components/marketing/sections/ResultsGrid";

export const metadata = buildMetadata({
  description: siteConfig.description,
  path: "/",
});

const FAQS = [
  {
    question: `What is ${siteConfig.name}?`,
    answer:
      "An agentic AI operating system for multi-site operators — forecasting, rostering, ordering and payroll in one platform.",
  },
  {
    question: "Who is it for?",
    answer:
      "Restaurant groups, coffee chains and multi-venue hospitality operators who want to grow margin without growing back-office headcount.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqPageSchema(FAQS)} />
      <Hero />
      <LogoStrip />
      <ValueStatement />
      <PlatformShowcase />
      <FeatureTwoCol />
      <ResultsGrid />
    </>
  );
}
