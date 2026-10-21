"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { products } from "@/lib/products";
import { asset } from "@/lib/mode";

export interface CartLine {
  slug: string;
  qty: number;
}

interface CartContextValue {
  items: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "isik-cart-v1";

function priceOf(slug: string) {
  return products.find((product) => product.slug === slug)?.price ?? 0;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed
              .filter(
                (line): line is CartLine =>
                  Boolean(line) &&
                  typeof line === "object" &&
                  typeof (line as CartLine).slug === "string" &&
                  typeof (line as CartLine).qty === "number" &&
                  (line as CartLine).qty > 0,
              )
              .slice(0, 50),
          );
        }
      }
    } catch {
      // Bozuk kayıt: temiz başla.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Depolama kapalı olabilir.
    }
  }, [items, ready]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const add = useCallback((slug: string, qty = 1) => {
    const product = products.find((item) => item.slug === slug);
    if (!product) return;
    setItems((current) => {
      const existing = current.find((line) => line.slug === slug);
      if (existing) {
        return current.map((line) =>
          line.slug === slug
            ? { ...line, qty: Math.min(99, line.qty + qty) }
            : line,
        );
      }
      return [...current, { slug, qty: Math.min(99, qty) }];
    });
    setToast(`${product.name} sepete eklendi`);
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((current) =>
      qty <= 0
        ? current.filter((line) => line.slug !== slug)
        : current.map((line) =>
            line.slug === slug ? { ...line, qty: Math.min(99, qty) } : line,
          ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((total, line) => total + line.qty, 0);
    const subtotal = items.reduce(
      (total, line) => total + priceOf(line.slug) * line.qty,
      0,
    );
    return { items, count, subtotal, ready, add, remove, setQty, clear };
  }, [items, ready, add, remove, setQty, clear]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[120] flex justify-center px-4 sm:justify-end sm:px-6"
        aria-live="polite"
      >
        {toast && (
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-2xl animate-rise">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand text-ink">
              <CheckCircle2 className="size-4" />
            </span>
            <span className="max-w-[260px]">{toast}</span>
            <a
              href={asset("/sepet")}
              className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-200 transition hover:bg-white/20"
            >
              <ShoppingBag className="size-3.5" />
              Sepete git
            </a>
            <button
              type="button"
              aria-label="Bildirimi kapat"
              onClick={() => setToast(null)}
              className="text-white/50 transition hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart, CartProvider içinde kullanılmalıdır.");
  }
  return context;
}
