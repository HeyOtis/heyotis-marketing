"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const EMBED_SCRIPT =
  "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

/**
 * HubSpot Meetings inline embed. Renders the native booking widget in-page (so
 * visitors never leave the site); HubSpot's loader script scans for the
 * `.meetings-iframe-container` and injects the scheduling iframe. Bookings flow
 * into HubSpot CRM and the rep's connected Google Calendar.
 *
 * The loader script is appended on mount and removed on unmount so client-side
 * navigation back to this page re-scans the fresh container and re-renders the
 * widget. Note: re-running the loader is deliberate - it's what guarantees the
 * embed renders on repeat visits. The trade-off is that HubSpot's loader
 * attaches anonymous `message` listeners to `window` (resize + privacy consent)
 * that we cannot detach (removing the <script> tag does not remove them), so a
 * couple of dead listeners accumulate per repeat visit to /contact. This is a
 * known third-party limitation; render reliability on this conversion path is
 * prioritised over shedding those listeners. Don't "optimise" by loading the
 * script once without a verified re-scan API - that blanks the widget on
 * back-navigation.
 */
/** Accessible name for the injected scheduling frame. */
const FRAME_TITLE = "Booking calendar - choose a time for your HeyOtis walkthrough";

export function HubSpotMeetings({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = EMBED_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  /*
   * HubSpot injects the <iframe> with no `title`, which is a WCAG 2.1 failure
   * (axe: frame-title) - screen reader users hear only "iframe" on the page
   * whose entire purpose is booking a call. We can't set the attribute at render
   * time because the element doesn't exist until HubSpot's loader creates it, so
   * watch the container and title it on arrival. Also handles re-injection: the
   * loader can replace the frame, and the observer stays subscribed.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function titleFrame() {
      const frame = container?.querySelector("iframe");
      if (frame && frame.getAttribute("title") !== FRAME_TITLE) {
        frame.setAttribute("title", FRAME_TITLE);
      }
    }

    titleFrame(); // in case the frame is already present
    const observer = new MutationObserver(titleFrame);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("meetings-iframe-container min-h-[640px]", className)}
      data-src={src}
    />
  );
}
