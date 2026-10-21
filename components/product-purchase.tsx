"use client";

import { useState } from "react";
import { ArrowRight, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="flex items-center justify-between rounded-full border border-ink/12 bg-white px-1.5 py-1.5 sm:w-[122px]">
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            aria-label="Adet azalt"
            className="flex size-9 items-center justify-center rounded-full transition hover:bg-ink/5"
          >
            <Minus className="size-4" />
          </button>
          <span className="text-[13px] font-bold" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((value) => Math.min(99, value + 1))}
            aria-label="Adet artır"
            className="flex size-9 items-center justify-center rounded-full transition hover:bg-ink/5"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => add(product.slug, qty)}
          className="btn-primary flex-1 !py-3.5"
        >
          <ShoppingBag className="size-4" />
          Sepete ekle · {formatPrice(product.price * qty)}
        </button>
      </div>

      <Link
        href="/sepet"
        className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/12 bg-white px-5 py-3 text-[12px] font-bold transition hover:border-ink hover:bg-ink hover:text-white"
      >
        Hemen satın al <ArrowRight className="size-4" />
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-medium text-ink/50">
        <span className="flex items-center gap-1.5">
          <Check className="size-3.5 text-emerald-600" />
          Stoktan 24 saatte kargo
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="size-3.5 text-emerald-600" />
          14 gün koşulsuz iade
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="size-3.5 text-emerald-600" />
          Orijinal ürün & fatura
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="size-3.5 text-emerald-600" />
          Güvenli ödeme
        </span>
      </div>
    </>
  );
}
