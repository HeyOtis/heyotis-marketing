import Link from "next/link";
import { Container } from "@/components/marketing/Container";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/* Marketing-site privacy notice. Deliberately scoped to THIS site (heyotis.ai):
   the logged-in platform at app.heyotis.ai has its own, stricter notice, because
   the platform uses only necessary + functional cookies whereas this site runs
   analytics and (potentially) advertising cookies behind consent. Keep the two
   cross-linked rather than merged - conflating them would misstate both.

   Entity details come from siteConfig.legal so they can't drift from the
   platform's policies. */

const { legal } = siteConfig;

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How HeyOtis Ltd collects and uses personal data on heyotis.ai - cookies, analytics, the booking widget, your rights under UK GDPR, and how to contact us.",
  path: "/privacy",
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* Cookie table. Keep this in step with what the site actually loads:
   components/analytics/Analytics.tsx and lib/analytics.ts are the source of
   truth. If a third party is added or removed there, update this table - an
   inaccurate cookie notice is worse than none. */
const COOKIES: {
  name: string;
  provider: string;
  purpose: string;
  category: string;
}[] = [
  {
    name: "__hs_opt_out, __hs_cookie_cat_pref",
    provider: "HubSpot",
    purpose:
      "Remembers your cookie choices so we don't ask again on every page.",
    category: "Strictly necessary",
  },
  {
    name: "hubspotutk, __hstc, __hssc, __hssrc",
    provider: "HubSpot",
    purpose:
      "Identifies your browser across visits so that, if you later book a call or contact us, we can see which pages you found useful and have a more informed conversation.",
    category: "Analytics",
  },
  {
    name: "_ga, _ga_*",
    provider: "Google Analytics 4",
    purpose:
      "Aggregated, pseudonymised measurement of how many people visit, which pages they read, and which channels bring them here.",
    category: "Analytics",
  },
];

