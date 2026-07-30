import Link from "next/link";
import { Container } from "@/components/marketing/Container";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/* Terms of USE for this marketing website - deliberately NOT a SaaS agreement.
   The platform at app.heyotis.ai has its own Terms of Service covering the
   product (accounts, data processing, liability caps, termination). Duplicating
   those here would create two sets of contract terms that could conflict, so
   this document governs the website only and defers to the platform terms for
   the product itself. */

const { legal } = siteConfig;

export const metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "The terms governing your use of the HeyOtis marketing website - content, intellectual property, booking a consultation, and the limits of what's published here.",
  path: "/terms",
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Terms of Use", href: "/terms" },
        ])}
      />

      <section className="surface-cream pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
        <Container>
          <Eyebrow>Legal</Eyebrow>
          <h1
            className="display-lg mt-5 max-w-3xl text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            Terms of Use
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            These terms govern your use of this website. Use of the HeyOtis
            platform itself is governed by a separate agreement.
          </p>
          <p className="label-mono mt-6 text-[0.65rem] text-muted-foreground">
            Last updated {formatDate(legal.termsUpdated)}
          </p>
        </Container>
      </section>

      <section className="surface-cream border-t border-border py-16 md:py-20">
        <Container>
          <div className="prose-like">
            <h2>1. Who these terms are with</h2>
            <p>
              This website is operated by {legal.entity}, Company No.{" "}
              {legal.companyNumber}, registered office{" "}
              {legal.address.join(", ")}.
            </p>
            <p>
              By using this website you accept these terms. If you do not accept
              them, please stop using the site.
            </p>

            <h2>2. What these terms do and don&rsquo;t cover</h2>
            <p>
              These terms cover this marketing website only. Access to and use of
              the HeyOtis platform at{" "}
              <a
                href={siteConfig.appUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                app.heyotis.ai
              </a>{" "}
              is governed by the{" "}
              <a
                href={legal.appTermsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                platform Terms of Service
              </a>
              . If you have signed a separate order form or enterprise agreement
              with us, that agreement prevails over both documents for the
              services it covers.
            </p>

            <h2>3. The content on this site is information, not advice</h2>
            <p>
              Our articles, guides, case studies, benchmarks and other published
              material are provided for general information. They are not
              professional, legal, financial or marketing advice for your
              specific circumstances, and you should not treat them as a
              substitute for advice tailored to your business.
            </p>
            <p>
              We take care to keep content accurate at the time of publication,
              but AI assistants and search engines change quickly. We do not
              warrant that content remains current, complete or free of error.
            </p>

            <h2>4. No guarantee of results</h2>
            <p>
              Where this site describes outcomes achieved by HeyOtis or its
              customers, those are illustrations of what has happened in
              particular cases. They are not a promise or forecast of what will
              happen for you.
            </p>
            <p>
              We do not guarantee any ranking, citation, recommendation,
              placement, share of voice, traffic volume or commercial result.
              Outcomes depend on factors outside our control, including the
              behaviour of third-party AI assistants and search engines, your
              market, and your own execution.
            </p>

            <h2>5. Booking a consultation</h2>
            <p>
              Booking a call through this site does not create a contract for
              services and places you under no obligation. Either of us may
              reschedule or cancel. Anything we show or discuss during a call —
              including sample reports and preliminary measurements — is
              indicative, based on a limited sample of prompts at a moment in
              time, and provided without warranty.
            </p>
            <p>
              Please don&rsquo;t send us confidential information before a
              confidentiality agreement is in place.
            </p>

            <h2>6. Intellectual property</h2>
            <p>
              All content on this site — text, design, graphics, code,
              methodology and the HeyOtis name and marks — belongs to{" "}
              {legal.entity} or its licensors and is protected by intellectual
              property law.
            </p>
            <p>
              You may view, download and print pages for your own internal
              business use, and you may quote short extracts if you credit
              HeyOtis and link to the source. You may not republish our content
              at scale, sell it, present it as your own, or use it to build or
              train a competing product or dataset without our written
              permission.
            </p>
            <p>
              Third-party names and logos shown on this site remain the property
              of their respective owners and are used to identify those
              organisations.
            </p>

            <h2>7. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                Use the site unlawfully, or in a way that damages it or impairs
                anyone else&rsquo;s use of it.
              </li>
              <li>
                Introduce malicious code, or attempt to gain unauthorised access
                to any part of the site or its infrastructure.
              </li>
              <li>
                Scrape or harvest content at a scale or rate that burdens the
                service, or circumvent any technical restriction we put in place.
              </li>
              <li>
                Misrepresent your identity or affiliation when contacting us or
                booking a call.
              </li>
            </ul>

            <h2>8. Links to other sites</h2>
            <p>
              Where we link to third-party websites we do so for convenience. We
              do not control them, do not endorse them by linking, and are not
              responsible for their content or their handling of your data.
            </p>

            <h2>9. Availability</h2>
            <p>
              We aim to keep the site available but do not guarantee
              uninterrupted access. We may change, suspend or withdraw all or
              part of the site, or these terms, at any time. Material changes to
              these terms will be reflected in the date above.
            </p>

            <h2>10. Liability</h2>
            <p>
              To the fullest extent permitted by law, we exclude liability for any
              indirect or consequential loss, and for any loss of profit,
              revenue, business, goodwill or data arising from your use of this
              website or reliance on its content.
            </p>
            <p>
              Nothing in these terms limits or excludes our liability for death
              or personal injury caused by negligence, for fraud or fraudulent
              misrepresentation, or for anything else that cannot lawfully be
              limited or excluded. If you are a consumer, these terms do not
              affect your statutory rights.
            </p>

            <h2>11. Privacy</h2>
            <p>
              Our <Link href="/privacy">Privacy Policy</Link> explains what
              personal data we collect through this site and how we handle it.
            </p>

            <h2>12. Governing law</h2>
            <p>
              These terms and any dispute arising from them are governed by the
              laws of England and Wales, and the courts of England and Wales have
              exclusive jurisdiction. If you are a consumer resident elsewhere in
              the UK, you may also bring proceedings in your local courts.
            </p>

            <h2>13. Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
              <br />
              Legal and data protection:{" "}
              <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>
              <br />
              Post: {legal.entity}, {legal.address.join(", ")}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
