import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Store,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim · Bize ulaşın",
  description:
    "Işık Holding iletişim bilgileri: 0212 909 40 40, merhaba@isikholding.com, Maslak deneyim mağazası ve departman e-postaları. 1 iş günü içinde dönüş garantisi.",
  alternates: { canonical: "/iletisim" },
};

const subjectByQuery: Record<
  string,
  | "Genel bilgi"
  | "Satış & sipariş"
  | "Toptan & bayilik"
  | "Proje danışmanlığı"
  | "Teknik destek"
  | "Kariyer"
> = {
  satis: "Satış & sipariş",
  siparis: "Satış & sipariş",
  toptan: "Toptan & bayilik",
  bayi: "Toptan & bayilik",
  proje: "Proje danışmanlığı",
  destek: "Teknik destek",
  kariyer: "Kariyer",
};

const planNames: Record<string, string> = {
  mini: "Mini",
  smart: "Smart",
  pro: "Home Pro",
};

const quickContacts = [
  {
    icon: Phone,
    title: "Çağrı merkezi",
    value: site.phone,
    href: `tel:${site.phoneHref}`,
    note: "Hafta içi 09.00 – 18.30",
  },
  {
    icon: Mail,
    title: "E-posta",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "En geç 1 iş günü içinde dönüş",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp destek",
    value: "Hızlı yanıt hattı",
    href: "https://wa.me/902129094040",
    note: "Görsel ve ürün fotoğrafı gönderin",
  },
  {
    icon: Store,
    title: "Deneyim mağazası",
    value: "Maslak, İstanbul",
    href: "https://www.google.com/maps/search/?api=1&query=Maslak+Mahallesi+Sar%C4%B1yer+%C4%B0stanbul",
    note: "Işık sıcaklığı test alanı",
  },
];

const departments = [
  {
    title: "Satış & sipariş",
    email: "satis@isikholding.com",
    description: "Sipariş, ürün stoğu, fatura ve teslimat soruları.",
  },
  {
    title: "Teknik destek",
    email: "destek@isikholding.com",
    description: "Kurulum, arıza, garanti ve uyumluluk desteği.",
  },
  {
    title: "Proje & Toptan",
    email: "proje@isikholding.com",
    description: "Bayilik, proje keşfi ve özel üretim talepleri.",
  },
  {
    title: "Basın & iş birlikleri",
    email: "basin@isikholding.com",
    description: "Marka iş birlikleri, basın kiti ve sponsorluk.",
  },
];

