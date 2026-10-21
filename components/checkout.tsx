"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { products } from "@/lib/products";
import {
  calculateTotals,
  COUPONS,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/checkout";
import { cn, formatPrice } from "@/lib/utils";
import { submitOrderViaBrowser } from "@/lib/supabase/fallback";

export function Checkout() {
  const { items, subtotal, setQty, remove, clear, ready } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    orderNumber: string;
    total: number;
    persistence: string;
  } | null>(null);

  const lines = useMemo(
    () =>
      items
        .map((line) => {
          const product = products.find((item) => item.slug === line.slug);
          return product ? { ...line, product } : null;
        })
        .filter((line): line is NonNullable<typeof line> => line !== null),
    [items],
  );

  const totals = useMemo(
    () => calculateTotals(subtotal, coupon),
    [subtotal, coupon],
  );

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setCoupon(code);
      setCouponError("");
    } else {
      setCoupon(null);
      setCouponError("Kupon kodu geçerli değil. ISIK15 kodunu deneyin.");
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      customer: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        city: String(formData.get("city") ?? ""),
        district: String(formData.get("district") ?? ""),
        address: String(formData.get("address") ?? ""),
        note: String(formData.get("note") ?? ""),
      },
      items: lines.map((line) => ({ slug: line.slug, qty: line.qty })),
      coupon,
      consent: formData.get("consent") === "on",
    };
    setState("loading");
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data?.fallback) {
          // Sunucu Supabase'e ulaşamıyor: tarayıcı köprüsüyle yaz (RLS insert).
          const bridged = await submitOrderViaBrowser({
            customer: payload.customer,
            items: payload.items,
            coupon,
          });
          if (bridged) {
            setSuccess({
              orderNumber: bridged.orderNumber,
              total: bridged.total,
              persistence: "browser",
            });
            clear();
            return;
          }
        }
        throw new Error(
          typeof data.error === "string" ? data.error : "Sipariş oluşturulamadı.",
        );
      }
      setSuccess({
        orderNumber: data.orderNumber,
        total: data.total,
        persistence: data.persistence ?? "demo",
      });
      clear();
    } catch (submitError) {
      setState("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Bir şeyler ters gitti, tekrar deneyin.",
      );
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-[32px] border border-ink/[0.08] bg-white p-8 text-center sm:p-12">
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full halo blur-xl"
            aria-hidden="true"
          />
          <span className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-brand shadow-glow">
            <CheckCircle2 className="size-10" />
          </span>
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            <Check className="size-3" /> Sipariş talebi alındı
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Teşekkürler, ışığınız yolda!
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-ink/55">
            <strong className="font-semibold text-ink">{success.orderNumber}</strong>{" "}
            numaralı sipariş talebiniz oluşturuldu. Ödeme bağlantısı ve kargo
            bilgileri e-posta adresinize gönderilecek.
          </p>

          <div className="mx-auto mt-6 grid max-w-sm gap-2 rounded-2xl bg-cream p-4 text-left text-[12px]">
            <div className="flex justify-between">
              <span className="text-ink/50">Sipariş numarası</span>
              <span className="font-bold">{success.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/50">Toplam tutar</span>
              <span className="font-bold">{formatPrice(success.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/50">Tahmini teslimat</span>
              <span className="font-bold">1–3 iş günü</span>
            </div>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[12px] font-bold text-white"
            >
              Alışverişe devam et <ArrowRight className="size-4 text-brand" />
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-5 py-3 text-[12px] font-bold"
            >
              Sipariş hakkında yaz
            </Link>
          </div>

          <p className="mt-6 text-[10.5px] text-ink/35">
            {success.persistence === "supabase"
              ? "Sipariş talebiniz güvenli Supabase veritabanına kaydedildi."
              : success.persistence === "browser"
                ? "Sipariş talebiniz Supabase'e (RLS korumalı tarayıcı bağlantısıyla) kaydedildi."
                : "Demo modu: sipariş talebi simüle edildi. Supabase anahtarları eklendiğinde kalıcı kayıt yapılır."}
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-ink/30" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-[32px] border border-dashed border-ink/15 bg-white p-10 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-100">
          <ShoppingBag className="size-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold">Sepetiniz henüz boş</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/50">
          Işık seçmek için doğru yerdesiniz. Kataloğa göz atın ya da 3 soruluk
          asistanımızla size uygun ampulü bulun.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href="/urunler"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-[12px] font-bold text-ink"
          >
            Ürünleri keşfet <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/#asistan"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/12 px-5 py-3 text-[12px] font-bold"
          >
            Işık asistanını dene
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      <div className="space-y-5">
        <div className="hidden items-center gap-2 text-[11px] font-semibold text-ink/40 sm:flex">
          <span className="flex items-center gap-1.5 text-ink">
            <span className="flex size-5 items-center justify-center rounded-full bg-ink text-[9px] text-brand">
              1
            </span>
            Sepet
          </span>
          <span className="h-px w-6 bg-ink/15" />
          <span className="flex items-center gap-1.5">
            <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[9px] text-ink">
              2
            </span>
            Teslimat
          </span>
          <span className="h-px w-6 bg-ink/15" />
          <span className="flex items-center gap-1.5">
            <span className="flex size-5 items-center justify-center rounded-full bg-ink/10 text-[9px]">
              3
            </span>
            Onay
          </span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-ink/[0.08] bg-white">
          <div className="flex items-center justify-between border-b border-ink/[0.06] px-5 py-4">
            <h2 className="text-[13px] font-bold">
              Sepetiniz <span className="text-ink/35">({lines.length} ürün)</span>
            </h2>
            <button
              type="button"
              onClick={clear}
              className="text-[10.5px] font-semibold text-ink/40 transition hover:text-red-600"
            >
              Sepeti boşalt
            </button>
          </div>

          <ul className="divide-y divide-ink/[0.06]">
            {lines.map((line) => (
              <li key={line.slug} className="flex gap-3.5 p-4 sm:p-5">
                <Link
                  href={`/urunler/${line.slug}`}
                  className="size-20 shrink-0 overflow-hidden rounded-2xl bg-sand sm:size-24"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={line.product.image}
                    alt={line.product.name}
                    className="size-full object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-ink/35">
                        {line.product.category}
                      </p>
                      <Link
                        href={`/urunler/${line.slug}`}
                        className="mt-0.5 block truncate font-display text-[14px] font-semibold hover:text-ink/70"
                      >
                        {line.product.name}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.slug)}
                      aria-label={`${line.product.name} ürününü kaldır`}
                      className="text-ink/30 transition hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-full border border-ink/12">
                      <button
                        type="button"
                        onClick={() => setQty(line.slug, line.qty - 1)}
                        aria-label="Adet azalt"
                        className="flex size-7 items-center justify-center rounded-full transition hover:bg-ink/5"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-[11px] font-bold">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.slug, line.qty + 1)}
                        aria-label="Adet artır"
                        className="flex size-7 items-center justify-center rounded-full transition hover:bg-ink/5"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-[14px] font-bold">
                        {formatPrice(line.product.price * line.qty)}
                      </p>
                      {line.qty > 1 && (
                        <p className="text-[9.5px] text-ink/35">
                          {formatPrice(line.product.price)} / adet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 bg-cream px-5 py-3 text-[10.5px] text-ink/45">
            <Truck className="size-3.5 text-ink/50" />
            {totals.freeShippingRemaining > 0 ? (
              <span>
                Ücretsiz kargoya{" "}
                <strong className="font-bold text-ink">
                  {formatPrice(totals.freeShippingRemaining)}
                </strong>{" "}
                kaldı.
              </span>
            ) : (
              <span className="font-semibold text-emerald-700">
                Tebrikler, kargonuz ücretsiz.
              </span>
            )}
          </div>
        </div>

        <form
          id="checkout-form"
          onSubmit={onSubmit}
          className="rounded-3xl border border-ink/[0.08] bg-white p-5 sm:p-6"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-brand text-[10px] font-bold">
              2
            </span>
            <h2 className="font-display text-[18px] font-semibold">Teslimat bilgileri</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="order-name">
                Ad soyad *
              </label>
              <input
                id="order-name"
                name="name"
                required
                autoComplete="name"
                className="input"
                placeholder="Adınız Soyadınız"
              />
            </div>
            <div>
              <label className="label" htmlFor="order-email">
                E-posta *
              </label>
              <input
                id="order-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input"
                placeholder="ornek@eposta.com"
              />
            </div>
            <div>
              <label className="label" htmlFor="order-phone">
                Telefon *
              </label>
              <input
                id="order-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                className="input"
                placeholder="05xx xxx xx xx"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="order-city">
                  İl *
                </label>
                <input
                  id="order-city"
                  name="city"
                  required
                  autoComplete="address-level1"
                  className="input"
                  placeholder="İstanbul"
                />
              </div>
              <div>
                <label className="label" htmlFor="order-district">
                  İlçe *
                </label>
                <input
                  id="order-district"
                  name="district"
                  required
                  autoComplete="address-level2"
                  className="input"
                  placeholder="Sarıyer"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="order-address">
                Açık adres *
              </label>
              <textarea
                id="order-address"
                name="address"
                required
                rows={3}
                autoComplete="street-address"
                className="input resize-none"
                placeholder="Mahalle, sokak, no, daire…"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="order-note">
                Sipariş notu
              </label>
              <input
                id="order-note"
                name="note"
                className="input"
                placeholder="Kapıda arayın, hediye paketi vb."
              />
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-cream p-3.5 text-[10.5px] leading-relaxed text-ink/50">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <span>
              Bu adımda ödeme alınmaz. Sipariş talebiniz onaylandıktan sonra
              güvenli ödeme bağlantısı e-posta ile iletilir. Kart bilgileriniz
              sitemizde saklanmaz.
            </span>
          </div>

          <label className="mt-4 flex items-start gap-2.5 text-[10.5px] leading-relaxed text-ink/50">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-0.5 size-4 rounded border-ink/20 accent-[#121212]"
            />
            <span>
              <a href="/politikalar#mesafeli" className="underline underline-offset-2 hover:text-ink">
                Mesafeli satış sözleşmesini
              </a>{" "}
              ve{" "}
              <a href="/politikalar#kvkk" className="underline underline-offset-2 hover:text-ink">
                KVKK aydınlatma metnini
              </a>{" "}
              okudum, onaylıyorum.
            </span>
          </label>

          {state === "error" && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[11.5px] font-medium text-red-700">
              {error}
            </p>
          )}
        </form>
      </div>

      <aside className="lg:sticky lg:top-[94px]">
        <div className="rounded-3xl border border-ink/[0.08] bg-white p-5 sm:p-6">
          <h2 className="font-display text-[18px] font-semibold">Sipariş özeti</h2>

          <div className="mt-4 space-y-2 text-[12px]">
            <div className="flex justify-between">
              <span className="text-ink/50">Ara toplam</span>
              <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>
                  İndirim{" "}
                  <span className="rounded bg-emerald-50 px-1 py-0.5 text-[9px] font-bold">
                    {totals.coupon}
                  </span>
                </span>
                <span className="font-semibold">−{formatPrice(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink/50">Kargo</span>
              <span className="font-semibold">
                {totals.shipping === 0 ? "Ücretsiz" : formatPrice(totals.shipping)}
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-dashed border-ink/12 pt-4">
            <div className="flex items-end justify-between">
              <span className="text-[12px] font-semibold">Toplam</span>
              <span className="font-display text-[26px] font-bold leading-none">
                {formatPrice(totals.total)}
              </span>
            </div>
            <p className="mt-1 text-right text-[9.5px] text-ink/35">
              KDV dahil · {FREE_SHIPPING_THRESHOLD} ₺ üzeri ücretsiz kargo
            </p>
          </div>

          <div className="mt-5">
            {coupon ? (
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-3 py-2.5 text-[11px] font-semibold text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <Tag className="size-3.5" />
                  {coupon} uygulandı
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCoupon(null);
                    setCouponInput("");
                  }}
                  className="text-[10px] underline underline-offset-2"
                >
                  Kaldır
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(event) => {
                    setCouponInput(event.target.value);
                    setCouponError("");
                  }}
                  placeholder="Kupon kodu"
                  aria-label="Kupon kodu"
                  className="input !py-2.5 text-[11px] uppercase"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="shrink-0 rounded-2xl border border-ink/12 px-4 text-[11px] font-bold transition hover:bg-ink hover:text-white"
                >
                  Uygula
                </button>
              </div>
            )}
            {couponError && (
              <p className="mt-2 text-[10px] font-medium text-red-600">{couponError}</p>
            )}
            {!coupon && (
              <p className="mt-2 text-[9.5px] text-ink/35">
                İpucu: <strong className="text-ink/60">ISIK15</strong> koduyla %15
                indirim.
              </p>
            )}
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={state === "loading"}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-[12.5px] font-bold text-ink transition hover:bg-brand-300 disabled:opacity-60"
          >
            {state === "loading" ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Sipariş oluşturuluyor…
              </>
            ) : (
              <>
                Siparişi tamamla <ArrowRight className="size-4" />
              </>
            )}
          </button>

          <ul className="mt-4 space-y-1.5 text-[10px] text-ink/40">
            <li className="flex items-center gap-1.5">
              <Check className="size-3 text-emerald-600" /> 14 gün içinde koşulsuz iade
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="size-3 text-emerald-600" /> Orijinal ürün ve fatura garantisi
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="size-3 text-emerald-600" /> 7/24 sipariş takibi
            </li>
          </ul>
        </div>

        <div
          className={cn(
            "mt-3 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/12 p-3 text-[10px] font-medium text-ink/45",
          )}
        >
          <ShieldCheck className="size-3.5" />
          Güvenli altyapı · Supabase + Next.js
        </div>
      </aside>
    </div>
  );
}
