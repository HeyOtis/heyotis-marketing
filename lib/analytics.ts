/*
 * Measurement configuration, in one place. Every third party is env-gated, so
 * the site ships and runs correctly with none of these set - which is what we
 * want for local dev and preview deploys, where production data shouldn't be
 * polluted.
 *
 * Set these in the Vercel project, PRODUCTION scope only:
 *   NEXT_PUBLIC_GA_ID              G-XXXXXXXXXX   GA4 measurement ID
 *   NEXT_PUBLIC_HUBSPOT_PORTAL_ID  1234567        HubSpot Hub ID
 *
 * Vercel Analytics / Speed Insights need no ID - they bind to the project and
 * are cookieless, so they run everywhere with no consent gate.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

/**
 * Google Consent Mode v2 defaults. Must execute before gtag.js, so this is
 * rendered with `strategy="beforeInteractive"` directly in app/layout.tsx (the
 * App Router requires beforeInteractive scripts to live in the root layout).
 *
 * Everything starts denied: GA4 still loads and sends cookieless pings - so
 * modelled conversions keep working - but writes no cookies or identifiers
 * until consent is granted. That's what makes a default-denied launch lawful in
 * the EU/UK without discarding all signal. `wait_for_update` gives the HubSpot
 * banner 500ms to report a stored choice before GA settles on denied.
 *
 * `region` scopes the denial to the EU/EEA + UK/CH/NO/IS/LI - the jurisdictions
 * that actually require prior opt-in for analytics cookies. HeyOtis Ltd is a
 * UK-established controller, so UK GDPR and PECR bind us for those visitors.
 * Everywhere else defaults to granted, which is the accepted posture in the US,
 * AU and NZ (notification regimes, not prior-consent ones). NZ was previously in
 * this list out of caution and has been removed deliberately - it was costing a
 * core market its analytics for no legal benefit.
 */
export const CONSENT_DEFAULTS = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
  region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','GB','CH','NO','IS','LI']
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
`;

/**
 * Bridge: HubSpot's cookie banner is our single consent UI - it's free, and
 * HubSpot is already where every lead lands. This forwards the visitor's choice
 * from HubSpot's privacy API into Google Consent Mode, so one banner governs
 * both HubSpot's cookies and GA4's.
 *
 * `addPrivacyConsentListener` fires on load with any stored choice and again on
 * every change, so it stays correct across repeat visits. HubSpot has no
 * separate ad_user_data / ad_personalization category, so both follow its
 * `advertisement` category.
 *
 * IMPORTANT: this is inert until the banner is switched on in HubSpot
 * (Settings > Privacy & Consent > Cookies). Until then HubSpot reports no
 * consent object, GA4 stays at the denied defaults, and you will see little to
 * no EU analytics data. Turn the banner on.
 */
export const HUBSPOT_CONSENT_BRIDGE = `
var _hsp = window._hsp = window._hsp || [];
_hsp.push(['addPrivacyConsentListener', function(consent) {
  if (typeof gtag !== 'function' || !consent) return;
  var c = consent.categories || {};
  // Two banner shapes to handle. With "Allow opt-in by category" ticked,
  // HubSpot reports per-category booleans. Without it, it reports a single
  // all-or-nothing decision on consent.allowed and categories may be absent -
  // in which case reading c.analytics alone would be undefined, i.e. denied
  // even for a visitor who just accepted. Fall back to the single decision.
  var analytics = 'analytics' in c ? !!c.analytics : !!consent.allowed;
  var ads = 'advertisement' in c ? !!c.advertisement : !!consent.allowed;
  gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: ads ? 'granted' : 'denied',
    ad_user_data: ads ? 'granted' : 'denied',
    ad_personalization: ads ? 'granted' : 'denied'
  });
}]);
`;

/**
 * HubSpot tracking + banner loader. This account is on the EU1 data centre -
 * the same one the Meetings link uses (meetings-eu1.hubspot.com) - so the
 * script host is js-eu1, not js. A US-region portal would use js.hs-scripts.com.
 */
export function hubspotScriptSrc(portalId: string) {
  return `https://js-eu1.hs-scripts.com/${portalId}.js`;
}
