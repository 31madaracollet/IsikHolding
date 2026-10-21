import type { NextConfig } from "next";

/**
 * İki dağıtım modu:
 *  - varsayılan: Next.js sunucusu (Vercel / Node) — route handler'lar, middleware.
 *  - STATIC_EXPORT=1: `next build` ile statik dışa aktarım (GitHub Pages).
 */
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = isStatic ? "/IsikHolding" : "";

const nextConfig: NextConfig = {
  // Arena canlı önizlemesi ve benzeri proxy alan adlarından gelen
  // geliştirme isteklerine izin ver.
  allowedDevOrigins: ["*.e2b.app", "*.arena.ai", "localhost"],
  poweredByHeader: false,
  // Statik derleme geçici bir klasörde çalıştığı için izleme kökünü sabitle.
  outputFileTracingRoot: process.cwd(),
  ...(isStatic
    ? {
        output: "export" as const,
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
        env: {
          NEXT_PUBLIC_STATIC_EXPORT: "1",
          NEXT_PUBLIC_BASE_PATH: basePath,
        },
      }
    : {
        images: {
          formats: ["image/avif", "image/webp"],
        },
      }),
};

export default nextConfig;
