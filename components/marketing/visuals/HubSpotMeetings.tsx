"use client";

import { useEffect } from "react";
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
export function HubSpotMeetings({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = EMBED_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      className={cn("meetings-iframe-container min-h-[640px]", className)}
      data-src={src}
    />
  );
}
