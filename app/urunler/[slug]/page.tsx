import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  PackageCheck,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import {
  getProduct,
  getRelatedProducts,
  products,
  categoryToSlug,
} from "@/lib/products";
import { discountPercent, formatPrice } from "@/lib/utils";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Ürün bulunamadı" };

  return {
    title: `${product.name} · ${formatPrice(product.price)}`,
    description: product.shortDescription,
    alternates: { canonical: `/urunler/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image, alt: product.name }],
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 3);
  const discount = discountPercent(product.price, product.oldPrice);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: [`${site.url}${product.image}`],
            description: product.shortDescription,
            sku: product.id,
            brand: { "@type": "Brand", name: site.name },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviews,
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "TRY",
              price: product.price,
              availability: "https://schema.org/InStock",
              url: `${site.url}/urunler/${product.slug}`,
            },
          }),
        }}
      />

      <section className="pb-10 pt-6 sm:pt-8">
        <div className="container-x">
          <nav className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-medium text-ink/40">
            <Link href="/" className="hover:text-ink">
              Anasayfa
            </Link>
            <ChevronRight className="size-3 text-ink/20" />
            <Link href="/urunler" className="hover:text-ink">
              Ürünler
            </Link>
            <ChevronRight className="size-3 text-ink/20" />
            <Link
              href={`/urunler?kategori=${categoryToSlug[product.category]}`}
              className="hover:text-ink"
            >
              {product.category}
            </Link>
            <ChevronRight className="size-3 text-ink/20" />
            <span className="text-ink/70">{product.name}</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
            <div>
              <div className="relative overflow-hidden rounded-[32px] border border-ink/[0.07] bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="rounded-full bg-ink px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-brand">
                      Yeni ürün
                    </span>
                  )}
                  {discount && (
                    <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-red-600 shadow-sm">
                      %{discount} indirim
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 rounded-2xl bg-white/90 px-4 py-3 backdrop-blur">
                  <span className="flex items-center gap-2 text-[10.5px] font-semibold text-ink/60">
                    <BadgeCheck className="size-4 text-emerald-600" />
                    Işık Holding garantisi
                  </span>
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-ink/35">
                    {product.id.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { icon: Truck, title: "24 saatte kargo", sub: "500 ₺ üzeri ücretsiz" },
                  { icon: ShieldCheck, title: "2 yıl garanti", sub: "Üretici garantisi" },
                  { icon: PackageCheck, title: "14 gün iade", sub: "Koşulsuz iade hakkı" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-ink/[0.07] bg-white p-3"
                  >
                    <item.icon className="size-4 text-brand-600" />
                    <p className="mt-2 text-[10px] font-bold leading-tight">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[8.5px] leading-tight text-ink/35">
                      {item.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand/15 px-3 py-1 text-[9.5px] font-bold uppercase tracking-wider text-ink/70">
                  {product.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold">
                  <Star className="size-3.5 fill-brand-500 text-brand-500" />
                  {product.rating.toFixed(1)}
                  <span className="font-normal text-ink/40">
                    · {product.reviews.toLocaleString("tr-TR")} değerlendirme
                  </span>
                </span>
              </div>

              <h1 className="mt-3 font-display text-[32px] font-bold leading-[1.05] tracking-tight sm:text-[40px]">
                {product.name}
              </h1>
              <p className="mt-3 text-[13px] leading-relaxed text-ink/55">
                {product.shortDescription}
              </p>

              <div className="mt-5 rounded-3xl border border-ink/[0.08] bg-white p-5">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="font-display text-[34px] font-bold leading-none">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <>
                      <s className="pb-1 text-[13px] text-ink/35">
                        {formatPrice(product.oldPrice)}
                      </s>
                      <span className="mb-1 rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600">
                        %{discount} tasarruf
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-1.5 text-[10.5px] text-ink/40">
                  KDV dahil · 3 taksitle aylık{" "}
                  <strong className="font-semibold text-ink/70">
                    {formatPrice(product.price / 3)}
                  </strong>
                </p>

                <div className="mt-4 flex items-center gap-2 text-[10.5px]">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Stokta ({product.stock})
                  </span>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-ink/60">
                    ISIK15 ile %15 indirim
                  </span>
                </div>

                <div className="mt-5">
                  <ProductPurchase product={product} />
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl bg-cream p-3 text-[10px] leading-relaxed text-ink/45">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-ink/50" />
                  Ürün, Işık Holding güvencesiyle orijinal ambalajında gönderilir.
                  Toptan alımlar için{" "}
                  <Link href="/iletisim?konu=toptan" className="underline underline-offset-2 hover:text-ink">
                    teklif formu
                  </Link>
                  .
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2 rounded-xl bg-white p-3 text-[11px] leading-snug text-ink/60"
                  >
                    <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/[0.07] py-10 sm:py-12">
        <div className="container-x grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            <h2 className="font-display text-[24px] font-semibold">
              Ürün hakkında
            </h2>
            <p className="mt-3 text-[13px] leading-[1.8] text-ink/55">
              {product.description}
            </p>

            <h3 className="mt-7 font-display text-[18px] font-semibold">
              Kutusunda neler var?
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                `${product.name} (1 adet)`,
                "Türkçe kullanım kılavuzu",
                "Garanti belgesi",
                "Orijinal Işık Holding ambalajı",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[11.5px] text-ink/60"
                >
                  <span className="size-1.5 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-[24px] font-semibold">
              Teknik özellikler
            </h2>
            <dl className="mt-3 overflow-hidden rounded-2xl border border-ink/[0.08] bg-white">
              {product.specs.map((spec, index) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between gap-4 px-4 py-3 text-[12px] ${
                    index !== product.specs.length - 1
                      ? "border-b border-ink/[0.06]"
                      : ""
                  }`}
                >
                  <dt className="text-ink/45">{spec.label}</dt>
                  <dd className="text-right font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 rounded-2xl bg-brand/15 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
                Kurulum ipucu
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink/60">
                Montaj öncesinde elektriği kapatın. Duy tipinden emin değilseniz
                ürün fotoğrafını{" "}
                <a
                  href={`mailto:${site.supportEmail}`}
                  className="font-semibold underline underline-offset-2"
                >
                  {site.supportEmail}
                </a>{" "}
                adresine gönderin, ekibimiz yardımcı olsun.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[26px] font-semibold">
              Bunları da beğenebilirsiniz
            </h2>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-ink/55 hover:text-ink"
            >
              Tüm ürünler <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
