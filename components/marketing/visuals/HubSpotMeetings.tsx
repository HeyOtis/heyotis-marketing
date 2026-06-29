"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

const EMBED_SCRIPT =
  "https://static.hsappstatic.net/MeetingsEmbedCode/static-1.5/MeetingsEmbedCode.js";

/**
 * HubSpot Meetings inline embed. Renders the native booking widget in-page (so
 * visitors never leave the site); HubSpot's loader script scans for the
 * `.meetings-iframe-container` and injects the scheduling iframe. Bookings flow
 * into HubSpot CRM and the rep's connected Google Calendar.
 *
 * `data-lenis-prevent` keeps smooth-scroll from hijacking wheel events over the
 * widget. The script is appended on mount and removed on unmount so client-side
 * navigation back to this page re-initialises the embed.
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
      data-lenis-prevent=""
    />
  );
}
