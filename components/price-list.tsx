"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export function PriceList() {
  const { add } = useCart();

  return (
    <div className="overflow-hidden rounded-3xl border border-ink/[0.08] bg-white">
      <div className="hidden grid-cols-[2.2fr_1fr_0.9fr_0.9fr_auto] gap-4 border-b border-ink/[0.07] px-5 py-3 text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink/35 md:grid">
        <span>Ürün</span>
        <span>Kategori</span>
        <span>Fiyat</span>
        <span>Durum</span>
        <span />
      </div>
      <ul className="divide-y divide-ink/[0.06]">
        {products.map((product) => (
          <li
            key={product.id}
            className="grid gap-3 px-4 py-3.5 transition hover:bg-cream/60 md:grid-cols-[2.2fr_1fr_0.9fr_0.9fr_auto] md:items-center md:gap-4 md:px-5"
          >
            <div className="flex items-center gap-3">
              <Link
                href={`/urunler/${product.slug}`}
                className="size-12 shrink-0 overflow-hidden rounded-xl bg-sand"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt=""
                  className="size-full object-cover"
                  loading="lazy"
                />
              </Link>
              <div className="min-w-0">
                <Link
                  href={`/urunler/${product.slug}`}
                  className="block truncate text-[12.5px] font-semibold hover:text-ink/60"
                >
                  {product.name}
                </Link>
                <span className="text-[9.5px] text-ink/35 md:hidden">
                  {product.category}
                </span>
              </div>
            </div>
            <span className="hidden text-[11px] text-ink/45 md:block">
              {product.category}
            </span>
            <div>
              <span className="text-[12.5px] font-bold">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <s className="ml-1.5 text-[10px] text-ink/30">
                  {formatPrice(product.oldPrice)}
                </s>
              )}
            </div>
            <span className="hidden items-center gap-1.5 text-[10px] font-semibold text-emerald-700 md:flex">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Stokta
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => add(product.slug)}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[10.5px] font-bold text-white transition hover:bg-ink-soft md:flex-none"
              >
                <Plus className="size-3.5 text-brand" />
                Ekle
              </button>
              <Link
                href={`/urunler/${product.slug}`}
                className="rounded-full border border-ink/12 px-3.5 py-2 text-[10.5px] font-bold transition hover:border-ink/30"
              >
                Detay
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
