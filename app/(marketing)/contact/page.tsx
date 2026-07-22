import { CalendarCheck, Check, Clock, Mail } from "lucide-react";
import { Container } from "@/components/marketing/Container";
import { Section } from "@/components/marketing/primitives/Section";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { AiSourceLogos } from "@/components/marketing/visuals/AiSourceLogos";
import { HubSpotMeetings } from "@/components/marketing/visuals/HubSpotMeetings";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Book a chat",
  description:
    "Book a 20-minute HeyOtis walkthrough - see your Share of Voice and competitive rank across ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews, plus a sample report.",
  path: "/contact",
});

const EXPECT: string[] = [
  "We run a live campaign of buyer-intent prompts against ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews for your brand.",
  "You see your Share of Voice and how you rank against the competitors you name.",
  "We show the citations and sources the assistants are leaning on to build their answers.",
  "You leave with a sample report and a prioritised view of where to act first.",
];

export default function ContactPage() {
  const emailHref = `mailto:${siteConfig.contactEmail}`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ])}
      />

      {/* Hero */}
      <section className="surface-cream relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-18%] h-[420px] w-[min(720px,90vw)] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.68 0.1 280 / 0.18), transparent)",
            }}
          />
        </div>

        <Container className="relative pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
          <Eyebrow>Contact</Eyebrow>
          <h1
            className="display-hero mt-5 max-w-3xl text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            Book a chat - and watch{" "}
            <span className="text-periwinkle">AI answer for your brand.</span>
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            Spend 20 minutes with us. We&apos;ll run your brand against ChatGPT,
            Claude, Gemini, Perplexity and Google AI Overviews live, show you where you stand against
            your competitors, and walk you through a sample report - no prep
            required.
          </p>
          <div className="mt-8">
            <BookCta variant="salmon" nudge />
          </div>
        </Container>
      </section>

      {/* Two-column: what to expect + booking embed */}
      <Section surface="card" id="book">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left - supporting copy */}
          <div>
            <Eyebrow>What to expect</Eyebrow>
            <h2
              className="display-sm mt-4 text-balance"
              style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
            >
              A working session, not a sales pitch
            </h2>

            <ul className="mt-8 flex flex-col gap-5">
              {EXPECT.map((item) => (
                <li key={item} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-accent">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-base leading-relaxed text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8">
              <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Clock className="size-4 text-accent" aria-hidden />
                We usually reply within one business day.
              </p>
              <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="size-4 text-accent" aria-hidden />
                {/* One span so the flex gap separates icon and sentence only,
                    not every text node inside the sentence. */}
                <span>
                  Prefer email? Reach us at{" "}
                  <a
                    href={emailHref}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {siteConfig.contactEmail}
                  </a>
                  .
                </span>
              </p>
            </div>
          </div>

          {/* Right - booking embed */}
          <div>
            <div className="flex items-center gap-2.5 pb-4">
              <CalendarCheck className="size-4 text-accent" aria-hidden />
              <p className="label-mono text-[0.65rem] text-muted-foreground">
                Pick a time
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-sm">
              <HubSpotMeetings
                src={`${siteConfig.bookingUrl}?embed=true`}
                className="rounded-xl"
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Trouble loading? Email us at{" "}
              <a
                href={emailHref}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* Slim reassurance close */}
      <Section surface="cream">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <p className="text-balance text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
            No hard sell - just a clear picture of how AI sees your brand today.
          </p>
          <AiSourceLogos withText className="justify-center" />
        </div>
      </Section>
    </>
  );
}
