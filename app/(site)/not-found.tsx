import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 grid-lines opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <div className="relative">
          <div
            className="absolute inset-0 -z-10 rounded-full halo blur-2xl"
            aria-hidden="true"
          />
          <p className="font-display text-[96px] font-bold leading-none tracking-[-0.06em] text-ink sm:text-[140px]">
            4<span className="text-brand-500">0</span>4
          </p>
        </div>
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/50">
          <Search className="size-3" /> Sayfa bulunamadı
        </span>
        <h1 className="mt-5 max-w-[560px] font-display text-[30px] font-semibold leading-tight sm:text-[38px]">
          Bu ampul yanmıyor gibi görünüyor.
        </h1>
        <p className="mt-3 max-w-[440px] text-[13px] leading-relaxed text-ink/50">
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Işığı yeniden
          bulmak için aşağıdaki bağlantılardan devam edebilirsiniz.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Link href="/" className="btn-primary">
            <ArrowLeft className="size-4" /> Anasayfaya dön
          </Link>
          <Link href="/urunler" className="btn-outline">
            Ürünlere göz at <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-ink/40">
          <Link href="/haberler" className="hover:text-ink">
            Haberler
          </Link>
          <Link href="/fiyatlandirma" className="hover:text-ink">
            Fiyatlandırma
          </Link>
          <Link href="/hakkimizda" className="hover:text-ink">
            Hakkımızda
          </Link>
          <Link href="/iletisim" className="hover:text-ink">
            İletişim
          </Link>
        </div>
      </div>
    </section>
  );
}
