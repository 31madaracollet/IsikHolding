import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/urunler", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/haberler", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/fiyatlandirma", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/hakkimizda", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/iletisim", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/politikalar", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: `${site.url}/urunler/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
