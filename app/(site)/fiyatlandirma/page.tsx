import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Cpu,
  Gauge,
  Info,
  Minus,
  Sparkles,
  Wrench,
} from "lucide-react";
import { PricingTabs } from "@/components/pricing-tabs";
import { PriceList } from "@/components/price-list";
import { Faq } from "@/components/faq";
import { addOns, subscriptionPlans } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Fiyatlandırma · Ampullere abonelik, bayilere özel fiyat",
  description:
    "Işık Kulübü abonelik planları, toptan ve bayi fiyatları, tek ürün fiyat listesi ve profesyonel hizmet ücretleri. Tüm fiyatlar KDV dahildir.",
  alternates: { canonical: "/fiyatlandirma" },
};

const addOnIcons = {
  sparkles: Sparkles,
  wrench: Wrench,
  cpu: Cpu,
  gauge: Gauge,
} as const;

const comparison = [
  { label: "Aylık LED ampul", values: ["3 adet", "6 adet", "12 adet"] },
  { label: "Akıllı ampul", values: ["—", "3 ayda 1", "3 ayda 1 + sensör"] },
  { label: "Kulüp indirimi", values: ["%10", "%15", "%20"] },
  { label: "Ücretsiz kargo", values: [true, true, true] },
  { label: "Enerji analizi", values: ["—", "Yılda 1", "Yılda 2"] },
  { label: "Keşif & montaj", values: ["—", "Danışmanlık", "Ücretsiz"] },
  { label: "Destek hattı", values: ["E-posta", "Öncelikli", "7/24 öncelikli"] },
  { label: "Acil ampul değişimi", values: [false, false, true] },
] as const;

