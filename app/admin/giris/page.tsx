import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { LogoMark } from "@/components/logo";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Yönetici girişi",
  description: "Işık Holding yönetim paneline erişim.",
  robots: { index: false, follow: false },
};

const highlights = [
  {
    icon: BarChart3,
    title: "Canlı sipariş takibi",
    text: "Sipariş durumlarını tek tıkla güncelleyin.",
  },
  {
    icon: Mail,
    title: "Gelen mesajlar",
    text: "İletişim formu talepleri ve bülten listesi.",
  },
  {
    icon: ShieldCheck,
    title: "RLS + imzalı oturum",
    text: "Veriye yalnızca yetkili erişir.",
  },
];

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const params = await searchParams;
  const next =
    typeof params.next === "string" && params.next.startsWith("/admin")
      ? params.next
      : "/admin";

  return (
    <main className="relative min-h-screen overflow-hidden bg-cream px-4 py-10 sm:px-6">
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full halo blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 grid-lines opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[980px] flex-col justify-center">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11.5px] font-semibold text-ink/50 transition hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Siteye dön
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink/45">
            <Lock className="size-3" />
            Yönetici alanı
          </span>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-ink/[0.08] bg-white shadow-soft">
          <div className="grid lg:grid-cols-[1.05fr_1fr]">
            <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-8 text-white lg:flex">
              <div
                className="pointer-events-none absolute -left-16 top-1/3 size-72 rounded-full opacity-30 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,200,0,.95), transparent 70%)",
                }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-0 dot-grid opacity-[0.06]"
                aria-hidden="true"
              />

              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <LogoMark withGlow />
                  <div>
                    <p className="font-display text-[17px] font-bold leading-none">
                      Işık<span className="text-brand-300">Holding</span>
                    </p>
                    <p className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.24em] text-white/35">
                      Yönetim paneli
                    </p>
                  </div>
                </div>

                <h1 className="mt-9 font-display text-[32px] font-semibold leading-[1.05]">
                  Işığın
                  <br />
                  kontrol odası.
                </h1>
                <p className="mt-3 max-w-[300px] text-[12px] leading-relaxed text-white/45">
                  Siparişleri, müşteri mesajlarını ve bülten abonelerini tek
                  ekrandan yönetin.
                </p>

                <ul className="mt-7 space-y-3.5">
                  {highlights.map((item) => (
                    <li key={item.title} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.07]">
                        <item.icon className="size-3.5 text-brand-300" />
                      </span>
                      <span>
                        <span className="block text-[11.5px] font-semibold">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-white/35">
                          {item.text}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mt-8 rounded-2xl bg-white/[0.05] p-4">
                <p className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.16em] text-brand-300">
                  <Sparkles className="size-3" />
                  Yetkili kullanıcı
                </p>
                <p className="mt-1.5 text-[14px] font-semibold">Akif Işık</p>
                <p className="text-[10px] text-white/35">
                  Kurucu ortak · Tam yetki
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-9">
              <div className="lg:hidden">
                <div className="flex items-center gap-2.5">
                  <LogoMark />
                  <div>
                    <p className="font-display text-[16px] font-bold leading-none">
                      Işık<span className="text-brand-600">Holding</span>
                    </p>
                    <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.22em] text-ink/35">
                      Yönetim paneli
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:mt-0">
                <h2 className="font-display text-[26px] font-semibold leading-tight">
                  Tekrar hoş geldiniz.
                </h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink/45">
                  Devam etmek için yönetici hesabınızla giriş yapın.
                </p>
              </div>

              <div className="mt-6">
                <LoginForm next={next} />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] text-ink/35">
          © {new Date().getFullYear()} Işık Holding A.Ş. · Bu alandaki tüm
          işlemler kayıt altına alınır.
        </p>
      </div>
    </main>
  );
}
