import { Container } from "@/components/marketing/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description: "About HeyOtis — placeholder. Update in app/(marketing)/about/page.tsx.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-16">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ])}
      />
      <h1 className="text-4xl font-semibold tracking-tight">About</h1>
      <p className="mt-6 text-lg text-muted-foreground" data-speakable>
        Placeholder about copy. Replace with company narrative, team, and
        mission once design is in.
      </p>
    </Container>
  );
}
