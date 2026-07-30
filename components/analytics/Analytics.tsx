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
 */
export function Analytics() {
  return (
    <>
      {/* HubSpot: page tracking + the cookie banner that gates GA4. */}
      {HUBSPOT_PORTAL_ID ? (
        <>
          <Script
            id="hubspot-tracking"
            strategy="afterInteractive"
            src={hubspotScriptSrc(HUBSPOT_PORTAL_ID)}
          />
          {GA_ID ? (
            <Script
              id="hubspot-consent-bridge"
              strategy="afterInteractive"
              // Static string, no user input interpolated.
              dangerouslySetInnerHTML={{ __html: HUBSPOT_CONSENT_BRIDGE }}
            />
          ) : null}
        </>
      ) : null}

      {/* GA4. Tracks App Router route changes itself - no manual pageviews. */}
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}

      {/* Cookieless, so no consent gate required. */}
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
