import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  Check,
  Factory,
  HeartHandshake,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { Counter } from "@/components/counter";
import { GitHubCard } from "@/components/github-card";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";
import { asset } from "@/lib/mode";

export const metadata: Metadata = {
  title: "Hakkımızda · 1998'den beri ışık üretiyoruz",
  description:
    "Işık Holding'in hikâyesi, üretim gücü, değerleri, sürdürülebilirlik yaklaşımı ve bayi ağı. 28 yıllık deneyim, 450+ satış noktası, 3 üretim tesisi.",
  alternates: { canonical: "/hakkimizda" },
};

const values = [
  {
    icon: Lightbulb,
    title: "Önce iyi ışık",
    text: "Lümen, renk sadakati ve göz konforu bizim için pazarlama cümlesi değil; her ürünün test protokolü.",
  },
  {
    icon: ShieldCheck,
    title: "Sözünde duran garanti",
    text: "Ürünün arkasında dururuz. Garanti sürecini ortalama 48 saatte sonuçlandırır, kargo ücretini biz karşılarız.",
  },
  {
    icon: Leaf,
    title: "Az enerji, çok ışık",
    text: "Ürün geliştirmede ilk hedefimiz tüketimi düşürmek. Bugüne kadar 18 milyon kWh tasarruf sağladık.",
  },
  {
    icon: HeartHandshake,
    title: "Şeffaf ticaret",
    text: "Bayi ve müşterilerimize aynı fiyat disiplinini uygularız. Kampanya koşulları herkes için açıktır.",
  },
];

const timeline = [
  {
    year: "1998",
    title: "Küçük bir atölye",
    text: "İstanbul Karaköy'de 4 kişilik ekiple floresan balast üretimine başladık.",
  },
  {
    year: "2004",
    title: "İlk LED yatırımı",
    text: "LED teknolojisine erken yatırım yaptık; ilk LED ampul hattını devreye aldık.",
  },
  {
    year: "2010",
    title: "Bayi ağı 100'ü geçti",
    text: "Anadolu'da bölgesel bayilik modeline geçtik, 100. satış noktamızı açtık.",
  },
  {
    year: "2016",
    title: "Işık Smart doğdu",
    text: "Wi-Fi kontrollü akıllı ampul ailesini Türkiye'de geliştiren ilk üreticilerden olduk.",
  },
  {
    year: "2021",
    title: "Solar ve endüstriyel",
    text: "Solar projektör ve highbay üretimiyle kurumsal proje pazarına girdik.",
  },
  {
    year: "2024",
    title: "Maslak deneyim mağazası",
    text: "Işık sıcaklığını deneyimleyebileceğiniz ilk konsept mağazamızı açtık.",
  },
  {
    year: "2026",
    title: "450+ satış noktası",
    text: "81 ilde 450'den fazla satış noktası ve 12 milyon satılan ampulle yolumuza devam ediyoruz.",
  },
];

const team = [
  {
    name: "Aylin Işık",
    role: "Yönetim Kurulu Başkanı",
    initials: "AI",
    note: "1998'de şirketin temellerini atan kurucu ortak.",
  },
  {
    name: "Kerem Işık",
    role: "Genel Müdür",
    initials: "KI",
    note: "Üretim ve tedarik zinciri dönüşümünü yönetiyor.",
  },
  {
    name: "Deniz Yalçın",
    role: "Üretim Direktörü",
    initials: "DY",
    note: "3 tesiste kalite ve verimlilik süreçlerinden sorumlu.",
  },
  {
    name: "Selin Aydın",
    role: "Tasarım Direktörü",
    initials: "SA",
    note: "Dekoratif koleksiyon ve mağaza deneyiminin arkasındaki isim.",
  },
];

