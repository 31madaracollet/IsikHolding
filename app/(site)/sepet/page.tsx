import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = {
  title: "Sepet & Sipariş",
  description:
    "Sepetinizi gözden geçirin, kupon kodunuzu uygulayın ve teslimat bilgilerinizi girin. 500 ₺ üzeri siparişlerde kargo ücretsiz.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <section className="border-b border-ink/[0.07]">
        <div className="container-x py-8 sm:py-10">
          <nav className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink/40">
            <Link href="/" className="hover:text-ink">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-ink/70">Sepet</span>
          </nav>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[34px] font-bold leading-none tracking-tight sm:text-[44px]">
                Sepetim
              </h1>
              <p className="mt-2 text-[12.5px] text-ink/45">
                Ürünlerinizi kontrol edin, teslimat bilgilerini tamamlayın.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[10px] font-semibold text-ink/50">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Güvenli sipariş · ödeme onay sonrası
            </span>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="container-x">
          <Checkout />
        </div>
      </section>
    </>
  );
}
