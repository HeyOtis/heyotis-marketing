import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  async redirects() {
    return [
      // /features was rebuilt as /platform (loop-stage IA), July 2026.
      { source: "/features", destination: "/platform", permanent: true },
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
