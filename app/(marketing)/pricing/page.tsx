import { Container } from "@/components/marketing/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  description: "HeyOtis pricing — placeholder.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <Container className="max-w-4xl py-16">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Pricing", href: "/pricing" },
        ])}
      />
      <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-6 text-lg text-muted-foreground" data-speakable>
        Placeholder. Each plan should be its own semantic block with price,
        features, and a CTA — easy for AI engines to summarize.
      </p>
    </Container>
  );
}