const certificates = [
  "ISO 9001 Kalite Yönetimi",
  "CE & RoHS uygunluğu",
  "TSE hizmet yeterlilik",
  "EN 62471 fotobiyolojik güvenlik",
  "WEEE & elektronik atık uyumu",
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 grid-lines opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          aria-hidden="true"
        />
        <div className="container-x py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink/40">
            <Link href="/" className="hover:text-ink">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-ink/70">Hakkımızda</span>
          </nav>

          <div className="mt-6 grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <div>
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand-500" />
                Hikâyemiz
              </span>
              <h1 className="mt-3 font-display text-[40px] font-bold leading-[0.96] tracking-[-0.035em] sm:text-[56px]">
                28 yıldır aynı işi
                <br />
                <span className="relative inline-block">
                  <span
                    className="absolute inset-x-[-4px] bottom-[0.06em] -z-10 h-[0.34em] -rotate-1 bg-brand"
                    aria-hidden="true"
                  />
                  tutkuyla
                </span>{" "}
                yapıyoruz.
              </h1>
              <p className="mt-5 max-w-[520px] text-[13.5px] leading-relaxed text-ink/55 sm:text-[15px]">
                Işık Holding, 1998&apos;de Karaköy&apos;de küçük bir atölyede
                balast üretimiyle başladı. Bugün 3 üretim tesisi, 450&apos;den
                fazla satış noktası ve 600&apos;ü aşkın çalışanıyla Türkiye&apos;nin
                aydınlatma ekosisteminin parçası.
              </p>
              <p className="mt-3 max-w-[520px] text-[13.5px] leading-relaxed text-ink/55">
                Değişmeyen tek şey: ışığın insan hayatına dokunan tarafına
                inanmamız. Daha az enerjiyle daha iyi ışık üretmek için
                çalışıyoruz.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/urunler" className="btn-primary">
                  Ürünlerimizi gör <ArrowRight className="size-4" />
                </Link>
                <Link href="#bayi" className="btn-outline">
                  Bayi olun <Building2 className="size-4 text-brand-600" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[32px] border border-ink/[0.07] bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset("/images/about-warehouse.jpg")}
                  alt="Işık Holding lojistik merkezi"
                  className="aspect-[4/3] w-full rounded-[26px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 hidden w-[190px] overflow-hidden rounded-2xl border-4 border-cream bg-sand shadow-soft sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset("/images/lifestyle-home.jpg")}
                  alt="Işık Holding ürünleriyle aydınlatılmış yaşam alanı"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="absolute -right-3 -top-3 rounded-2xl bg-ink px-4 py-3 text-white shadow-soft">
                <p className="font-display text-[24px] font-bold leading-none text-brand">
                  3
                </p>
                <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-white/40">
                  üretim tesisi
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 rounded-3xl border border-ink/[0.07] bg-white p-4 sm:p-5 md:grid-cols-4">
            {site.stats.map((stat) => (
              <div key={stat.label} className="border-l border-ink/[0.07] pl-4 first:border-l-0 first:pl-0">
                <p className="font-display text-[28px] font-bold leading-none sm:text-[34px]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink/40">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Yolculuk"
            title="Bir atölyeden 81 ile."
            description="Her dönüm noktası, ışığı daha erişilebilir kılma hedefimizin bir parçası."
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map((item, index) => (
              <div
                key={item.year}
                className={`relative rounded-2xl border p-4 ${
                  index === timeline.length - 1
                    ? "border-ink bg-ink text-white"
                    : "border-ink/[0.08] bg-white"
                }`}
              >
                <span
                  className={`font-display text-[12px] font-bold ${
                    index === timeline.length - 1 ? "text-brand" : "text-brand-700"
                  }`}
                >
                  {item.year}
                </span>
                <h3 className="mt-2 font-display text-[15px] font-semibold leading-snug">
                  {item.title}
                </h3>
                <p
                  className={`mt-1.5 text-[10.5px] leading-relaxed ${
                    index === timeline.length - 1 ? "text-white/50" : "text-ink/45"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Değerlerimiz"
            title="Işığı üretirken pusulamız."
            description="Her kararımızda bu dört ilkeyi test ederiz."
          />
          <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-3xl border border-ink/[0.07] bg-white p-5 transition hover:-translate-y-1 hover:border-ink/15 hover:shadow-card"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/15 transition group-hover:bg-brand">
                  <value.icon className="size-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-[16px] font-semibold leading-snug">
                  {value.title}
                </h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink/50">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="surdurulebilirlik"
        className="scroll-mt-24 py-12 sm:py-16"
      >
        <div className="container-x">
          <div className="relative overflow-hidden rounded-[36px] bg-ink p-7 text-white sm:p-10 lg:p-12">
            <div
              className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,200,0,.95), transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-300">
                  <Leaf className="size-3" /> Sürdürülebilirlik
                </span>
                <h2 className="mt-4 max-w-[520px] font-display text-[30px] font-semibold leading-[1.05] sm:text-[40px]">
                  Daha parlak bir gelecek,
                  <br />
                  daha az tüketimle mümkün.
                </h2>
                <p className="mt-4 max-w-[500px] text-[12.5px] leading-relaxed text-white/50">
                  2024&apos;ten bu yana üretim tesislerimizde güneş enerjisi
                  kullanıyoruz. Ambalajlarımızın %92&apos;si geri dönüştürülebilir;
                  kullanım ömrü biten ürünleri ücretsiz geri topluyoruz.
                </p>
                <Link
                  href="/urunler?kategori=led-aydinlatma"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-[11.5px] font-bold text-ink transition hover:bg-brand-300"
                >
                  Enerji verimli ürünler <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "18M", label: "kWh yıllık enerji tasarrufu", icon: Sparkles },
                  { value: "%92", label: "geri dönüştürülebilir ambalaj", icon: Leaf },
                  { value: "1.200", label: "ton elektronik atık geri kazanımı", icon: Factory },
                  { value: "%100", label: "yenilenebilir elektrik kullanımı", icon: Target },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-2xl bg-white/[0.06] p-4">
                    <metric.icon className="size-4 text-brand-300" />
                    <p className="mt-4 font-display text-[26px] font-bold leading-none">
                      {metric.value}
                    </p>
                    <p className="mt-1.5 text-[9.5px] leading-snug text-white/40">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Ekip"
            title="Işığın arkasındaki insanlar."
            description="Üretimden tasarıma, lojistikten müşteri deneyimine 600'ü aşkın kişilik bir aileyiz."
          />
          <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person, index) => (
              <div
                key={person.name}
                className="rounded-3xl border border-ink/[0.07] bg-white p-5"
              >
                <span
                  className={`flex size-14 items-center justify-center rounded-2xl font-display text-[17px] font-bold ${
                    index === 0 ? "bg-brand" : "bg-cream"
                  }`}
                >
                  {person.initials}
                </span>
                <h3 className="mt-4 font-display text-[15px] font-semibold">
                  {person.name}
                </h3>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                  {person.role}
                </p>
                <p className="mt-2 text-[10.5px] leading-relaxed text-ink/45">
                  {person.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-ink/35">
              Sertifikalar:
            </span>
            {certificates.map((item) => (
              <span key={item} className="chip">
                <Award className="size-3 text-brand-600" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-12">
            <div>
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand-500" />
                Açık kaynak & teknoloji
              </span>
              <h2 className="mt-3 max-w-[460px] font-display text-[30px] font-semibold leading-[1.08] sm:text-[38px]">
                Işık&apos;ın dijital tarafı da şeffaf.
              </h2>
              <p className="mt-3 max-w-[480px] text-[13px] leading-relaxed text-ink/55">
                Bu web sitesi Next.js 15 ve React 19 ile geliştirildi; form
                verileri Supabase üzerinde saklanır, haber akışı açık RSS
                kaynaklarından beslenir. Kaynak kodu GitHub&apos;da herkese
                açıktır.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Next.js 15",
                  "React 19",
                  "Tailwind CSS",
                  "Supabase",
                  "GitHub API",
                  "RSS",
                ].map((tech) => (
                  <span key={tech} className="chip">
                    <Check className="size-3 text-emerald-600" />
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <a
                  href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_REPO ?? "31madaracollet/IsikHolding"}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[11.5px] font-bold text-white"
                >
                  <GithubIcon className="size-4 text-brand" />
                  Depoyu incele
                </a>
                <Link
                  href="/iletisim"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-5 py-3 text-[11.5px] font-bold"
                >
                  Dijital ekip <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>

            <GitHubCard />
          </div>
        </div>
      </section>

      <section id="bayi" className="scroll-mt-24 py-12 sm:py-16">
        <div className="container-x">
          <div className="grid overflow-hidden rounded-[36px] border border-ink/[0.08] bg-white lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 sm:p-10">
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand-500" />
                Bayi ağı
              </span>
              <h2 className="mt-3 font-display text-[30px] font-semibold leading-[1.08] sm:text-[36px]">
                450 satış noktası,
                <br />
                bir ortak akıl.
              </h2>
              <p className="mt-3 max-w-[480px] text-[12.5px] leading-relaxed text-ink/50">
                Toptan alım, bayilik ve proje iş birlikleri için Türkiye&apos;nin
                her bölgesinde çözüm ortağı arıyoruz. Dijital bayi paneli, ürün
                eğitimi ve pazarlama desteği bizden.
              </p>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {[
                  "%38'e varan iskonto",
                  "60 güne kadar vade",
                  "Mağaza teşhir desteği",
                  "Bölgesel münhasırlık",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5 text-[11px] font-semibold text-ink/65"
                  >
                    <Check className="size-3.5 text-emerald-600" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <Link href="/iletisim?konu=toptan" className="btn-primary">
                  Bayilik başvurusu <ArrowRight className="size-4" />
                </Link>
                <Link href="/fiyatlandirma" className="btn-outline">
                  Bayi fiyatları
                </Link>
              </div>
            </div>

            <div className="relative flex items-end bg-brand p-7 sm:p-10">
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full border-[24px] border-white/30"
                aria-hidden="true"
              />
              <div className="relative grid w-full grid-cols-2 gap-3">
                {[
                  { icon: Users, value: "450+", label: "aktif satış noktası" },
                  { icon: Factory, value: "3", label: "üretim tesisi" },
                  { icon: Building2, value: "81", label: "ilde teslimat" },
                  { icon: Award, value: "28", label: "yıllık deneyim" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/55 p-4 backdrop-blur">
                    <item.icon className="size-4" />
                    <p className="mt-4 font-display text-[24px] font-bold leading-none">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[9px] font-semibold leading-tight text-ink/50">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