const faqs = [
  {
    question: "Ortalama yanıt süreniz ne kadar?",
    answer:
      "Form ve e-posta taleplerine 1 iş günü içinde, çağrı merkezi ve WhatsApp üzerinden gelen taleplere çalışma saatleri içinde ortalama 15 dakikada yanıt veriyoruz.",
  },
  {
    question: "Siparişimde değişiklik yapabilir miyim?",
    answer:
      "Siparişiniz kargoya hazırlanmadıysa adet, adres veya ürün değişikliği yapabiliriz. Sipariş numaranızla birlikte bize yazmanız yeterli. Kargoya verildikten sonra değişiklik için iade süreci işlemeye başlar.",
  },
  {
    question: "Mağazada ürünleri görebilir miyim?",
    answer:
      "Evet. Maslak Deneyim Mağazamızda tüm ürün ailelerini çalışır halde test edebilir, ışık sıcaklığı ve akıllı sistem demolarını görebilirsiniz. Randevu gerekmez.",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ konu?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const defaultSubject = subjectByQuery[params.konu ?? ""] ?? "Genel bilgi";
  const plan = params.plan ? planNames[params.plan] : null;

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
            <span className="text-ink/70">İletişim</span>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand-500" />
                İletişim
              </span>
              <h1 className="mt-3 max-w-[640px] font-display text-[40px] font-bold leading-[0.97] tracking-[-0.035em] sm:text-[54px]">
                Bir ampul kadar
                <br />
                <span className="text-brand-600">yakınınızdayız.</span>
              </h1>
              <p className="mt-4 max-w-[520px] text-[13px] leading-relaxed text-ink/55 sm:text-[14px]">
                Ürün seçiminden proje teklifine, sipariş takibinden teknik
                desteğe: doğru ekiple buluşmanız için buradayız.
              </p>
              {plan && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand/20 px-4 py-2 text-[11px] font-semibold">
                  <span className="flex size-4 items-center justify-center rounded-full bg-ink text-[8px] text-brand">
                    1
                  </span>
                  İlgilendiğiniz plan: <strong>{plan}</strong> · formun konusu
                  otomatik seçildi.
                </div>
              )}
            </div>

            <div className="rounded-[28px] bg-ink p-6 text-white">
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-300">
                <Headphones className="size-3.5" />
                Hızlı destek
              </div>
              <p className="mt-3 font-display text-[21px] font-semibold leading-snug">
                Uzman ekibimiz
                <br />
                15 dakikada yanıtlıyor.
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-white/45">
                Sipariş, garanti veya ürün uyumluluğu — hangi konu olursa olsun
                doğru kişiye yönlendiriyoruz.
              </p>
              <a
                href={`tel:${site.phoneHref}`}
                className="mt-4 flex items-center justify-between rounded-2xl bg-white/[0.07] px-4 py-3 transition hover:bg-white/[0.12]"
              >
                <span>
                  <span className="block text-[8.5px] uppercase tracking-wider text-white/35">
                    Hemen ara
                  </span>
                  <span className="text-[15px] font-bold">{site.phone}</span>
                </span>
                <Phone className="size-4 text-brand" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="container-x grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickContacts.map((contact) => (
            <a
              key={contact.title}
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noreferrer noopener" : undefined}
              className="group flex flex-col rounded-3xl border border-ink/[0.07] bg-white p-5 transition hover:-translate-y-1 hover:border-ink/15 hover:shadow-card"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand/15 transition group-hover:bg-brand">
                  <contact.icon className="size-[18px]" />
                </span>
                <ArrowUpRight className="size-3.5 text-ink/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
              </div>
              <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-ink/35">
                {contact.title}
              </p>
              <p className="mt-1 text-[13px] font-bold leading-tight">
                {contact.value}
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-ink/40">
                {contact.note}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="py-6 sm:py-10">
        <div className="container-x grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <ContactForm defaultSubject={defaultSubject} />

          <aside className="space-y-4 lg:sticky lg:top-[94px]">
            <div className="overflow-hidden rounded-3xl border border-ink/[0.08] bg-white">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EBD9]">
                <svg
                  viewBox="0 0 400 300"
                  className="absolute inset-0 size-full"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M-20 210 C 80 190, 120 120, 220 140 S 340 80, 420 60"
                    stroke="#FFFFFF"
                    strokeWidth="26"
                    fill="none"
                  />
                  <path
                    d="M-20 210 C 80 190, 120 120, 220 140 S 340 80, 420 60"
                    stroke="#E7DCC2"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    fill="none"
                  />
                  <path
                    d="M140 -20 C 150 60, 190 100, 180 160 S 200 240, 230 320"
                    stroke="#FFFFFF"
                    strokeWidth="18"
                    fill="none"
                  />
                  <path
                    d="M20 100 L 120 90 L 130 150 L 30 160 Z"
                    fill="#E9DFC8"
                  />
                  <path
                    d="M250 190 L 340 180 L 350 250 L 260 260 Z"
                    fill="#E9DFC8"
                  />
                  <path
                    d="M290 20 L 380 14 L 386 70 L 296 76 Z"
                    fill="#E9DFC8"
                  />
                </svg>
                <span className="absolute left-[16%] top-[24%] rounded-full bg-white/80 px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-ink/40">
                  Maslak
                </span>
                <span className="absolute bottom-[24%] right-[16%] rounded-full bg-white/80 px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-ink/40">
                  Aydınlık Cd.
                </span>
                <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute -inset-4 animate-ping rounded-full bg-brand/30" />
                  <span className="relative flex size-10 items-center justify-center rounded-full border-4 border-white bg-ink text-brand shadow-lg">
                    <MapPin className="size-4" />
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 rounded-xl bg-white/90 px-3 py-2 backdrop-blur">
                  <p className="text-[8px] font-bold uppercase tracking-wider text-ink/35">
                    Işık Holding
                  </p>
                  <p className="text-[10.5px] font-semibold">Deneyim Mağazası</p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" />
                  <p className="text-[12px] leading-relaxed text-ink/60">
                    {site.address}
                  </p>
                </div>
                <div className="mt-2.5 flex items-start gap-2.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-brand-600" />
                  <p className="text-[11px] leading-relaxed text-ink/50">
                    {site.workingHours}
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Maslak+Mahallesi+Sar%C4%B1yer+%C4%B0stanbul"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[10.5px] font-bold text-white transition hover:bg-ink-soft"
                >
                  Yol tarifi al <ArrowUpRight className="size-3.5 text-brand" />
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-brand p-5">
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/50">
                <Send className="size-3.5" /> Bir tıkla ulaşın
              </div>
              <p className="mt-2 font-display text-[16px] font-semibold leading-snug">
                Ürün fotoğrafını gönderin,
                <br />
                doğru ampulü birlikte bulalım.
              </p>
              <a
                href="https://wa.me/902129094040"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[10.5px] font-bold text-brand"
              >
                <MessageCircle className="size-3.5" />
                WhatsApp&apos;tan yaz
              </a>
            </div>

            <div className="rounded-3xl border border-ink/[0.08] bg-white p-5">
              <h3 className="font-display text-[14px] font-semibold">
                Departmanlar
              </h3>
              <ul className="mt-2 divide-y divide-ink/[0.06]">
                {departments.map((department) => (
                  <li key={department.title} className="py-2.5">
                    <a
                      href={`mailto:${department.email}`}
                      className="group flex items-start justify-between gap-2"
                    >
                      <span>
                        <span className="block text-[11px] font-semibold group-hover:text-ink/60">
                          {department.title}
                        </span>
                        <span className="mt-0.5 block text-[9.5px] leading-relaxed text-ink/35">
                          {department.description}
                        </span>
                      </span>
                      <Mail className="mt-0.5 size-3.5 shrink-0 text-ink/25 group-hover:text-brand-600" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="eyebrow">
              <span className="size-1.5 rounded-full bg-brand-500" />
              İletişim SSS
            </span>
            <h2 className="mt-3 font-display text-[28px] font-semibold leading-tight sm:text-[34px]">
              Yazmadan önce
              <br />
              belki cevabı burada.
            </h2>
            <p className="mt-3 text-[12px] leading-relaxed text-ink/45">
              Daha fazla soru için{" "}
              <Link
                href="/fiyatlandirma#sss"
                className="font-semibold text-ink underline underline-offset-2"
              >
                fiyatlandırma SSS
              </Link>{" "}
              sayfamıza göz atabilirsiniz.
            </p>
          </div>
          <Faq items={faqs} />
        </div>
      </section>
    </>
  );
}
