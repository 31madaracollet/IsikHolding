import { products, categories } from "@/lib/products";

export const dynamic = "force-static";

/**
 * Işık AI'nın okuduğu makine okunur katalog.
 *
 * Statik derlemede `/catalog.json` olarak yayınlanır; Edge Function bu dosyayı
 * çekip sistem prompt'una ekler. Böylece ürün eklendiğinde yalnızca site
 * yeniden derlenir, yapay zekâ tarafında deploy gerekmez.
 */
export function GET() {
  return Response.json(
    {
      updatedAt: new Date().toISOString().slice(0, 10),
      currency: "TRY",
      categories: categories.map((category) => ({
        name: category.name,
        slug: category.slug,
        count: products.filter((product) => product.category === category.name).length,
      })),
      products: products.map((product) => ({
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice ?? null,
        stock: product.stock,
        specs: product.specs.slice(0, 3).map((spec) => `${spec.label}: ${spec.value}`),
        features: product.features.slice(0, 2),
        url: `/urunler/${product.slug}`,
      })),
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=600",
      },
    },
  );
}