const faqs = [
  {
    question: "Işık Kulübü aboneliğini nasıl iptal ederim?",
    answer:
      "Hesabınızdaki 'Aboneliğim' bölümünden ya da destek ekibimize yazarak tek tıkla iptal edebilirsiniz. Taahhüt yoktur; iptal ettiğiniz ayın kalanında kargo süreçleri tamamlanır, sonraki aylarda ücret alınmaz.",
  },
  {
    question: "Abonelik kapsamındaki ampuller birikir mi?",
    answer:
      "Evet. Aylık ampul hakkınız kullanılmadığında bir sonraki aya devreder; toplam 6 aya kadar biriktirebilirsiniz. Birikmiş hakkınızı tek seferde farklı duy tipleriyle de kullanabilirsiniz.",
  },
  {
    question: "Bayi fiyatlarından yararlanmak için ne gerekiyor?",
    answer:
      "Vergi levhası ve faaliyet belgesi ile başvurmanız yeterli. Onay sonrası dijital bayi paneliniz açılır; siparişlerinizi panelden verebilir, fatura ve sevkiyatları takip edebilirsiniz. Yıllık minimum alım taahhüdü paketlere göre değişir.",
  },
  {
    question: "Ürün fiyatlarına KDV dahil mi?",
    answer:
      "Listede yer alan tüm fiyatlar KDV dahildir ve Türk lirası cinsindendir. Toptan alımlarda özel fiyat teklifi KDV hariç düzenlenir; fatura üzerinde ayrıca gösterilir.",
  },
  {
    question: "Kurumsal projelerde ödeme koşulları nedir?",
    answer:
      "75.000 ₺ üzeri yıllık alım taahhüdünde 60 güne kadar vade imkânı sunulur. Proje bazlı işlerde iş avansı ve hakediş planı sözleşmeyle belirlenir. Detaylar için kurumsal satış ekibimizle görüşebilirsiniz.",
  },
  {
    question: "Fiyatlar ne zaman güncellenir?",
    answer:
      "Kampanya fiyatları ay sonuna kadar geçerlidir. Hammadde kaynaklı zorunlu güncellemelerde mevcut abonelere en az 30 gün önce bilgilendirme yapılır ve o dönem için fiyat koruması uygulanır.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/[0.07]">
        <div
          className="absolute inset-0 -z-10 grid-lines opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          aria-hidden="true"
        />
        <div
          className="absolute -left-24 -top-32 -z-10 size-[420px] rounded-full halo blur-2xl"
          aria-hidden="true"
        />
        <div className="container-x py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink/40">
            <Link href="/" className="hover:text-ink">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-ink/70">Fiyatlandırma</span>
          </nav>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-end">
            <div>
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand-500" />
                Şeffaf fiyatlar
              </span>
              <h1 className="mt-3 max-w-[650px] font-display text-[38px] font-bold leading-[0.98] tracking-[-0.03em] sm:text-[52px]">
                Aydınlatma bütçeniz,
                <br />
                <span className="text-brand-600">sürprizsiz.</span>
              </h1>
              <p className="mt-4 max-w-[540px] text-[13px] leading-relaxed text-ink/55 sm:text-[14px]">
                Tek ampulden kurumsal projeye kadar her ölçek için net fiyatlar.
                Gizli ücret yok, taahhüt yok; ihtiyacınız değiştiğinde plan da
                değişir.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <span className="chip">KDV dahil</span>
              <span className="chip">Taahhütsüz abonelik</span>
              <span className="chip">14 gün iade</span>
              <span className="chip">%38&apos;e varan bayi iskontosu</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container-x">
          <PricingTabs />
          <p className="mt-6 flex items-start gap-2 text-[10px] leading-relaxed text-ink/40">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Fiyatlar Ekim 2026 itibarıyladır. Abonelik planları aylık veya yıllık
            ödenebilir; yıllık ödemede 2 ay hediye uygulanır. Bayi fiyatları
            vergi levhası ve sözleşme onayı sonrası geçerlidir.
          </p>
        </div>
      </section>

      <section id="urun-fiyatlari" className="scroll-mt-24 border-t border-ink/[0.07] py-12 sm:py-16">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand-500" />
                Tek ürün fiyatları
              </span>
              <h2 className="mt-3 font-display text-[30px] font-semibold leading-tight sm:text-[38px]">
                Tüm katalog, tek listede.
              </h2>
              <p className="mt-2 max-w-[560px] text-[12.5px] leading-relaxed text-ink/50">
                Ampulleri tek tek veya abonelikle satın alabilirsiniz. 50 adet üzeri
                siparişlerde otomatik toptan indirimi uygulanır.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[10.5px] font-bold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Stoklar güncel
            </span>
          </div>

          <div className="mt-6">
            <PriceList />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <div className="flex flex-col gap-3">
            <span className="eyebrow">
              <span className="size-1.5 rounded-full bg-brand-500" />
              Profesyonel hizmetler
            </span>
            <h2 className="font-display text-[30px] font-semibold leading-tight sm:text-[38px]">
              Ürünün ötesinde hizmet.
            </h2>
          </div>

          <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {addOns.map((addon) => {
              const Icon =
                addOnIcons[addon.icon as keyof typeof addOnIcons] ?? Sparkles;
              return (
                <div
                  key={addon.title}
                  className="flex flex-col rounded-3xl border border-ink/[0.07] bg-white p-5 transition hover:border-ink/15 hover:shadow-card"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand/15">
                    <Icon className="size-[18px]" />
                  </span>
                  <h3 className="mt-4 font-display text-[16px] font-semibold leading-snug">
                    {addon.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[11px] leading-relaxed text-ink/50">
                    {addon.description}
                  </p>
                  <p className="mt-4 text-[12px] font-bold">{addon.price}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <div className="flex flex-col gap-3">
            <span className="eyebrow">
              <span className="size-1.5 rounded-full bg-brand-500" />
              Karşılaştırma
            </span>
            <h2 className="font-display text-[30px] font-semibold leading-tight sm:text-[38px]">
              Hangi plan bana uygun?
            </h2>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-ink/[0.08] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink/[0.07] bg-cream/70">
                    <th className="px-5 py-4 text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink/35">
                      Özellik
                    </th>
                    {subscriptionPlans.map((plan) => (
                      <th
                        key={plan.id}
                        className={`px-5 py-4 text-[12px] font-bold ${
                          plan.highlight ? "bg-brand/15" : ""
                        }`}
                      >
                        {plan.name}
                        {plan.highlight && (
                          <span className="ml-1.5 rounded-full bg-ink px-1.5 py-0.5 text-[7.5px] font-bold uppercase text-brand">
                            Popüler
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/[0.06]">
                  {comparison.map((row) => (
                    <tr key={row.label}>
                      <td className="px-5 py-3.5 text-[11.5px] text-ink/50">
                        {row.label}
                      </td>
                      {row.values.map((value, index) => (
                        <td
                          key={`${row.label}-${index}`}
                          className={`px-5 py-3.5 text-[11.5px] font-semibold ${
                            index === 1 ? "bg-brand/[0.07]" : ""
                          }`}
                        >
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="size-4 text-emerald-600" />
                            ) : (
                              <Minus className="size-4 text-ink/20" />
                            )
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="sss" className="scroll-mt-24 py-12 sm:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <span className="eyebrow">
              <span className="size-1.5 rounded-full bg-brand-500" />
              Sık sorulanlar
            </span>
            <h2 className="mt-3 font-display text-[30px] font-semibold leading-tight sm:text-[38px]">
              Fiyatlar hakkında merak edilenler.
            </h2>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink/50">
              Aradığınız cevabı bulamadıysanız kurumsal satış ekibimiz plan
              seçiminde size ücretsiz yardımcı olur.
            </p>
            <Link
              href="/iletisim?konu=satis"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[11.5px] font-bold text-white"
            >
              Satış ekibine yazın <ArrowRight className="size-4 text-brand" />
            </Link>
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="relative overflow-hidden rounded-[36px] bg-brand p-7 sm:p-10">
          <div
            className="absolute -right-10 -top-16 size-56 rounded-full border-[26px] border-white/25"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="max-w-[520px] font-display text-[26px] font-semibold leading-tight sm:text-[32px]">
                50+ adet alımda özel proje fiyatı ve ücretsiz keşif.
              </h2>
              <p className="mt-2 text-[12px] text-ink/60">
                Formu doldurun, 1 iş günü içinde size özel teklif hazırlayalım.
              </p>
            </div>
            <Link
              href="/iletisim?konu=proje"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12px] font-bold text-white"
            >
              Teklif al <ArrowRight className="size-4 text-brand" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
