import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  Check,
  CircleDollarSign,
  Cpu,
  Factory,
  Headphones,
  LampCeiling,
  Megaphone,
  PackageCheck,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Truck,
  Zap,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { NewsCard } from "@/components/news-card";
import { NewsTicker } from "@/components/news-ticker";
import { BulbQuiz } from "@/components/bulb-quiz";
import { Faq } from "@/components/faq";
import { Counter } from "@/components/counter";
import { categories, getFeaturedProducts } from "@/lib/products";
import { getNews, companyUpdates } from "@/lib/news";
import { subscriptionPlans } from "@/lib/pricing";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { asset } from "@/lib/mode";

export const revalidate = 900;

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
};

const categoryIcons = {
  zap: Zap,
  cpu: Cpu,
  sparkles: Sparkles,
  sun: Sun,
  factory: Factory,
} as const;

const partners = [
  "Anadolu Yapı Market",
  "Ege Elektrik",
  "Marmara Proje",
  "Beyaz Mimarlık",
  "Kuzey Otel Grubu",
  "Akdeniz Yapı",
  "Vera Mağazacılık",
  "Trakya Enerji",
];

const testimonials = [
  {
    quote:
      "Mağazamızın tüm aydınlatmasını Işık Holding'e devrettik. Elektrik faturası ilk ayda yüzde 28 düştü; ürün kalitesi ve teslimat hızı beklentimizin üzerinde.",
    name: "Elif Kaya",
    role: "Kurucu · Vera Kafe",
    city: "İzmir",
    initials: "EK",
  },
  {
    quote:
      "120 dairelik sitenin ortak alan aydınlatmasını 3 günde yenilediler. Sensörlü sistem sayesinde koridorlar artık boşken yanmıyor. Ekip çok titizdi.",
    name: "Murat Demir",
    role: "Site Yöneticisi · Kuzey Konutları",
    city: "İstanbul",
    initials: "MD",
  },
  {
    quote:
      "Işık Smart ampullerle evde senaryo kurmak çok kolay. Uygulama Türkçe, destek ekibi telefonu ilk çalışta açıyor. İkinci alışverişim, memnunum.",
    name: "Zeynep Arslan",
    role: "Mimar",
    city: "Ankara",
    initials: "ZA",
  },
];

const faqs = [
  {
    question: "Siparişim ne kadar sürede kargoya verilir?",
    answer:
      "Stoktaki ürünler saat 16.00'ya kadar verilen siparişlerde aynı gün kargoya teslim edilir. Türkiye genelinde ortalama teslimat süresi 1–3 iş günüdür. 500 ₺ ve üzeri siparişlerde kargo ücretsizdir.",
  },
  {
    question: "Ampuller hangi duylarla uyumlu?",
    answer:
      "Kataloğumuzdaki ampullerin büyük bölümü standart E27 duy içindir. GU10 spotlar, sarkıtlar ve panel ürünlerde duy tipi ürün sayfasındaki teknik tabloda belirtilir. Emin değilseniz Işık Asistanı'nı kullanabilir veya bize yazabilirsiniz.",
  },
  {
    question: "Garanti süresi ve kapsamı nedir?",
    answer:
      "LED ampullerde 2 yıl, Işık Pro serisinde 5 yıl, solar ve endüstriyel ürünlerde 3–5 yıl üretici garantisi sunulur. Garanti kapsamındaki ürünlerde kargo ücreti bize aittir; ürün değişimi 48 saat içinde başlatılır.",
  },
  {
    question: "Toptan veya proje bazlı çalışıyor musunuz?",
    answer:
      "Evet. 450'den fazla satış noktası ve kurumsal proje ortağımız var. Bayilik, toptan alım ve proje danışmanlığı için İletişim sayfasındaki formdan 'Toptan & bayilik' konusunu seçebilir veya 0212 909 40 40 numaralı hattımızı arayabilirsiniz.",
  },
  {
    question: "Ürünü denedikten sonra iade edebilir miyim?",
    answer:
      "Kullanılmamış ürünleri teslimat tarihinden itibaren 14 gün içinde orijinal ambalajıyla iade edebilirsiniz. Arızalı ürünlerde kargo ücreti bizden; diğer iadelerde kargo ücreti alıcıya aittir. İade süreci ortalama 3 iş günü içinde tamamlanır.",
  },
];

