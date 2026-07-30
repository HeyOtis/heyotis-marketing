"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

/*
 * Booking conversion tracking for the inline HubSpot Meetings embed.
 *
 * WHY postMessage: the widget renders in a cross-origin iframe on
 * meetings-eu1.hubspot.com, and the booking completes inside it with no parent
 * navigation. GA4 therefore cannot observe the conversion - no pageview, no form
 * submit, nothing in our DOM changes. Google's cross-domain measurement is not
 * an option either, because that requires our tag on both domains and we don't
 * control HubSpot's. The iframe posting a message to us is the only real signal,
 * and it's the mechanism HubSpot documents for exactly this.
 *
 * Clicks on the header/CTA "Book a chat" buttons (which open HubSpot in a new
 * tab rather than the embed) are already captured separately by GA4 Enhanced
 * Measurement as outbound `click` events, so they need nothing here.
 */

/** Hosts we accept booking messages from. */
function isTrustedHubSpotOrigin(origin: string): boolean {
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  // Never trust a non-TLS origin, and require an exact hubspot.com suffix match
  // so "hubspot.com.evil.test" and "nothubspot.com" are both rejected.
  return (
    url.protocol === "https:" &&
    (url.hostname === "hubspot.com" || url.hostname.endsWith(".hubspot.com"))
  );
}

/**
 * HubSpot signals a completed booking with `meetingBookSucceeded`. The payload
 * shape has varied across embed versions, so accept the documented flag at the
 * top level or nested under `data`, and ignore everything else - the widget also
 * posts frequent resize/height chatter we must not treat as a conversion.
 */
function isBookingSuccess(payload: unknown): boolean {
  if (typeof payload !== "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;
  if (p.meetingBookSucceeded === true) return true;
  const nested = p.data;
  if (typeof nested === "object" && nested !== null) {
    return (nested as Record<string, unknown>).meetingBookSucceeded === true;
  }
  return false;
}

export function BookingConversion() {
  useEffect(() => {
    // HubSpot can emit the success message more than once (re-render, late
    // resize burst). Latch so one booking is never counted twice.
    let counted = false;

    function onMessage(event: MessageEvent) {
      // Origin check FIRST: any page could postMessage into this window, and an
      // unvalidated listener would let anyone inflate the conversion count.
      if (!isTrustedHubSpotOrigin(event.origin)) return;
      if (!isBookingSuccess(event.data)) return;
      if (counted) return;
      counted = true;

      const gtag = (
        window as unknown as { gtag?: (...args: unknown[]) => void }
      ).gtag;
      if (typeof gtag !== "function") return;

      /*
       * `generate_lead` is GA4's recommended event for this, rather than a
       * custom name: GA4 reports and Google Ads both understand it natively, so
       * it can be imported as a conversion without extra mapping.
       *
       * Fires regardless of consent state on purpose - under Consent Mode with
       * analytics_storage denied, GA4 sends a cookieless ping instead of
       * dropping the event, which is what feeds modelled conversions. Gating it
       * ourselves would throw that away.
       *
       * NOTE: still needs marking as a Key Event in GA4
       * (Admin > Events > mark `generate_lead` as key event), or it counts as a
       * plain event and never appears as a conversion.
       */
      gtag("event", "generate_lead", {
        // Free consultation, so no monetary value is claimed. Set `value` and
        // `currency` here if you later want pipeline value in GA4/Ads.
        method: "hubspot_meetings_embed",
        // Distinguishes embed bookings from any future booking surface.
        booking_surface: "contact_page",
      });
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}

/** Exported for tests: the origin of the configured booking URL. */
export const bookingOrigin = (() => {
  try {
    return new URL(siteConfig.bookingUrl).origin;
  } catch {
    return null;
  }
})();
