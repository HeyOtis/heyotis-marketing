import { Container } from "@/components/marketing/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Features",
  description: "Heyotis features — placeholder.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <Container className="max-w-4xl py-16">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Features", href: "/features" },
        ])}
      />
      <h1 className="text-4xl font-semibold tracking-tight">Features</h1>
      <p className="mt-6 text-lg text-muted-foreground" data-speakable>
        Placeholder. List feature pillars with h2 sub-sections so search and AI
        engines can extract them cleanly.
      </p>
    </Container>
  );
}
