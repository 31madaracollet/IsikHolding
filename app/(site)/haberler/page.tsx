import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Megaphone,
  Radio,
  Rss,
  Sparkles,
} from "lucide-react";
import { NewsFeed } from "@/components/news-feed";
import { NewsTicker } from "@/components/news-ticker";
import { NewsletterForm } from "@/components/newsletter-form";
import { getNews, companyUpdates } from "@/lib/news";
import { formatDate } from "@/lib/utils";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Haberler · Enerji, teknoloji ve sektör gündemi",
  description:
    "Enerji Günlüğü, Webrazzi, Donanım Haber ve Anadolu Ajansı'ndan aydınlatma ve enerji haberleri; Işık Holding duyurularıyla harmanlanmış canlı akış.",
  alternates: { canonical: "/haberler" },
};

const sources = [
  { name: "Webrazzi", url: "https://webrazzi.com/", area: "Teknoloji & girişim" },
  { name: "Enerji Günlüğü", url: "https://www.enerjigunlugu.net/", area: "Enerji" },
  { name: "Donanım Haber", url: "https://www.donanimhaber.com/", area: "Teknoloji" },
  { name: "Anadolu Ajansı", url: "https://www.aa.com.tr/tr", area: "Ekonomi" },
];

export default async function NewsPage() {
  const { items, live } = await getNews();
  const latest = items[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/[0.07]">
        <div
          className="absolute inset-0 -z-10 grid-lines opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-20 -top-24 -z-10 size-[420px] rounded-full halo blur-2xl"
          aria-hidden="true"
        />

        <div className="container-x py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink/40">
            <Link href="/" className="hover:text-ink">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-ink/70">Haberler</span>
          </nav>

          <div className="mt-6 grid gap-7 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-brand">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                {live ? "Canlı akış" : "Editoryal akış"}
              </span>
              <h1 className="mt-4 max-w-[640px] font-display text-[40px] font-bold leading-[0.96] tracking-[-0.035em] sm:text-[56px]">
                Işık
                <span className="text-brand-600"> gündem.</span>
              </h1>
              <p className="mt-4 max-w-[540px] text-[13px] leading-relaxed text-ink/55 sm:text-[14px]">
                Enerji, teknoloji ve sektörden son dakika haberleri; araya
                serpiştirilmiş Işık Holding duyurularıyla. Kaynaklar RSS
                üzerinden otomatik beslenir.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-ink/45">
                <span className="flex items-center gap-1.5">
                  <Rss className="size-3.5 text-brand-600" /> {sources.length} kaynak
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-3.5 text-brand-600" /> 15 dakikada bir
                  güncellenir
                </span>
                <span className="flex items-center gap-1.5">
                  <Radio className="size-3.5 text-brand-600" /> {items.length} haber
                  akışta
                </span>
              </div>
            </div>

            {latest && (
              <a
                href={latest.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="group rounded-3xl border border-ink/[0.08] bg-white p-5 transition hover:border-ink/20 hover:shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-brand px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider">
                    Son eklenen
                  </span>
                  <ArrowUpRight className="size-4 text-ink/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </div>
                <p className="mt-3 line-clamp-2 font-display text-[16px] font-semibold leading-snug">
                  {latest.title}
                </p>
                <p className="mt-2 text-[10px] text-ink/35">
                  {latest.source} · {formatDate(latest.publishedAt)}
                </p>
              </a>
            )}
          </div>

          <div className="mt-7">
            <NewsTicker items={items} />
          </div>
        </div>
      </section>

      <section id="duyurular" className="scroll-mt-24 py-10 sm:py-12">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand-500" />
                Işık&apos;tan
              </span>
              <h2 className="mt-2 font-display text-[26px] font-semibold sm:text-[32px]">
                Kurumsal duyurular
              </h2>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-ink/40">
              <Megaphone className="size-3.5" />
              {companyUpdates.length} duyuru · kurumsal editör ekibi
            </span>
          </div>

          <div className="mt-5 grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
            {companyUpdates.slice(0, 3).map((update, index) => (
              <Link
                key={update.id}
                href={update.href}
                className={`group flex flex-col rounded-3xl border p-5 transition hover:-translate-y-1 ${
                  index === 0
                    ? "border-ink bg-ink text-white"
                    : "border-ink/[0.08] bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider ${
                      index === 0 ? "bg-brand text-ink" : "bg-brand-100 text-ink"
                    }`}
                  >
                    {update.tag}
                  </span>
                  <span
                    className={`text-[9.5px] ${
                      index === 0 ? "text-white/35" : "text-ink/30"
                    }`}
                  >
                    {formatDate(update.date)}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-[16px] font-semibold leading-snug">
                  {update.title}
                </h3>
                <p
                  className={`mt-2 line-clamp-2 flex-1 text-[11px] leading-relaxed ${
                    index === 0 ? "text-white/50" : "text-ink/45"
                  }`}
                >
                  {update.excerpt}
                </p>
                <span
                  className={`mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold ${
                    index === 0 ? "text-brand-300" : "text-ink/60"
                  }`}
                >
                  Devamını oku
                  <ArrowUpRight className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-3.5 grid gap-3.5 md:grid-cols-2">
            {companyUpdates.slice(3).map((update) => (
              <Link
                key={update.id}
                href={update.href}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-ink/[0.07] bg-white px-5 py-4 transition hover:border-ink/20"
              >
                <div>
                  <span className="text-[8.5px] font-bold uppercase tracking-wider text-brand-700">
                    {update.tag} · {formatDate(update.date)}
                  </span>
                  <p className="mt-1 text-[12px] font-semibold leading-snug">
                    {update.title}
                  </p>
                </div>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream transition group-hover:bg-brand">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/[0.07] py-10 sm:py-12">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-10">
          <div>
            <h2 className="font-display text-[26px] font-semibold sm:text-[32px]">
              Haber akışı
            </h2>
            <p className="mb-5 mt-1.5 text-[12px] text-ink/45">
              Kaynağa gitmek için habere tıklayın. Akış her 15 dakikada yenilenir.
            </p>
            <NewsFeed items={items} />
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-ink p-5 text-white">
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-300">
                <Rss className="size-3.5" /> Kaynaklar
              </span>
              <ul className="mt-3 divide-y divide-white/[0.07]">
                {sources.map((source) => (
                  <li key={source.name}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center justify-between gap-2 py-2.5 text-[11px] font-semibold text-white/70 transition hover:text-brand-300"
                    >
                      <span>
                        {source.name}
                        <span className="block text-[9px] font-normal text-white/30">
                          {source.area}
                        </span>
                      </span>
                      <ArrowUpRight className="size-3 text-white/20" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 rounded-xl bg-white/[0.04] p-3 text-[9.5px] leading-relaxed text-white/35">
                Haber başlıkları ve özetleri ilgili yayın organlarına aittir.
                Işık Holding içerikleri değiştirmez, kaynağa bağlantı verir.
              </p>
            </div>

            <div className="rounded-3xl border border-ink/[0.08] bg-white p-5">
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-ink/40">
                <Sparkles className="size-3.5 text-brand-600" /> API
              </span>
              <p className="mt-2 font-display text-[15px] font-semibold">
                Haber akışına programatik erişim
              </p>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink/45">
                Aynı akışı JSON olarak kullanmak ister misiniz? Uç nokta herkese
                açıktır.
              </p>
              <code className="mt-3 block rounded-xl bg-cream px-3 py-2 text-[10px] font-semibold text-ink/60">
                GET /api/news
              </code>
            </div>

            <div className="rounded-3xl bg-brand p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-ink/45">
                Kaçırmayın
              </p>
              <p className="mt-1.5 font-display text-[16px] font-semibold leading-snug">
                Haftalık enerji özeti e-postanızda.
              </p>
              <NewsletterForm variant="light" source="news-page" className="mt-3" />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
