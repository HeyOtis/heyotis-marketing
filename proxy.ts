import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, createNonce, CSP_HEADER } from "@/lib/csp";

/*
 * Per-request CSP nonce, following the Next.js CSP guide. Next reads the nonce
 * back out of the CSP *request* header while rendering and stamps it on its own
 * scripts; app/layout.tsx reads `x-nonce` for our next/script tags. Reading it
 * there is what makes every page dynamically rendered - see lib/csp.ts for why
 * that trade is unavoidable without 'unsafe-inline'.
 *
 * Optional: set CSP_REPORT_URI in Vercel (e.g. a Sentry project's security
 * endpoint) to collect violation reports. Unset, browsers only log them to the
 * console.
 */
export function proxy(request: NextRequest) {
  const nonce = createNonce();
  const reportUri = process.env.CSP_REPORT_URI || undefined;
  const csp = buildCsp(nonce, {
    isDev: process.env.NODE_ENV === "development",
    reportUri,
  });

  const requestHeaders = new Headers(request.headers);
  // Drop any client-supplied values so only our nonce reaches the renderer.
  requestHeaders.delete("content-security-policy");
  requestHeaders.delete("content-security-policy-report-only");
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(CSP_HEADER, csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(CSP_HEADER, csp);
  if (reportUri) {
    response.headers.set("Reporting-Endpoints", `csp="${reportUri}"`);
  }
  return response;
}

export const config = {
  matcher: [
    {
      // Documents only: skip API routes (the OG image), static chunks, the
      // image optimizer, Vercel's own analytics paths and static files
      // (icons, images, robots.txt, sitemap.xml, llms.txt, the manifest).
      source:
        "/((?!api|_next/static|_next/image|_vercel|[^?]*\\.(?:ico|png|jpe?g|webp|avif|gif|svg|txt|xml|webmanifest|woff2?|ttf)).*)",
      // Router prefetches fetch RSC payloads, not documents.
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
