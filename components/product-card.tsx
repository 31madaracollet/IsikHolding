"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/types";
import { cn, discountPercent, formatPrice } from "@/lib/utils";

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { add } = useCart();
  const [liked, setLiked] = useState(false);
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[26px] border border-ink/[0.07] bg-white transition duration-500 hover:-translate-y-1 hover:border-ink/10 hover:shadow-card",
      )}
    >
      <div className="relative">
        <Link
          href={`/urunler/${product.slug}`}
          className="relative block aspect-[4/5] overflow-hidden bg-sand"
          aria-label={product.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/12 to-transparent opacity-0 transition group-hover:opacity-100" />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-white">
              Yeni
            </span>
          )}
          {product.isBestseller && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-ink">
              Çok satan
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-red-600 shadow-sm backdrop-blur">
              %{discount} indirim
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setLiked((value) => !value)}
          aria-label={liked ? "Favorilerden çıkar" : "Favorilere ekle"}
          aria-pressed={liked}
          className={cn(
            "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-ink/[0.06] bg-white/90 backdrop-blur transition",
            liked ? "text-red-500" : "text-ink/45 hover:text-ink",
          )}
        >
          <Heart className={cn("size-4", liked && "fill-current")} />
        </button>

        {!compact && (
          <button
            type="button"
            onClick={() => add(product.slug)}
            className="absolute bottom-3 right-3 flex size-11 translate-y-2 items-center justify-center rounded-full bg-ink text-brand opacity-0 shadow-xl transition duration-300 hover:bg-brand hover:text-ink group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
            aria-label={`${product.name} sepete ekle`}
          >
            <Plus className="size-5" />
          </button>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "p-4" : "p-4 pt-3.5")}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/40">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-[10.5px] font-semibold text-ink/55">
            <Star className="size-3 fill-brand-500 text-brand-500" />
            {product.rating.toFixed(1)}
            <span className="font-normal text-ink/35">({product.reviews})</span>
          </span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 font-display text-[14.5px] font-semibold leading-snug sm:text-[15.5px]">
          <Link href={`/urunler/${product.slug}`} className="transition hover:text-ink/70">
            {product.name}
          </Link>
        </h3>

        {!compact && (
          <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-ink/45">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[15.5px] font-bold sm:text-[17px]">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <s className="text-[11px] text-ink/35">
                  {formatPrice(product.oldPrice)}
                </s>
              )}
            </div>
            <span className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Stokta · 24 saatte kargoda
            </span>
          </div>
          <button
            type="button"
            onClick={() => add(product.slug)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/12 bg-white px-2.5 py-2 text-[10.5px] font-bold transition hover:border-ink hover:bg-ink hover:text-brand sm:px-3 sm:text-[11px]"
          >
            <Plus className="size-3.5" />
            Ekle
          </button>
        </div>
      </div>
    </article>
  );
}