const RIGHTS = [
  "Access a copy of the personal data we hold about you.",
  "Correct data that is inaccurate or incomplete.",
  "Erase your data where we have no overriding lawful basis to keep it.",
  "Restrict or object to our processing, including profiling.",
  "Withdraw consent for analytics or advertising cookies at any time, without affecting anything done before you withdrew it.",
  "Receive your data in a portable, machine-readable format.",
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy" },
        ])}
      />

      <section className="surface-cream pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
        <Container width="reading">
          <Eyebrow>Legal</Eyebrow>
          <h1
            className="display-lg mt-5 max-w-3xl text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            Privacy Policy
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            This notice explains what personal data {legal.entity} collects when
            you visit {siteConfig.url.replace("https://", "")}, why we collect
            it, and the control you have over it.
          </p>
          <p className="label-mono mt-6 text-[0.65rem] text-muted-foreground">
            Last updated {formatDate(legal.privacyUpdated)}
          </p>
        </Container>
      </section>

      <section className="surface-cream border-t border-border py-16 md:py-20">
        <Container width="reading">
          <div className="prose-like">
            <h2>1. Who we are</h2>
            <p>
              {legal.entity} (&ldquo;HeyOtis&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;) is the data controller for personal data
              collected through this website.
            </p>
            <p>
              {legal.entity}
              <br />
              Company No. {legal.companyNumber}
              <br />
              Registered office: {legal.address.join(", ")}
            </p>
            <p>
              For any privacy question or to exercise your rights, contact{" "}
              <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>.
            </p>
            <p>
              <strong>Scope.</strong> This notice covers this marketing website
              only. The HeyOtis platform at{" "}
              <a
                href={siteConfig.appUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                app.heyotis.ai
              </a>{" "}
              is governed by its own{" "}
              <a
                href={legal.appPrivacyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                platform privacy policy
              </a>
              , which differs because the product uses only strictly necessary
              and functional cookies.
            </p>

            <h2>2. What we collect</h2>
            <p>We collect three kinds of data on this site, and no more.</p>
            <h3>Information you give us</h3>
            <p>
              If you book a call or email us, we receive your name, email
              address, and anything else you choose to tell us — such as your
              company, your market, or the competitors you want measured. Booking
              also records your selected time and time zone.
            </p>
            <h3>Information collected automatically</h3>
            <p>
              With your consent where required, we collect pages viewed, how you
              arrived (search engine, referring site, or direct), approximate
              location derived from your IP address at city level, and general
              device and browser type. We do not collect precise location, and we
              do not attempt to identify you from this data alone.
            </p>
            <h3>Technical data needed to serve the site</h3>
            <p>
              Our hosting provider processes your IP address and request
              metadata in order to deliver pages and protect against abuse. This
              is necessary to operate the site and is not used to profile you.
            </p>
            <p>
              We do not knowingly collect data from anyone under 16, and we do
              not collect special category data (such as health, biometric, or
              political data) through this website.
            </p>

            <h2>3. Why we process it, and our lawful basis</h2>
            <ul>
              <li>
                <strong>To respond to you and hold the meeting you booked</strong>{" "}
                — necessary to take steps at your request prior to entering a
                contract, and our legitimate interest in answering enquiries.
              </li>
              <li>
                <strong>To operate and secure the website</strong> — our
                legitimate interest in a functioning, non-abused service.
              </li>
              <li>
                <strong>
                  To measure how the site performs, and to understand which
                  content is useful
                </strong>{" "}
                — your consent, where consent is required for the cookies
                involved.
              </li>
              <li>
                <strong>To send you information you asked for</strong> — your
                consent, withdrawable at any time.
              </li>
            </ul>
            <p>
              We do not sell your personal data, and we do not share it with
              third parties for their own marketing.
            </p>

            <h2>4. Cookies and similar technologies</h2>
            <p>
              A cookie is a small file stored by your browser. Where the law
              requires consent, <strong>no analytics or advertising cookie is
              set until you agree</strong> — our consent banner starts from a
              position of refusal, and analytics remain switched off until you
              choose otherwise. You can change or withdraw your choice at any
              time through the cookie settings link in the banner.
            </p>
            <p>
              We also honour{" "}
              <a
                href="https://globalprivacycontrol.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Global Privacy Control
              </a>
              . If your browser sends that signal, we switch off non-essential
              cookies automatically, without you needing to interact with the
              banner.
            </p>
            <div className="not-prose my-8 overflow-x-auto">
              <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4 font-semibold">Cookie</th>
                    <th className="py-3 pr-4 font-semibold">Set by</th>
                    <th className="py-3 pr-4 font-semibold">Purpose</th>
                    <th className="py-3 font-semibold">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map((c) => (
                    <tr key={c.name} className="border-b border-border/60">
                      <td className="py-3 pr-4 align-top font-mono text-xs text-muted-foreground">
                        {c.name}
                      </td>
                      <td className="py-3 pr-4 align-top">{c.provider}</td>
                      <td className="py-3 pr-4 align-top text-muted-foreground">
                        {c.purpose}
                      </td>
                      <td className="py-3 align-top">{c.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Our hosting provider also measures page performance and visitor
              counts <strong>without setting any cookie</strong> and without
              storing any identifier that could single you out, so this needs no
              consent.
            </p>

            <h2>5. Who we share data with</h2>
            <p>
              We use a small number of established providers, each acting on our
              instructions under a data processing agreement:
            </p>
            <ul>
              <li>
                <strong>HubSpot</strong> — our CRM, the booking widget, and the
                cookie consent banner. Data is held in HubSpot&rsquo;s European
                Union data centre.
              </li>
              <li>
                <strong>Google (Analytics)</strong> — aggregated website
                measurement, only where you have consented.
              </li>
              <li>
                <strong>Vercel</strong> — website hosting and cookieless
                performance measurement.
              </li>
              <li>
                <strong>Google Workspace</strong> — our email, if you contact us.
              </li>
            </ul>
            <p>
              We may also disclose data where we are legally required to, or to
              establish or defend legal claims. If our business is sold or
              reorganised, data may transfer to the acquirer, and we will tell
              you beforehand.
            </p>
            <p>
              A current list of our processors is available on request from{" "}
              <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>.
            </p>

            <h2>6. International transfers</h2>
            <p>
              Some of our providers process data outside the United Kingdom.
              Where that happens we rely on UK adequacy regulations or on the UK
              International Data Transfer Agreement (or the EU Standard
              Contractual Clauses with the UK Addendum), together with
              appropriate technical safeguards. You can ask us for details of the
              safeguards applying to a particular transfer.
            </p>

            <h2>7. How long we keep it</h2>
            <ul>
              <li>
                <strong>Enquiries and booking records</strong> — kept in our CRM
                for up to 24 months after our last contact with you, then deleted
                or anonymised.
              </li>
              <li>
                <strong>Analytics data</strong> — retained for up to 14 months.
              </li>
              <li>
                <strong>Consent records</strong> — kept for as long as needed to
                show we obtained consent properly.
              </li>
              <li>
                <strong>Server and security logs</strong> — kept for a short
                period for security and troubleshooting.
              </li>
            </ul>

            <h2>8. Your rights</h2>
            <p>
              Under the UK GDPR (and the EU GDPR where it applies to you), you
              have the right to:
            </p>
            <ul>
              {RIGHTS.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p>
              Email{" "}
              <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>{" "}
              and we will respond within one month. Exercising these rights is
              free, and we will not treat you differently for doing so.
            </p>
            <p>
              If you are unhappy with how we have handled your data you can
              complain to the {legal.regulator} at{" "}
              <a
                href={legal.regulatorUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                ico.org.uk
              </a>
              . We would appreciate the chance to put things right first. If you
              are in the EEA, you may instead complain to your local supervisory
              authority.
            </p>

            <h2>9. Security</h2>
            <p>
              We use appropriate technical and organisational measures to protect
              personal data, including encryption in transit, strict access
              controls, and regular review of the providers we rely on. No system
              is perfectly secure, but we take this seriously and will notify you
              and the regulator where the law requires it.
            </p>

            <h2>10. Changes to this notice</h2>
            <p>
              If we change how we use personal data we will update this page and
              the date above. Where a change is significant we will tell you
              directly rather than rely on you re-reading this page.
            </p>

            <h2>11. Contact</h2>
            <p>
              Privacy and data protection:{" "}
              <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>
              <br />
              General enquiries:{" "}
              <a href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
              <br />
              Post: {legal.entity}, {legal.address.join(", ")}
            </p>
            <p>
              See also our <Link href="/terms">Terms of Use</Link>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
