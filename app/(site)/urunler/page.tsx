import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, PackageCheck, Sparkles, Truck } from "lucide-react";
import { ProductBrowser } from "@/components/product-browser";
import { categoryToSlug, products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ürünler & Ampul Kataloğu",
  description:
    "LED ampuller, akıllı aydınlatma, dekoratif sarkıtlar, solar projektörler ve endüstriyel armatürler. Işık Holding kataloğunda 12 ürün ailesi, 450+ satış noktası.",
  alternates: { canonical: "/urunler" },
};

const highlights = [
  { icon: PackageCheck, label: "12 ürün", sub: "5 kategori" },
  { icon: Truck, label: "24 saat", sub: "hızlı kargo" },
  { icon: Boxes, label: "450+", sub: "bayi & satış noktası" },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const slugs = Object.values(categoryToSlug);
  const initialCategory =
    params.kategori && slugs.includes(params.kategori)
      ? params.kategori
      : "all";

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/[0.07]">
        <div
          className="absolute inset-0 -z-10 grid-lines opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-24 -top-32 -z-10 size-[420px] rounded-full halo blur-2xl"
          aria-hidden="true"
        />
        <div className="container-x py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink/40">
            <Link href="/" className="hover:text-ink">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-ink/70">Ürünler</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <div>
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand-500" />
                Katalog 2026
              </span>
              <h1 className="mt-3 max-w-[620px] font-display text-[38px] font-bold leading-[0.98] tracking-[-0.03em] sm:text-[52px]">
                Işığın her tonu,
                <br />
                <span className="text-brand-600">tek katalogda.</span>
              </h1>
              <p className="mt-4 max-w-[520px] text-[13px] leading-relaxed text-ink/55 sm:text-[14px]">
                Evinizden fabrikanıza, kafenizden otel lobisine: verimli LED
                ampuller, akıllı aydınlatma, dekoratif armatürler ve endüstriyel
                çözümler. Tümü aynı kalite standardıyla.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="chip">E27 · GU10 · Gömme</span>
                <span className="chip">2–5 yıl garanti</span>
                <span className="chip">500 ₺ üzeri ücretsiz kargo</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-3xl border border-ink/[0.08] bg-white p-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl bg-cream p-3">
                  <item.icon className="size-4 text-brand-600" />
                  <p className="mt-4 font-display text-[19px] font-bold leading-none">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[9.5px] leading-tight text-ink/40">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="container-x">
          <ProductBrowser initialCategory={initialCategory} />

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-brand p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider text-brand">
                <Sparkles className="size-3" /> Toptan & proje
              </span>
              <h2 className="mt-3 font-display text-[22px] font-semibold sm:text-[26px]">
                50+ adet mi alacaksınız? Size özel fiyat verelim.
              </h2>
              <p className="mt-1 text-[11.5px] text-ink/60">
                Bayi, otel, zincir mağaza ve proje alımlarında %38&apos;e varan
                iskonto.
              </p>
            </div>
            <Link
              href="/iletisim?konu=toptan"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-[11.5px] font-bold text-white"
            >
              Teklif isteyin <ArrowRight className="size-4 text-brand" />
            </Link>
          </div>

          <p className="mt-6 text-center text-[10px] leading-relaxed text-ink/35">
            {products.length} ürün listeleniyor · Fiyatlar KDV dahildir. Görseller
            temsilidir, ürün ambalajı değişiklik gösterebilir.
          </p>
        </div>
      </section>
    </>
  );
}
