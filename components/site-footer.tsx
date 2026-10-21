import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/brand-icons";
import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";

const corporateLinks = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Haberler", href: "/haberler" },
  { label: "Fiyatlandırma", href: "/fiyatlandirma" },
  { label: "Satış noktaları", href: "/hakkimizda#bayi" },
  { label: "Kariyer", href: "/iletisim?konu=kariyer" },
  { label: "Sürdürülebilirlik", href: "/hakkimizda#surdurulebilirlik" },
];

const supportLinks = [
  { label: "İletişim", href: "/iletisim" },
  { label: "Sipariş takibi", href: "/sepet" },
  { label: "Kargo & teslimat", href: "/politikalar#teslimat" },
  { label: "İade & değişim", href: "/politikalar#iade" },
  { label: "Garanti şartları", href: "/politikalar#garanti" },
  { label: "Sık sorulan sorular", href: "/fiyatlandirma#sss" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div
        className="pointer-events-none absolute -left-32 top-0 size-[420px] rounded-full opacity-30 blur-3xl halo"
        aria-hidden="true"
      />
      <div className="container-x relative">
        <div className="grid gap-8 border-b border-white/10 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <span className="eyebrow !text-brand-300">Işık Bülten</span>
            <h2 className="mt-3 max-w-[430px] font-display text-3xl font-semibold leading-[1.15] sm:text-[34px]">
              Yeni ürünler, enerji ipuçları ve kampanyalar e-postanızda.
            </h2>
          </div>
          <div className="lg:pl-10">
            <NewsletterForm source="footer" />
          </div>
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo tone="dark" />
            <p className="mt-5 max-w-[310px] text-[13px] leading-relaxed text-white/50">
              {site.description}
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {[
                { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
                { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
                { icon: GithubIcon, href: "https://github.com", label: "GitHub" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={item.label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/12 text-white/60 transition hover:border-brand hover:bg-brand hover:text-ink"
                >
                  <item.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Ürünler
            </h3>
            <ul className="mt-4 space-y-3 text-[13px] text-white/65">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/urunler?kategori=${category.slug}`}
                    className="inline-flex items-center gap-1 transition hover:text-brand-300"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/urunler"
                  className="inline-flex items-center gap-1 font-semibold text-brand-300 transition hover:text-brand-200"
                >
                  Tüm ürünler <ArrowUpRight className="size-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Kurumsal
            </h3>
            <ul className="mt-4 space-y-3 text-[13px] text-white/65">
              {corporateLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-brand-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Destek
            </h3>
            <ul className="mt-4 space-y-3 text-[13px] text-white/65">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-brand-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-3 text-[12.5px] text-white/55">
              <a
                href={`tel:${site.phoneHref}`}
                className="flex items-start gap-2.5 transition hover:text-white"
              >
                <Phone className="mt-0.5 size-3.5 shrink-0 text-brand-400" />
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-start gap-2.5 transition hover:text-white"
              >
                <Mail className="mt-0.5 size-3.5 shrink-0 text-brand-400" />
                {site.email}
              </a>
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-brand-400" />
                {site.address}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-[11px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/politikalar#kvkk" className="transition hover:text-white">
              KVKK
            </Link>
            <Link href="/politikalar#gizlilik" className="transition hover:text-white">
              Gizlilik
            </Link>
            <Link href="/politikalar#cerez" className="transition hover:text-white">
              Çerezler
            </Link>
            <Link href="/politikalar#mesafeli" className="transition hover:text-white">
              Mesafeli satış
            </Link>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Next.js + Supabase altyapısı
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
