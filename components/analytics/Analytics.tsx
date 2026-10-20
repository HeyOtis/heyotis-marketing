import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  GA_ID,
  HUBSPOT_PORTAL_ID,
  HUBSPOT_CONSENT_BRIDGE,
  hubspotScriptSrc,
} from "@/lib/analytics";

/**
 * Everything measurement-related except the Consent Mode defaults, which have
 * to run before gtag.js and therefore live inline in app/layout.tsx. See
 * lib/analytics.ts for what each env var does and how consent is wired.
 *
 * `nonce` is the per-request CSP nonce (proxy.ts). Inline next/script tags are
 * injected client-side and only carry a nonce when given one explicitly.
 */
export function Analytics({ nonce }: { nonce?: string }) {
  return (
    <>
      {/* HubSpot: page tracking + the cookie banner that gates GA4. */}
      {HUBSPOT_PORTAL_ID ? (
        <>
          <Script
            id="hubspot-tracking"
            strategy="afterInteractive"
            src={hubspotScriptSrc(HUBSPOT_PORTAL_ID)}
            nonce={nonce}
          />
          {GA_ID ? (
            <Script
              id="hubspot-consent-bridge"
              strategy="afterInteractive"
              nonce={nonce}
              // Static string, no user input interpolated.
              dangerouslySetInnerHTML={{ __html: HUBSPOT_CONSENT_BRIDGE }}
            />
          ) : null}
        </>
      ) : null}

      {/* GA4. Tracks App Router route changes itself - no manual pageviews. */}
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} nonce={nonce} /> : null}

      {/* Cookieless, so no consent gate required. */}
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
