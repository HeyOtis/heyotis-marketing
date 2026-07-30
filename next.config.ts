import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  // Pin the workspace root. Without this, Next walks up and finds a stray
  // package-lock.json in the home directory, warns, and picks the wrong root -
  // which changes module resolution and would bite in CI.
  turbopack: { root: __dirname },
  // Don't advertise the framework/version to scanners.
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Every route, including static assets and generated SEO files.
        source: "/:path*",
        headers: [
          // Force HTTPS for two years, including subdomains. `preload` is
          // deliberately omitted - submitting to the HSTS preload list is
          // effectively irreversible and would cover every *.heyotis.ai
          // subdomain, including the platform app. Add it only once every
          // subdomain is known-good on HTTPS.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          // Stop browsers MIME-sniffing a response into something executable.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the full URL same-origin, origin-only cross-origin. Matches
          // the `referrer` value set in app/layout.tsx metadata.
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Clickjacking protection. frame-ancestors is the modern form and
          // supersedes X-Frame-Options; 'self' lets us keep the option of
          // framing our own pages. Note this restricts who may frame US - it
          // does not affect the HubSpot iframe we embed on /contact.
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
          // Drop access to hardware/APIs the marketing site never uses.
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // /features was rebuilt as /platform (loop-stage IA), July 2026.
      { source: "/features", destination: "/platform", permanent: true },
      // The Strategy Engine page moved to the shorter /strategy, July 2026.
      {
        source: "/strategy-engine",
        destination: "/strategy",
        permanent: true,
      },
      // Daylyte moved from the blog to Case Studies (it's a customer results
      // story, not editorial), July 2026.
      {
        source: "/blog/daylyte",
        destination: "/case-studies/daylyte",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // lobehub icons are compound (Mono/Text/Combine/Avatar); let Next strip the
    // unused variants from the client bundle and speed up dev compiles.
    optimizePackageImports: ["@lobehub/icons"],
  },
};

export default nextConfig;
