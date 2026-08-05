import { Container } from "@/components/marketing/Container";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/* Crawler self-identification page. OtisBot sends
   `OtisBot/1.0 (+https://heyotis.ai/bot)` as its user-agent on every request -
   this page IS that URL, so it must live at exactly /bot. A site owner who
   sees us in their logs looks this URL up to decide whether to allow or block
   us; a 404 here is the worst possible answer. It is also a documentation
   prerequisite for Cloudflare Verified Bots.

   Content sourced from docs/otisbot-public-page.md in heyotis-platform-api
   (2026-08-04). Keep this page in step with that doc if it's revised - and
   in step with what the crawler actually does in code, not aspiration. */

const BOT_PAGE_UPDATED = "2026-08-04";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const metadata = buildMetadata({
  title: "OtisBot",
  description:
    "How to identify OtisBot, the HeyOtis web crawler - its user-agent string, how to allow or block it in robots.txt, how it behaves, and how to reach us.",
  path: "/bot",
});

export default function BotPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "OtisBot", href: "/bot" },
        ])}
      />

      <section className="surface-cream pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
        <Container className="max-w-3xl">
          <Eyebrow>For site owners</Eyebrow>
          <h1
            className="display-lg mt-5 max-w-3xl text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            OtisBot
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            OtisBot is the web crawler operated by HeyOtis. It visits websites
            to measure how they are represented in AI search - whether a page
            is retrievable, what structured data it publishes, and whether AI
            assistants are able to reach it.
          </p>
          <p className="label-mono mt-6 text-[0.65rem] text-muted-foreground">
            Last updated {formatDate(BOT_PAGE_UPDATED)}
          </p>
        </Container>
      </section>

      <section className="surface-cream border-t border-border py-20 md:py-28 2xl:py-36">
        <Container className="max-w-3xl">
          <div className="prose-like">
            <h2>About OtisBot</h2>
            <p>
              We crawl on behalf of brands who ask us to analyse their own
              site, and we look at a small number of publicly available
              competitor pages to provide comparison. We do not collect
              personal data, we do not attempt to access anything behind a
              login, and we do not use what we fetch to train models.
            </p>

            <h2>How to identify us</h2>
            <p>OtisBot sends this user-agent string on every request:</p>
            <pre>
              <code>OtisBot/1.0 (+https://heyotis.ai/bot)</code>
            </pre>
            <p>
              We never disguise ourselves as a browser and never send another
              crawler&rsquo;s name. If something calling itself OtisBot
              ignores your <code>robots.txt</code>, hammers your server, or
              tries to reach pages behind a login, it is not us &mdash; and
              we&rsquo;d like to know about it.
            </p>

            <h3>Why we don&rsquo;t publish IP ranges</h3>
            <p>
              Many crawlers publish a list of addresses they crawl from. We
              deliberately don&rsquo;t, because ours would tell you nothing.
              We run on shared cloud infrastructure, so our outbound addresses
              belong to a pool used by thousands of unrelated services. Anyone
              could send you traffic from that same pool while calling
              themselves OtisBot.
            </p>
            <p>
              Publishing it would also be an unreasonable thing to ask of you:
              allowlisting our range would mean allowlisting several hundred
              addresses we don&rsquo;t control. We would rather give you no
              signal than a misleading one.
            </p>
            <div className="not-prose my-6 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
              <strong className="font-medium text-foreground">
                To control OtisBot today,
              </strong>{" "}
              use the user-agent in <code>robots.txt</code> below &mdash; we
              read it on every crawl. To{" "}
              <em>verify</em> a request really came from us, see{" "}
              <a href="#verification">Verification</a>: we are implementing
              cryptographic request signing, which proves identity in a way an
              IP list cannot.
            </div>

            <h2>How to control OtisBot</h2>
            <p>
              We read and obey <code>robots.txt</code> on every crawl, and we
              honour <code>Crawl-delay</code>.
            </p>
            <p>To block OtisBot entirely:</p>
            <pre>
              <code>{"User-agent: OtisBot\nDisallow: /"}</code>
            </pre>
            <p>To allow OtisBot but keep part of your site private:</p>
            <pre>
              <code>{"User-agent: OtisBot\nDisallow: /private/"}</code>
            </pre>
            <p>
              Changes take effect on our next visit - we re-read{" "}
              <code>robots.txt</code> each time rather than caching it between
              crawls.
            </p>

            <h2>How we behave</h2>
            <ul>
              <li>
                <strong>Low volume.</strong> A typical analysis fetches a
                handful of pages per site: your homepage, <code>
                  robots.txt
                </code>, <code>sitemap.xml</code>, <code>llms.txt</code> if
                present, and a small sample of product and content pages. We
                are not a bulk crawler.
              </li>
              <li>
                <strong>Rate limited per domain</strong>, with an automatic
                backoff when a site returns <code>429</code>.
              </li>
              <li>
                <strong>We stop when asked.</strong> Repeated errors from a
                host end the crawl for that host rather than triggering
                retries.
              </li>
              <li>
                <strong>Conditional requests</strong> where supported, so an
                unchanged page costs you almost nothing.
              </li>
            </ul>

            <h2>If you would rather we did not</h2>
            <p>
              Block us in <code>robots.txt</code> and we will stop - that is
              the whole mechanism, and we do not work around it.
            </p>
            <p>
              If you&rsquo;d prefer to talk to a person, email{" "}
              <a href="mailto:hello@heyotis.ai?subject=OtisBot">
                hello@heyotis.ai
              </a>{" "}
              with &ldquo;OtisBot&rdquo; in the subject, or use our{" "}
              <a href="/contact">contact page</a>. We&rsquo;ll answer.
            </p>

            <h2 id="verification">Verification</h2>
            <p>
              We are working toward cryptographic request signing under{" "}
              <a
                href="https://datatracker.ietf.org/doc/draft-meunier-web-bot-auth-architecture/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Web Bot Auth
              </a>{" "}
              (RFC 9421 HTTP Message Signatures) &mdash; the emerging IETF
              standard for exactly this problem, already supported at the edge
              by Cloudflare and used by several major AI crawlers. Our requests
              will carry a signature you can check against a public key, which
              proves identity cryptographically rather than by inference from
              an address.
            </p>
            <p>
              This page will carry the key location as soon as it ships. Until
              then, <code>robots.txt</code> is the reliable control, and we
              honour it on every crawl.
            </p>

            <p>
              See also our <a href="/privacy">Privacy Policy</a> and{" "}
              <a href="/terms">Terms of Use</a>, or contact{" "}
              <a href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>{" "}
              for anything else.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
