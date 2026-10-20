// Relative, not "@/": next.config.ts imports this file too.
import { siteConfig } from "./site";

/*
 * Content-Security-Policy for every page, built per request by proxy.ts.
 *
 * WHY a nonce (and therefore dynamic rendering): the App Router inlines each
 * page's RSC payload as ~25-30 `<script>self.__next_f.push(...)</script>` tags
 * whose contents differ per page and per build. A static header cannot carry
 * hashes for those, so a static-rendered page can only run under a CSP that
 * allows 'unsafe-inline' scripts - which is exactly what an XSS-safe CSP must
 * not do. With a per-request nonce, Next stamps the nonce on its own scripts
 * and 'strict-dynamic' extends trust to whatever those scripts load (GA4,
 * HubSpot, Vercel Analytics), so no host list has to be exhaustive.
 *
 * The host lists below still matter: browsers without 'strict-dynamic' (CSP2)
 * fall back to them, and connect/img/frame/font sources are always checked.
 * Sources: Google's GA4 CSP guide (developers.google.com/tag-platform/security/
 * guides/csp) and HubSpot's published list (knowledge.hubspot.com, "SSL and
 * domain security in HubSpot"), cut to the tools this site actually loads.
 */

/**
 * Report-only until the reports come back clean on production; then set to
 * true. While false, an enforcing `frame-ancestors 'self'` is still sent from
 * next.config.ts, because a report-only policy cannot carry frame-ancestors.
 */
export const CSP_ENFORCE = false;

/** Header name for the full policy, given the switch above. */
export const CSP_HEADER = CSP_ENFORCE
  ? "Content-Security-Policy"
  : "Content-Security-Policy-Report-Only";

/** Who may frame our pages. Enforced in both modes (see next.config.ts). */
export const FRAME_ANCESTORS = "frame-ancestors 'self'";

/** The HubSpot Meetings iframe on /contact. Env-overridable, so derived. */
function bookingOrigin(): string {
  try {
    return new URL(siteConfig.bookingUrl).origin;
  } catch {
    return "https://meetings-eu1.hubspot.com";
  }
}

/** A fresh, unguessable nonce: 128 random bits, base64. */
export function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export function buildCsp(
  nonce: string,
  {
    isDev = false,
    reportUri,
  }: { isDev?: boolean; reportUri?: string } = {},
): string {
  const directives = [
    "default-src 'self'",
    [
      "script-src 'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // React's dev build uses eval for error stacks. Never in production.
      isDev ? "'unsafe-eval'" : "",
      // CSP2 fallback only - ignored wherever 'strict-dynamic' is supported.
      "https://www.googletagmanager.com",
      "https://*.hs-scripts.com",
      "https://*.hs-analytics.net",
      "https://*.hs-banner.com",
      "https://*.hscollectedforms.net",
      "https://static.hsappstatic.net",
    ]
      .filter(Boolean)
      .join(" "),
    // 'unsafe-inline' for styles only: React renders style={{...}} as inline
    // style attributes on most pages, and the HubSpot banner injects <style>.
    // Inline styles cannot execute script. No nonce here - a nonce would make
    // browsers ignore 'unsafe-inline' and break those attributes.
    // fonts.googleapis.com: the HubSpot cookie banner can load its font there.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    [
      "img-src 'self' data: blob:",
      "https://*.google-analytics.com",
      "https://*.googletagmanager.com",
      // HubSpot tracking pixel (track-eu1.hubspot.com).
      "https://*.hubspot.com",
    ].join(" "),
    [
      // 'self' covers Vercel Analytics / Speed Insights (/_vercel/*).
      "connect-src 'self'",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://*.googletagmanager.com",
      "https://*.hubspot.com",
      "https://*.hubapi.com",
      "https://*.hs-banner.com",
      "https://*.hscollectedforms.net",
    ].join(" "),
    `frame-src ${bookingOrigin()}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Browsers ignore these two in a report-only policy (and warn), so they
    // are only sent once the policy enforces.
    ...(CSP_ENFORCE ? [FRAME_ANCESTORS, "upgrade-insecure-requests"] : []),
    ...(reportUri ? [`report-uri ${reportUri}`, "report-to csp"] : []),
  ];
  return directives.join("; ");
}
