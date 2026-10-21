import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Arena canlı önizlemesi ve benzeri proxy alan adlarından gelen
  // geliştirme isteklerine izin ver.
  allowedDevOrigins: ["*.e2b.app", "*.arena.ai", "localhost"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
};

export default nextConfig;
