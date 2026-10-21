import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { Logo } from "@/components/logo";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Yönetim paneli",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/giris");

  const initials = session.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toLocaleUpperCase("tr-TR");

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-ink/[0.07] bg-white/85 backdrop-blur">
        <div className="container-x flex h-[68px] items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Işık Holding anasayfa">
              <Logo />
            </Link>
            <span className="hidden h-6 w-px bg-ink/10 sm:block" />
            <span className="hidden items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-brand sm:inline-flex">
              <ShieldCheck className="size-3" />
              Yönetim
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-ink/12 px-3.5 py-2 text-[11px] font-semibold text-ink/60 transition hover:border-ink/30 hover:text-ink sm:inline-flex"
            >
              Siteyi görüntüle
              <ArrowUpRight className="size-3.5" />
            </Link>

            <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1 pl-1 pr-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-brand font-display text-[10px] font-bold text-ink">
                {initials}
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-[10.5px] font-bold">
                  {session.name}
                </span>
                <span className="block text-[8.5px] uppercase tracking-wider text-ink/35">
                  Yönetici
                </span>
              </span>
              <LogoutButton compact className="!size-7 !border-0" />
            </div>
          </div>
        </div>
      </header>

      <main className="container-x py-7 sm:py-9">{children}</main>

      <footer className="container-x pb-8">
        <p className="border-t border-ink/[0.07] pt-5 text-center text-[10px] text-ink/30">
          Işık Holding yönetim paneli · Oturum {session.name} adına açık ·
          İşlemler kayıt altına alınır.
        </p>
      </footer>
    </div>
  );
}
