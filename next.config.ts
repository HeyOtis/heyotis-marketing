import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
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
