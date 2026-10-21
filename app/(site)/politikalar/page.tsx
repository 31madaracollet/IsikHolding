import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politikalar · KVKK, gizlilik, teslimat ve iade",
  description:
    "Işık Holding KVKK aydınlatma metni, gizlilik ve çerez politikası, mesafeli satış sözleşmesi, teslimat, iade ve garanti koşulları.",
  alternates: { canonical: "/politikalar" },
};

const sections = [
  {
    id: "kvkk",
    title: "KVKK aydınlatma metni",
    paragraphs: [
      "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu Işık Holding A.Ş.'dir. İletişim formu, sipariş ve bülten kayıtları üzerinden paylaştığınız ad, soyad, e-posta, telefon ve adres bilgileri; talebinizin değerlendirilmesi, siparişin teslim edilmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.",
      "Verileriniz; açık rızanıza veya sözleşmenin ifası hukuki sebebine dayanılarak işlenir, yasal süreler boyunca saklanır ve yalnızca kargo, ödeme ve altyapı hizmet sağlayıcılarıyla paylaşılır. Yurt dışına aktarım yapılması hâlinde Kanun'un 9. maddesindeki şartlar sağlanır.",
      "KVKK'nın 11. maddesi kapsamında verilerinize erişme, düzeltilmesini veya silinmesini isteme, işlemeye itiraz etme ve zararın giderilmesini talep etme haklarına sahipsiniz. Başvurularınızı kvkk@isikholding.com adresine iletebilirsiniz; talepler en geç 30 gün içinde yanıtlanır.",
    ],
  },
  {
    id: "gizlilik",
    title: "Gizlilik politikası",
    paragraphs: [
      "Sitemizi ziyaret ettiğinizde tarayıcınızın IP adresi, ziyaret ettiğiniz sayfalar, cihaz ve tarayıcı bilgisi gibi teknik veriler anonimleştirilerek istatistik amacıyla işlenebilir. Bu veriler kişisel kimliğinizle ilişkilendirilmez.",
      "Form verileri Supabase altyapısında, erişim yetkisi yalnızca sunucu tarafındaki servis anahtarında olacak şekilde saklanır. Ödeme kartı bilgileri sitemizde işlenmez ve saklanmaz; ödeme, sipariş onayından sonra güvenli ödeme sağlayıcısı üzerinden alınır.",
      "Verileriniz pazarlama amacıyla üçüncü taraflara satılmaz veya kiralanmaz. Bülten aboneliğinden her e-postanın altındaki bağlantıyla tek tıkla çıkabilirsiniz. İletişim: gizlilik@isikholding.com.",
    ],
  },
  {
    id: "cerez",
    title: "Çerez politikası",
    paragraphs: [
      "Sitemizde oturum yönetimi ve sepetin hatırlanması için zorunlu çerezler kullanılır. Bu çerezler, sepetinizin tarayıcıda saklanmasını ve formların güvenli çalışmasını sağlar; reddedilmeleri hâlinde sepet özelliği çalışmayabilir.",
      "Analitik ve pazarlama çerezleri yalnızca onayınızla etkinleştirilir. Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Üçüncü taraf hizmetlerin çerez tercihleri için ilgili sağlayıcının politikalarını inceleyebilirsiniz.",
      "Çerez tercihlerinizi dilediğiniz zaman tarayıcınızın gizlilik ayarlarından güncelleyebilirsiniz. Sorularınız için kvkk@isikholding.com adresine yazabilirsiniz.",
    ],
  },
  {
    id: "mesafeli",
    title: "Mesafeli satış sözleşmesi",
    paragraphs: [
      "Bu sözleşme, site üzerinden verilen siparişlerde satıcı Işık Holding A.Ş. ile alıcı arasında kurulur. Sipariş özetinde yer alan ürün, adet, fiyat ve teslimat bilgileri teklifin ayrılmaz parçasıdır.",
      "Alıcı, siparişi onaylamadan önce toplam bedeli, kargo ücretini ve teslimat adresini kontrol etmekle yükümlüdür. Ödeme, sipariş onayı sonrası iletilen güvenli bağlantı üzerinden yapılır; ödeme alınmadan sipariş kargoya verilmez.",
      "Teslimat, stok durumuna göre 1–3 iş günü içinde yapılır. Cayma hakkı, teslim tarihinden itibaren 14 gün içinde kullanılabilir. Uyuşmazlıklarda İstanbul Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.",
    ],
  },
  {
    id: "teslimat",
    title: "Kargo ve teslimat",
    paragraphs: [
      "500 ₺ ve üzeri siparişlerde kargo ücretsizdir. Bu tutarın altındaki siparişlerde 79 ₺ sabit kargo ücreti uygulanır. Aynı gün kargo için siparişin saat 16.00'dan önce verilmesi gerekir.",
      "Teslimatlar anlaşmalı kargo firmalarıyla hafta içi 09.00–18.00 arasında yapılır. Kargo takip numarası, sipariş kargoya verildiğinde e-posta ile paylaşılır. Teslimatta adreste bulunamamanız hâlinde ürün 3 iş günü şubede bekletilir.",
      "Büyük hacimli (panel, highbay, sarkıt) ürünlerde teslimat randevu ile planlanır. Montaj hizmeti ayrıca satın alınabilir; teslimat ücreti montaj hizmetine dahil değildir.",
    ],
  },
  {
    id: "iade",
    title: "İade ve değişim",
    paragraphs: [
      "Kullanılmamış ve orijinal ambalajı bozulmamış ürünleri teslim tarihinden itibaren 14 gün içinde iade edebilirsiniz. İade talebi için sipariş numaranızla destek@isikholding.com adresine yazmanız yeterlidir.",
      "Arızalı ürünlerde kargo ücreti Işık Holding'e aittir. Cayma hakkı kapsamındaki iadelerde kargo ücreti alıcıya aittir. Ürün bedeli, iade kontrolü tamamlandıktan sonra en geç 10 iş günü içinde ödeme yaptığınız yönteme iade edilir.",
      "Kişiye özel üretilen, ambalajı açılmış hijyen ürünleri ve montajı yapılmış armatürler cayma hakkı kapsamı dışındadır; arıza hâlinde garanti süreci işletilir.",
    ],
  },
  {
    id: "garanti",
    title: "Garanti koşulları",
    paragraphs: [
      "LED ampuller 2 yıl, Işık Pro serisi 5 yıl, solar ürünler 3 yıl, endüstriyel armatürler 5 yıl üretici garantisi kapsamındadır. Garanti süresi fatura tarihinden itibaren başlar.",
      "Garanti; üretim hatası, sürücü arızası ve erken ışık kaybı gibi ürün kaynaklı sorunları kapsar. Yanlış gerilim, düşme, sıvı teması, yetkisiz müdahale ve normal kullanım ömrünü tamamlamış ürünler garanti dışıdır.",
      "Garanti başvurusunda fatura ve ürün fotoğrafı talep edilir. Onaylanan ürünler 48 saat içinde değiştirilir; stokta bulunmaması hâlinde eşdeğer veya üst model sunulur.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <>
      <section className="border-b border-ink/[0.07]">
        <div className="container-x py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 text-[10.5px] font-medium text-ink/40">
            <Link href="/" className="hover:text-ink">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="text-ink/70">Politikalar</span>
          </nav>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">
                <span className="size-1.5 rounded-full bg-brand-500" />
                Yasal bilgiler
              </span>
              <h1 className="mt-3 font-display text-[36px] font-bold leading-tight tracking-tight sm:text-[48px]">
                Politikalar & koşullar
              </h1>
              <p className="mt-2 max-w-[560px] text-[12.5px] leading-relaxed text-ink/50">
                Kişisel verilerinizin nasıl işlendiği, teslimat süreleri, iade
                koşulları ve garanti kapsamı hakkında her şey.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[10px] font-semibold text-ink/45">
              <FileText className="size-3.5" />
              Son güncelleme: 1 Ekim 2026
            </span>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="container-x grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
          <aside className="lg:sticky lg:top-[94px] lg:self-start">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-ink/35">
              İçindekiler
            </p>
            <nav className="mt-3 flex flex-wrap gap-1.5 lg:flex-col">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-full px-3 py-2 text-[11px] font-semibold text-ink/50 transition hover:bg-white hover:text-ink lg:rounded-xl"
                >
                  {section.title.split(" ")[0]}
                </a>
              ))}
            </nav>
            <div className="mt-5 hidden rounded-2xl bg-brand p-4 lg:block">
              <ShieldCheck className="size-4" />
              <p className="mt-2 text-[11px] font-bold leading-snug">
                Sorunuz mu var?
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-1 block text-[9.5px] text-ink/55 underline underline-offset-2"
              >
                {site.email}
              </a>
            </div>
          </aside>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-3xl border border-ink/[0.07] bg-white p-6 sm:p-8"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-brand text-[9px] font-bold">
                    {index + 1}
                  </span>
                  <h2 className="font-display text-[20px] font-semibold sm:text-[24px]">
                    {section.title}
                  </h2>
                </div>
                <div className="mt-3 space-y-2.5">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="text-[12px] leading-[1.85] text-ink/55"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}

            <div className="rounded-3xl bg-ink p-6 text-white sm:p-8">
              <h2 className="font-display text-[20px] font-semibold">
                Bu metinler hakkında
              </h2>
              <p className="mt-2 text-[11.5px] leading-relaxed text-white/45">
                Bu sayfa bilgilendirme amaçlıdır ve hukuki danışmanlık yerine
                geçmez. Şirket bilgileri, iletişim kanalları ve hizmet koşulları
                güncellendiğinde metinler de yenilenir. Ticari kayıt bilgileri
                için bize ulaşabilirsiniz.
              </p>
              <Link
                href="/iletisim"
                className="mt-4 inline-flex rounded-full bg-brand px-4 py-2.5 text-[10.5px] font-bold text-ink"
              >
                İletişime geç
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
