"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, categoryToSlug, products } from "@/lib/products";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const sortLabels: Record<SortKey, string> = {
  featured: "Öne çıkanlar",
  "price-asc": "Fiyat: artan",
  "price-desc": "Fiyat: azalan",
  rating: "En yüksek puan",
  newest: "Yeniler önce",
};

export function ProductBrowser({
  initialCategory = "all",
}: {
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    const list = products.filter((product) => {
      const matchesCategory =
        category === "all" || categoryToSlug[product.category] === category;
      const normalized = query.toLocaleLowerCase("tr-TR").trim();
      const matchesQuery =
        !normalized ||
        `${product.name} ${product.category} ${product.shortDescription}`
          .toLocaleLowerCase("tr-TR")
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
        default:
          return (
            Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) ||
            b.rating - a.rating
          );
      }
    });
  }, [category, query, sort]);

  return (
    <div>
      <div className="sticky top-[74px] z-30 -mx-5 border-y border-ink/[0.07] glass px-5 py-3 sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-1 flex items-center gap-1.5 overflow-x-auto px-1">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-[11.5px] font-bold transition",
                category === "all"
                  ? "bg-ink text-white"
                  : "bg-white text-ink/60 hover:text-ink",
              )}
            >
              Tümü
              <span className="ml-1.5 text-[10px] opacity-50">{products.length}</span>
            </button>
            {categories.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setCategory(item.slug)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-2 text-[11.5px] font-bold transition",
                  category === item.slug
                    ? "bg-ink text-white"
                    : "bg-white text-ink/60 hover:text-ink",
                )}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ürün ara…"
                aria-label="Ürün ara"
                className="w-full rounded-full border border-ink/10 bg-white py-2.5 pl-9 pr-9 text-[12px] outline-none transition placeholder:text-ink/35 focus:border-brand-500 focus:ring-4 focus:ring-brand/20"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Aramayı temizle"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="relative flex shrink-0 items-center">
              <SlidersHorizontal className="pointer-events-none absolute left-3 size-3.5 text-ink/40" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                aria-label="Sıralama"
                className="appearance-none rounded-full border border-ink/10 bg-white py-2.5 pl-8 pr-8 text-[12px] font-semibold outline-none transition focus:border-brand-500"
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 size-3 text-ink/40"
                viewBox="0 0 12 8"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 1.5 6 6.5l5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-[11.5px] text-ink/45">
        <p>
          <strong className="font-bold text-ink">{filtered.length}</strong> ürün
          listeleniyor
        </p>
        <p className="hidden items-center gap-1.5 sm:flex">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Tüm ürünlerde ücretsiz kargo eşiği 500 ₺
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ink/15 bg-white p-12 text-center">
          <p className="font-display text-xl font-semibold">Sonuç bulunamadı</p>
          <p className="mt-2 text-sm text-ink/50">
            Farklı bir anahtar kelime deneyin veya filtreleri temizleyin.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-4 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-white"
          >
            Filtreleri temizle
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