export default async function HomePage() {
  const { items: news, live } = await getNews();
  const featured = getFeaturedProducts().slice(0, 4);
  const feed = news.slice(0, 5);
  const heroProduct = featured.find((item) => item.slug === "isik-smart-rgbw");

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 grid-lines opacity-70 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-32 -top-48 -z-10 size-[640px] rounded-full halo blur-2xl"
          aria-hidden="true"
        />

        <div className="container-x grid items-center gap-10 pb-8 pt-8 sm:pt-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14 lg:pb-16 lg:pt-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
              </span>
              1998&apos;den beri · 81 ilde ışık
            </div>

            <h1 className="mt-6 font-display text-[46px] font-bold leading-[0.94] tracking-[-0.035em] sm:text-[60px] lg:text-[68px]">
              Işığın
              <br />
              geleceğini{" "}
              <span className="relative inline-block">
                <span
                  className="absolute inset-x-[-4px] bottom-[0.08em] -z-10 h-[0.36em] -rotate-[1.2deg] rounded-[3px] bg-brand"
                  aria-hidden="true"
                />
                birlikte
              </span>
              <br />
              yakıyoruz.
            </h1>

            <p className="mt-6 max-w-[480px] text-[14px] leading-relaxed text-ink/55 sm:text-[15.5px]">
              LED ampullerden akıllı aydınlatmaya, solar sistemlerden endüstriyel
              projelere kadar ışığın her tonunu {new Date().getFullYear() - site.foundedYear}{" "}
              yıldır Türkiye&apos;nin dört bir yanına taşıyoruz.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link href="/urunler" className="btn-primary">
                Ampulleri keşfet
                <ArrowRight className="size-4" />
              </Link>
              <Link href="#asistan" className="btn-outline">
                <Sparkles className="size-4 text-brand-600" />
                Işık asistanını dene
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {["EK", "MD", "ZA", "BK"].map((initials, index) => (
                    <span
                      key={initials}
                      className="flex size-7 items-center justify-center rounded-full border-2 border-cream bg-ink text-[8px] font-bold text-brand"
                      style={{ zIndex: 10 - index }}
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <div>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className="size-3 fill-brand-500 text-brand-500"
                      />
                    ))}
                    <span className="ml-1 text-[10.5px] font-bold">4.9/5</span>
                  </span>
                  <span className="text-[9.5px] text-ink/40">
                    2.400+ doğrulanmış değerlendirme
                  </span>
                </div>
              </div>
              <span className="hidden h-7 w-px bg-ink/10 sm:block" />
              <div className="flex items-center gap-4 text-[10.5px] font-semibold text-ink/55">
                <span className="flex items-center gap-1.5">
                  <Truck className="size-3.5 text-brand-600" /> 500 ₺ üzeri ücretsiz
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-brand-600" /> 2 yıl garanti
                </span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div
              className="absolute -inset-6 rounded-[48px] border border-brand/30"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[36px] bg-brand shadow-[0_50px_120px_-40px_rgba(180,123,0,0.55)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/images/hero-bulb.jpg")}
                alt="Işık Holding Edison ampul kampanyası"
                className="aspect-[5/4] w-full object-cover"
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur">
                Yeni sezon · Işık Smart
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-2xl bg-ink/90 px-3.5 py-2.5 text-white backdrop-blur">
                <span className="flex size-8 items-center justify-center rounded-full bg-brand text-ink">
                  <Zap className="size-4" />
                </span>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/45">
                    Enerji tasarrufu
                  </p>
                  <p className="text-[13px] font-bold leading-none">
                    %85&apos;e kadar
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 top-[38%] hidden w-[184px] rounded-2xl border border-ink/[0.06] bg-white/95 p-3 shadow-soft backdrop-blur sm:block">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroProduct?.image ?? asset("/images/product-smart.jpg")}
                  alt=""
                  className="size-10 rounded-lg object-cover"
                />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-ink/35">
                    Akıllı ampul
                  </p>
                  <p className="text-[11.5px] font-bold leading-tight">
                    Işık Smart RGBW
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[11px] font-bold">349,90 ₺</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8.5px] font-bold text-emerald-700">
                  Stokta
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/5">
                <div className="h-full w-[72%] rounded-full bg-brand" />
              </div>
              <p className="mt-1.5 text-[8.5px] text-ink/35">
                Bu hafta 128 kişi satın aldı
              </p>
            </div>

            <div className="absolute -bottom-5 -right-3 flex size-[92px] rotate-6 flex-col items-center justify-center rounded-full bg-ink text-center text-white shadow-xl sm:-right-6 sm:size-[104px]">
              <span className="font-display text-[26px] font-bold leading-none text-brand sm:text-[30px]">
                28<span className="text-brand-300">+</span>
              </span>
              <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white/50">
                yıllık
                <br />
                deneyim
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── GÜVEN & İSTATİSTİK ───────────────────────────────────────────── */}
      <section className="border-y border-ink/[0.07] bg-white/60">
        <div className="container-x grid grid-cols-2 divide-x divide-ink/[0.07] py-6 md:grid-cols-4">
          {site.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-5 py-3 ${index < 2 ? "border-b border-ink/[0.07] md:border-b-0" : ""} ${index === 0 ? "pl-0" : ""}`}
            >
              <p className="font-display text-[30px] font-bold leading-none tracking-tight sm:text-[36px]">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARTNER ŞERİDİ ───────────────────────────────────────────────── */}
      <section className="overflow-hidden py-9">
        <div className="container-x">
          <p className="text-center text-[9.5px] font-bold uppercase tracking-[0.24em] text-ink/35">
            450+ satış noktası ve proje ortağı bize güveniyor
          </p>
        </div>
        <div className="group relative mt-5 overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee items-center gap-10 group-hover:[animation-play-state:paused]">
            {[...partners, ...partners, ...partners, ...partners].map(
              (partner, index) => (
                <span
                  key={`${partner}-${index}`}
                  className="flex shrink-0 items-center gap-3 whitespace-nowrap font-display text-[15px] font-semibold tracking-tight text-ink/30 transition hover:text-ink/60"
                >
                  <span className="size-1.5 rounded-full bg-brand-500/60" />
                  {partner}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── KATEGORİLER ──────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Katalog"
            title="Her mekânın ihtiyacına göre aydınlatma."
            description="Evden fabrikaya, kafeden otel lobisine: doğru ürün, doğru ışık sıcaklığı ve doğru tüketimle."
            action={{ label: "Tüm ürünler", href: "/urunler" }}
          />

          <div className="mt-8 grid gap-3.5 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => {
              const Icon =
                categoryIcons[category.icon as keyof typeof categoryIcons] ??
                Zap;
              if (index === 0) {
                return (
                  <Link
                    key={category.slug}
                    href={`/urunler?kategori=${category.slug}`}
                    className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[28px] bg-ink p-6 text-white md:col-span-2 lg:row-span-2 lg:min-h-[420px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.image}
                      alt=""
                      className="absolute inset-0 size-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                    <div className="relative">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-ink">
                        <Icon className="size-3" /> En geniş aile
                      </span>
                      <h3 className="mt-3 font-display text-[26px] font-semibold leading-tight">
                        {category.name}
                      </h3>
                      <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-white/55">
                        {category.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold text-brand-300">
                        {category.count} ürün ailesi
                        <ArrowUpRight className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={category.slug}
                  href={`/urunler?kategori=${category.slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-ink/[0.07] bg-white p-5 transition duration-500 hover:-translate-y-1 hover:border-ink/15 hover:shadow-card lg:min-h-[200px]"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-ink transition group-hover:bg-brand">
                      <Icon className="size-[18px]" strokeWidth={1.8} />
                    </span>
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-ink/30">
                      0{category.count} ürün
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-display text-[17px] font-semibold leading-tight">
                      {category.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink/45">
                      {category.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[10.5px] font-bold text-ink/60 transition group-hover:text-ink">
                      Koleksiyonu gör
                      <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ÖNE ÇIKAN ÜRÜNLER ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Öne çıkanlar"
            title="Bu ay en çok ışıldayan ürünler."
            description="Editör ekibimizin seçtiği, müşterilerimizin en çok tercih ettiği ürünler. Tümü 24 saat içinde kargoda."
            action={{ label: "Katalogu aç", href: "/urunler" }}
          />
          <div className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-[11px] text-ink/50">
            <p className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-emerald-600" />
              Tüm ürünler orijinal faturalı, stoktan teslim.
            </p>
            <Link
              href="/fiyatlandirma#urun-fiyatlari"
              className="inline-flex items-center gap-1 font-bold text-ink hover:text-brand-600"
            >
              Fiyat listesini gör <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── KAMPANYA ─────────────────────────────────────────────────────── */}
      <section className="container-x py-6 sm:py-10">
        <div className="relative overflow-hidden rounded-[36px] bg-brand p-6 sm:p-10 lg:p-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-[380px] rounded-full border-[36px] border-white/25"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-32 left-1/3 size-[300px] rounded-full bg-brand-300/50 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand">
                <Zap className="size-3" /> Ekim ampul kampanyası
              </span>
              <h2 className="mt-4 max-w-[520px] font-display text-[32px] font-bold leading-[1.04] tracking-tight sm:text-[44px]">
                Ampuller değişsin,
                <br />
                fatura hafiflesin.
              </h2>
              <p className="mt-3 max-w-[460px] text-[13px] leading-relaxed text-ink/65">
                Tüm LED ampullerde{" "}
                <strong className="font-bold text-ink">%35&apos;e varan indirim</strong>{" "}
                ve 3&apos;lü setlerde ek %10. Kod: <strong>ISIK15</strong>. Ay
                sonuna kadar geçerli.
              </p>

              <div className="mt-5 flex flex-wrap items-end gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/50">
                    Başlangıç fiyatı
                  </p>
                  <p className="font-display text-[30px] font-bold leading-none">
                    58,44 ₺
                  </p>
                  <p className="mt-1 text-[10.5px] text-ink/50">
                    <s>89,90 ₺</s> · Işık Eco 9W
                  </p>
                </div>
                <Link
                  href="/urunler?kategori=led-aydinlatma"
                  className="btn-dark"
                >
                  Kampanyaya katıl <ArrowRight className="size-4 text-brand" />
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold text-ink/55">
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5" /> 500 ₺ üzeri ücretsiz kargo
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5" /> 2 yıl garanti
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5" /> 14 gün iade
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[320px]">
              <div className="overflow-hidden rounded-t-[160px] rounded-b-3xl border-2 border-ink/10 bg-white/30 p-2 backdrop-blur">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset("/images/product-led.jpg")}
                  alt="Işık Eco LED ampul kampanyası"
                  className="aspect-[4/5] w-full rounded-t-[150px] rounded-b-2xl object-cover"
                />
              </div>
              <div className="absolute -left-5 bottom-8 rounded-2xl bg-white px-3.5 py-2.5 shadow-soft">
                <p className="text-[8.5px] font-bold uppercase tracking-wider text-ink/35">
                  Sepet indirimi
                </p>
                <p className="font-display text-[22px] font-bold leading-none text-ink">
                  −%35
                </p>
              </div>
              <div className="absolute -right-3 top-6 flex size-14 rotate-12 items-center justify-center rounded-full bg-ink text-center text-[9px] font-bold uppercase leading-tight tracking-wider text-brand">
                Fırsat
                <br />
                ürünü
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HAKKIMIZDA / RAKAMLAR ────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <div className="grid overflow-hidden rounded-[36px] border border-ink/[0.08] bg-white lg:grid-cols-2">
            <div className="relative min-h-[300px] overflow-hidden lg:min-h-[500px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/images/about-warehouse.jpg")}
                alt="Işık Holding depo ve lojistik merkezi"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                <div className="rounded-2xl bg-white/90 px-4 py-3 backdrop-blur">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-ink/40">
                    Merkez
                  </p>
                  <p className="text-[12px] font-bold">İstanbul · Maslak</p>
                </div>
                <div className="rounded-2xl bg-ink/85 px-4 py-3 text-white backdrop-blur">
                  <p className="text-[9px] uppercase tracking-wider text-white/40">
                    Lojistik
                  </p>
                  <p className="text-[12px] font-bold text-brand-300">
                    24 saatte sevkiyat
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand-500" />
                Hakkımızda
              </span>
              <h2 className="mt-3 font-display text-[30px] font-semibold leading-[1.1] sm:text-[38px]">
                Işık, üretimden sofraya değil; üretimden{" "}
                <span className="text-brand-600">evinize</span>.
              </h2>
              <p className="mt-4 text-[13px] leading-relaxed text-ink/55">
                1998&apos;de İstanbul&apos;da küçük bir atölyede başlayan
                hikâyemiz, bugün 3 üretim tesisi, 450&apos;den fazla satış noktası
                ve 81 ile uzanan bir lojistik ağına dönüştü. Her ampulde aynı
                takıntıyı taşıyoruz: daha az enerjiyle daha iyi ışık.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: Factory, title: "3 üretim tesisi", text: "İstanbul, Bursa, Kayseri" },
                  { icon: PackageCheck, title: "24 saat sevkiyat", text: "Stoktan hızlı teslimat" },
                  { icon: Award, title: "ISO 9001 & CE", text: "Uluslararası sertifikasyon" },
                  { icon: LeafIcon, title: "%100 geri dönüşüm", text: "Ambalaj ve elektronik atık" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-2.5 rounded-2xl bg-cream p-3"
                  >
                    <item.icon className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    <div>
                      <p className="text-[11px] font-bold leading-tight">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[9.5px] text-ink/40">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/hakkimizda"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-[11.5px] font-bold text-white transition hover:bg-ink-soft"
              >
                Hikâyemizi okuyun
                <ArrowRight className="size-4 text-brand" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HABER AKIŞI ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Işık gündem"
            title="Enerji dünyasından son dakika, araya karışan bizden."
            description="Sektör sitelerinden otomatik çekilen haberleri kendi duyurularımızla harmanlayarak tek akışta sunuyoruz."
            action={{ label: "Tüm haberler", href: "/haberler" }}
          />

          <div className="mt-7">
            <NewsTicker items={news} />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-5">
              {feed[0] && <NewsCard item={feed[0]} featured />}

              <div className="grid gap-5 sm:grid-cols-2">
                {feed.slice(1, 3).map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>

              <Link
                href={companyUpdates[0].href}
                className="group relative block overflow-hidden rounded-3xl bg-brand p-5 sm:p-6"
              >
                <div
                  className="absolute -right-8 -top-10 size-40 rounded-full border-[22px] border-white/25"
                  aria-hidden="true"
                />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-[430px]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider text-brand">
                      <Megaphone className="size-3" />
                      {companyUpdates[0].tag} · Işık Holding
                    </span>
                    <h3 className="mt-3 font-display text-[19px] font-semibold leading-snug">
                      {companyUpdates[0].title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-ink/60">
                      {companyUpdates[0].excerpt}
                    </p>
                  </div>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-brand transition group-hover:scale-110">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </Link>

              <div className="grid gap-5 sm:grid-cols-2">
                {feed.slice(3, 5).map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-ink p-5 text-white">
                <div
                  className="absolute -right-16 -top-16 size-48 rounded-full opacity-30 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,200,0,.9), transparent 70%)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[0.18em] text-brand-300">
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                      </span>
                      {live ? "Canlı akış" : "Editoryal akış"}
                    </span>
                    <Radio className="size-3.5 text-white/25" />
                  </div>
                  <p className="mt-3 font-display text-[17px] font-semibold leading-snug">
                    {live
                      ? "Haberler RSS kaynaklarından canlı olarak akıyor."
                      : "Sektör gündemi editör ekibimizin derlemesiyle güncelleniyor."}
                  </p>
                  <p className="mt-2 text-[10.5px] leading-relaxed text-white/40">
                    Webrazzi, Enerji Günlüğü, Donanım Haber ve Anadolu Ajansı
                    kaynakları her 15 dakikada bir kontrol edilir.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["Webrazzi", "Enerji Günlüğü", "Donanım Haber", "AA"].map(
                      (source) => (
                        <span
                          key={source}
                          className="rounded-full border border-white/12 px-2 py-1 text-[8.5px] font-semibold text-white/45"
                        >
                          {source}
                        </span>
                      ),
                    )}
                  </div>
                  <Link
                    href="/haberler"
                    className="mt-4 inline-flex items-center gap-1.5 text-[10.5px] font-bold text-brand-300 hover:text-brand-200"
                  >
                    Tüm akışı aç <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-ink/[0.08] bg-white p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-[15px] font-semibold">
                    Işık&apos;tan
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink/30">
                    Duyurular
                  </span>
                </div>
                <ul className="mt-3 divide-y divide-ink/[0.06]">
                  {companyUpdates.slice(1, 4).map((update) => (
                    <li key={update.id}>
                      <Link
                        href={update.href}
                        className="group flex flex-col gap-1 py-3"
                      >
                        <span className="flex items-center gap-2 text-[8.5px] font-bold uppercase tracking-wider text-brand-700">
                          {update.tag}
                          <span className="text-ink/25">
                            {formatDate(update.date)}
                          </span>
                        </span>
                        <span className="text-[12px] font-semibold leading-snug transition group-hover:text-ink/60">
                          {update.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/haberler#duyurular"
                  className="mt-1 inline-flex items-center gap-1 text-[10.5px] font-bold text-ink/55 hover:text-ink"
                >
                  Tüm duyurular <ArrowUpRight className="size-3" />
                </Link>
              </div>

              <div className="rounded-3xl bg-brand/20 p-5">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-ink/45">
                  <CircleDollarSign className="size-3.5" />
                  Enerji verimliliği
                </div>
                <p className="mt-2 font-display text-[16px] font-semibold leading-snug">
                  Bir ampulü değiştirmek yılda 240 ₺ tasarruf demek.
                </p>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink/50">
                  Ortalama bir evde 10 ampulü LED&apos;e geçirmek, yıllık elektrik
                  faturasında ciddi bir fark yaratır.
                </p>
                <Link
                  href="/urunler?kategori=led-aydinlatma"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[10px] font-bold text-brand"
                >
                  LED&apos;e geç <ArrowRight className="size-3" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── IŞIK ASİSTANI ────────────────────────────────────────────────── */}
      <section id="asistan" className="scroll-mt-24 py-12 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Karar desteği"
            title="Doğru ampulü 30 saniyede bulun."
            description="Üç kısa soruyla mekânınıza en uygun ürünü önerelim. Işık asistanı tamamen ücretsiz."
            className="mb-7"
          />
          <BulbQuiz />
        </div>
      </section>

      {/* ── FİYATLAR ─────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Işık Kulübü"
            title="Aydınlatma artık abonelik kadar kolay."
            description="Ampulünüz bittiğinde düşünmeyin. Aylık planla ihtiyacınız kadar ampul kapınıza gelsin, kulüp indirimleri otomatik uygulansın."
            action={{ label: "Tüm planlar", href: "/fiyatlandirma" }}
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-[28px] border p-6 ${
                  plan.highlight
                    ? "border-ink bg-ink text-white"
                    : "border-ink/[0.08] bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-[18px] font-semibold">
                    {plan.name}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider ${
                      plan.highlight
                        ? "bg-brand text-ink"
                        : "bg-ink/[0.05] text-ink/50"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
                <p
                  className={`mt-2 min-h-[34px] text-[11px] leading-relaxed ${
                    plan.highlight ? "text-white/50" : "text-ink/45"
                  }`}
                >
                  {plan.tagline}
                </p>
                <p className="mt-4 font-display text-[30px] font-bold leading-none">
                  {plan.monthly.toLocaleString("tr-TR")} ₺
                  <span
                    className={`ml-1 text-[10px] font-semibold ${
                      plan.highlight ? "text-white/45" : "text-ink/40"
                    }`}
                  >
                    / ay
                  </span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-2 text-[11px] ${
                        plan.highlight ? "text-white/65" : "text-ink/55"
                      }`}
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-5 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[11px] font-bold transition ${
                    plan.highlight
                      ? "bg-brand text-ink hover:bg-brand-300"
                      : "border border-ink/12 hover:bg-ink hover:text-white"
                  }`}
                >
                  {plan.cta} <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[10px] text-ink/35">
            Planlar KDV dahildir, taahhüt yoktur. İstediğiniz zaman duraklatabilir
            veya iptal edebilirsiniz.
          </p>
        </div>
      </section>

      {/* ── YORUMLAR ─────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <div className="rounded-[36px] bg-sand p-6 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="eyebrow">
                  <span className="size-1.5 rounded-full bg-brand-500" />
                  Müşteri deneyimi
                </span>
                <h2 className="mt-3 max-w-lg font-display text-[30px] font-semibold leading-[1.1] sm:text-[38px]">
                  Işığımızı kullananlar anlatsın.
                </h2>
              </div>
              <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5">
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="size-3.5 fill-brand-500 text-brand-500"
                    />
                  ))}
                </span>
                <span className="text-[11px] font-bold">4.9 / 5</span>
                <span className="text-[10px] text-ink/40">2.400+ değerlendirme</span>
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {testimonials.map((item) => (
                <figure
                  key={item.name}
                  className="flex flex-col rounded-3xl bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className="size-3 fill-brand-500 text-brand-500"
                        />
                      ))}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-emerald-700">
                      <BadgeCheck className="size-2.5" /> Doğrulandı
                    </span>
                  </div>
                  <blockquote className="mt-4 flex-1 text-[12px] leading-relaxed text-ink/65">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-2.5 border-t border-ink/[0.06] pt-4">
                    <span className="flex size-9 items-center justify-center rounded-full bg-brand font-display text-[10px] font-bold">
                      {item.initials}
                    </span>
                    <div>
                      <p className="text-[11.5px] font-bold">{item.name}</p>
                      <p className="text-[9.5px] text-ink/40">
                        {item.role} · {item.city}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SSS + CTA ────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <span className="eyebrow">
              <span className="size-1.5 rounded-full bg-brand-500" />
              Sık sorulanlar
            </span>
            <h2 className="mt-3 font-display text-[30px] font-semibold leading-[1.1] sm:text-[38px]">
              Aklınızda soru mu kaldı?
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/50">
              En sık gelen soruları burada topladık. Aradığınızı bulamadıysanız
              ekibimiz bir telefon uzağınızda.
            </p>

            <div className="mt-6 rounded-3xl bg-ink p-5 text-white">
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-brand-300">
                <Headphones className="size-3.5" /> Uzman desteği
              </div>
              <p className="mt-2 font-display text-[18px] font-semibold leading-snug">
                Projeniz için ücretsiz keşif ve teklif.
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
                Mağaza, ofis, otel veya fabrika: keşif ekibimiz yerinde ölçüm
                yapıp size özel bir aydınlatma planı hazırlar.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/iletisim?konu=proje"
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-[10.5px] font-bold text-ink"
                >
                  Teklif isteyin <ArrowRight className="size-3" />
                </Link>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-[10.5px] font-bold"
                >
                  {site.phone}
                </a>
              </div>
            </div>

            <Link
              href="/hakkimizda#bayi"
              className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-4 transition hover:border-ink/25"
            >
              <span className="flex items-center gap-2.5">
                <LampCeiling className="size-4 text-brand-600" />
                <span className="text-[11.5px] font-semibold">
                  Bayi olmak ister misiniz?
                </span>
              </span>
              <ArrowUpRight className="size-4 text-ink/30" />
            </Link>
          </div>

          <Faq items={faqs} />
        </div>
      </section>

      {/* ── SON CTA ──────────────────────────────────────────────────────── */}
      <section className="container-x pb-16">
        <div className="relative overflow-hidden rounded-[36px] border border-ink/[0.07] bg-white px-6 py-10 text-center sm:px-12">
          <div
            className="pointer-events-none absolute inset-x-0 -top-24 mx-auto size-72 rounded-full halo blur-2xl"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em]">
              <Play className="size-3" /> 10 yıldan uzun ömür
            </span>
            <h2 className="mx-auto mt-4 max-w-[620px] font-display text-[32px] font-semibold leading-[1.05] sm:text-[44px]">
              Işığınızı bir üst seviyeye taşımaya hazır mısınız?
            </h2>
            <p className="mx-auto mt-3 max-w-[480px] text-[13px] leading-relaxed text-ink/50">
              Kataloğu keşfedin veya size özel çözüm için ekibimizle konuşun.
              İlk siparişinizde ISIK15 koduyla %15 indirim sizi bekliyor.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <Link href="/urunler" className="btn-primary">
                Alışverişe başla <ArrowRight className="size-4" />
              </Link>
              <Link href="/iletisim" className="btn-outline">
                Ekiple görüş <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function LeafIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
