"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Factory,
  Menu,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import {
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/brand-icons";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/admin/logout-button";
import { useCart } from "@/components/cart-provider";
import { categories, products } from "@/lib/products";
import { site } from "@/lib/site";
import { cn, formatPrice } from "@/lib/utils";

const categoryIcons = {
  zap: Zap,
  cpu: Cpu,
  sparkles: Sparkles,
  sun: Sun,
  factory: Factory,
} as const;

const megaProduct = products.find((product) => product.slug === "isik-smart-rgbw")!;

function LayoutDashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
      aria-hidden="true"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

export function SiteHeader({
  admin,
}: {
  admin?: { name: string; email: string } | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="hidden bg-ink text-white/80 md:block">
        <div className="container-x flex h-9 items-center justify-between text-[11px] font-medium">
          <div className="flex items-center gap-2.5">
            <span className="flex size-1.5 rounded-full bg-brand" />
            <span>
              Işık Kulübü&apos;ne katılın, ilk siparişinizde{" "}
              <strong className="font-semibold text-brand-300">%15 indirim</strong>{" "}
              kazanın.
            </span>
            <Link
              href="/fiyatlandirma"
              className="inline-flex items-center gap-1 text-brand-300 transition hover:text-brand-200"
            >
              Kulübü keşfet <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`tel:${site.phoneHref}`}
              className="inline-flex items-center gap-1.5 transition hover:text-white"
            >
              <Phone className="size-3" />
              {site.phone}
            </a>
            <span className="h-3 w-px bg-white/15" />
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-1.5 transition hover:text-white"
            >
              7/24 destek
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-ink/[0.07] glass">
        <div className="container-x flex h-[74px] items-center justify-between gap-4">
          <Link href="/" aria-label="Işık Holding anasayfa" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
            {[
              { label: "Anasayfa", href: "/" },
              { label: "Haberler", href: "/haberler" },
              { label: "Fiyatlandırma", href: "/fiyatlandirma" },
              { label: "Hakkımızda", href: "/hakkimizda" },
              { label: "İletişim", href: "/iletisim" },
            ].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition",
                  index === 0 ? "order-1" : "order-3",
                  isActive(item.href)
                    ? "bg-ink text-white"
                    : "text-ink/65 hover:bg-ink/5 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}

            {admin && (
              <Link
                href="/admin"
                className="order-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 text-[13px] font-bold text-ink transition hover:bg-brand-300"
              >
                <ShieldCheck className="size-3.5" />
                Yönetim
              </Link>
            )}

            <div className="group relative order-2">
              <Link
                href="/urunler"
                className={cn(
                  "flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition",
                  isActive("/urunler")
                    ? "bg-ink text-white"
                    : "text-ink/65 hover:bg-ink/5 hover:text-ink",
                )}
              >
                Ürünler
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <div className="invisible absolute left-1/2 top-full z-50 w-[min(940px,calc(100vw-2rem))] -translate-x-1/2 pt-4 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-3xl border border-ink/[0.08] bg-white p-3 shadow-[0_40px_90px_-30px_rgba(18,18,18,0.35)]">
                  <div className="grid gap-2 md:grid-cols-[1.4fr_1fr]">
                    <div className="grid gap-1 sm:grid-cols-2">
                      {categories.map((category) => {
                        const Icon =
                          categoryIcons[
                            category.icon as keyof typeof categoryIcons
                          ] ?? Zap;
                        return (
                          <Link
                            key={category.slug}
                            href={`/urunler?kategori=${category.slug}`}
                            className="group/item flex items-start gap-3 rounded-2xl p-3 transition hover:bg-brand-50"
                          >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-ink transition group-hover/item:bg-brand">
                              <Icon className="size-[18px]" strokeWidth={1.8} />
                            </span>
                            <span>
                              <span className="flex items-center gap-1 text-[13px] font-bold">
                                {category.name}
                                <ArrowUpRight className="size-3 text-ink/25 transition group-hover/item:text-ink" />
                              </span>
                              <span className="mt-0.5 line-clamp-1 block text-[11.5px] text-ink/50">
                                {category.description}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                      <Link
                        href="/urunler"
                        className="flex items-center justify-between rounded-2xl bg-ink px-4 py-3 text-[12.5px] font-semibold text-white transition hover:bg-ink-soft sm:col-span-2"
                      >
                        Tüm ürün kataloğunu görüntüle
                        <ArrowRight className="size-4 text-brand" />
                      </Link>
                    </div>

                    <Link
                      href={`/urunler/${megaProduct.slug}`}
                      className="group/card relative overflow-hidden rounded-2xl bg-brand-100 p-4"
                    >
                      <span className="chip bg-white/80 text-[10px]">Öne çıkan</span>
                      <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={megaProduct.image}
                          alt={megaProduct.name}
                          className="size-full object-cover transition duration-700 group-hover/card:scale-105"
                        />
                      </div>
                      <strong className="mt-3 block font-display text-[15px] leading-tight">
                        {megaProduct.name}
                      </strong>
                      <span className="mt-1.5 flex items-center gap-2 text-[12px]">
                        <span className="font-bold text-ink">
                          {formatPrice(megaProduct.price)}
                        </span>
                        <s className="text-ink/40">
                          {formatPrice(megaProduct.oldPrice ?? 0)}
                        </s>
                        <span className="rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-bold text-brand">
                          %22
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${site.phoneHref}`}
              className="hidden items-center gap-2 rounded-full border border-ink/10 px-3.5 py-2.5 text-[12px] font-semibold transition hover:border-ink/25 xl:inline-flex"
            >
              <Phone className="size-3.5 text-brand-600" />
              {site.phone}
            </a>
            <Link
              href="/sepet"
              className="relative inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-[12.5px] font-bold text-ink transition hover:bg-brand-300"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">Sepet</span>
              <span className="flex min-w-5 items-center justify-center rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-bold text-brand">
                {count}
              </span>
            </Link>
            {admin ? (
              <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white py-1 pl-1 pr-1.5">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1.5 text-[10.5px] font-bold text-white transition hover:bg-ink-soft"
                  title={`${admin.name} · yönetim paneli`}
                >
                  <ShieldCheck className="size-3 text-brand" />
                  <span className="hidden sm:inline">
                    {admin.name.split(" ")[0]}
                  </span>
                  <span className="sm:hidden">Yönetim</span>
                </Link>
                <LogoutButton compact className="!size-7 !border-0" />
              </div>
            ) : (
              <Link
                href="/iletisim"
                className="hidden rounded-full border border-ink/15 px-4 py-2.5 text-[12.5px] font-bold transition hover:border-ink/40 xl:inline-flex"
              >
                Bayi ol
              </Link>
            )}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Menüyü aç"
              className="inline-flex size-10 items-center justify-center rounded-full border border-ink/10 transition hover:bg-ink/5 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobil menü */}
      <div
        className={cn(
          "fixed inset-0 z-[80] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/45 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[88%] max-w-[400px] flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Mobil menü"
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Menüyü kapat"
              className="inline-flex size-9 items-center justify-center rounded-full bg-ink text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <nav className="flex flex-col" aria-label="Mobil ana menü">
              {[
                { label: "Anasayfa", href: "/" },
                { label: "Ürünler", href: "/urunler" },
                { label: "Haberler", href: "/haberler" },
                { label: "Fiyatlandırma", href: "/fiyatlandirma" },
                { label: "Hakkımızda", href: "/hakkimizda" },
                { label: "İletişim", href: "/iletisim" },
                { label: "Sepetim", href: "/sepet" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between border-b border-ink/[0.06] py-3.5 font-display text-[17px] font-medium"
                >
                  {item.label}
                  <ArrowUpRight className="size-4 text-ink/30" />
                </Link>
              ))}
            </nav>

            {admin && (
              <div className="mt-4 rounded-2xl bg-ink p-4 text-white">
                <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-300">
                  <ShieldCheck className="size-3" /> Yönetici oturumu
                </p>
                <p className="mt-1.5 font-display text-[16px] font-semibold">
                  {admin.name}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-3 py-2.5 text-[10.5px] font-bold text-ink"
                  >
                    <LayoutDashboardIcon /> Yönetim paneli
                  </Link>
                  <LogoutButton
                    tone="dark"
                    label="Çıkış"
                    className="!border-white/20 !bg-white/5 !px-3 !py-2.5 !text-[10.5px] !text-white/70"
                  />
                </div>
              </div>
            )}

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
              Kategoriler
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/urunler?kategori=${category.slug}`}
                  className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink/70"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-brand p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60">
                Işık Kulübü
              </p>
              <p className="mt-1.5 font-display text-[17px] font-semibold leading-snug">
                İlk siparişinde %15 indirim, üyelere özel fiyatlar.
              </p>
              <Link
                href="/fiyatlandirma"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold underline decoration-ink/30 underline-offset-4"
              >
                Planları gör <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4 text-ink/50">
              <a href="https://instagram.com" aria-label="Instagram" className="hover:text-ink">
                <InstagramIcon className="size-4" />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-ink">
                <LinkedinIcon className="size-4" />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className="hover:text-ink">
                <YoutubeIcon className="size-4" />
              </a>
            </div>
          </div>

          <div className="border-t border-ink/10 p-5">
            <a
              href={`tel:${site.phoneHref}`}
              className="flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-white"
            >
              <Phone className="size-4 text-brand" />
              {site.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
