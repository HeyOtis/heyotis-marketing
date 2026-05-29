import { JsonLd } from "@/components/seo/JsonLd";
import { faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Hero } from "@/components/marketing/sections/Hero";
import { LogoStrip } from "@/components/marketing/sections/LogoStrip";
import { ValueStatement } from "@/components/marketing/sections/ValueStatement";
import { PlatformShowcase } from "@/components/marketing/sections/PlatformShowcase";
import { FeatureTwoCol } from "@/components/marketing/sections/FeatureTwoCol";

export const metadata = buildMetadata({
  description: siteConfig.description,
  path: "/",
});

const FAQS = [
  {
    question: `What is ${siteConfig.name}?`,
    answer:
      "An AI brand intelligence platform paired with hands-on GEO strategy. It shows how AI assistants interpret, present and recommend your brand — then turns that into a campaign-led plan to improve it.",
  },
  {
    question: `Is ${siteConfig.name} a tool or a service?`,
    answer:
      "Both, by design. The platform gives you the intelligence; the team gives you the strategy.",
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
    </>
  );
}
