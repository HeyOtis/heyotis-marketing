import { Container } from "@/components/marketing/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.name}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="max-w-2xl py-16">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ])}
      />
      <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-6 text-lg text-muted-foreground" data-speakable>
        Reach us at{" "}
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="text-foreground underline-offset-4 hover:underline"
        >
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </Container>
  );
}
