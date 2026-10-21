export interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  unit?: string;
  badge?: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}

export const subscriptionPlans: Plan[] = [
  {
    id: "mini",
    name: "Mini",
    tagline: "Tek odalı evler ve öğrenci daireleri için temel yenileme.",
    monthly: 249,
    yearly: 2490,
    badge: "Başlangıç",
    features: [
      "Ayda 3 adet LED ampul (9W)",
      "Tüm siparişlerde %10 kulüp indirimi",
      "Ücretsiz kargo",
      "E-posta ile enerji ipuçları",
      "Ampul değişim rehberi",
    ],
    cta: "Mini ile başla",
    href: "/iletisim?konu=satis&plan=mini",
  },
  {
    id: "smart",
    name: "Smart",
    tagline: "Akıllı aydınlatmaya geçmek isteyenler için en dengeli paket.",
    monthly: 549,
    yearly: 5490,
    badge: "En çok tercih edilen",
    highlight: true,
    features: [
      "Ayda 6 adet LED ampul",
      "3 ayda 1 akıllı ampul",
      "Tüm siparişlerde %15 kulüp indirimi",
      "Ücretsiz kargo ve öncelikli destek",
      "Işık Home kurulum danışmanlığı",
      "Yılda 1 ücretsiz enerji analizi",
    ],
    cta: "Smart'a geç",
    href: "/iletisim?konu=satis&plan=smart",
  },
  {
    id: "pro",
    name: "Home Pro",
    tagline: "Geniş evler ve butik işletmeler için uçtan uca bakım.",
    monthly: 1149,
    yearly: 11490,
    badge: "Tam bakım",
    features: [
      "Ayda 12 adet LED ampul",
      "3 ayda 1 akıllı ampul + sensör",
      "Tüm siparişlerde %20 kulüp indirimi",
      "Ücretsiz keşif ve montaj desteği",
      "7/24 öncelikli teknik destek",
      "Yılda 2 enerji analizi raporu",
      "Acil ampul değişim hizmeti",
    ],
    cta: "Home Pro'yu seç",
    href: "/iletisim?konu=satis&plan=pro",
  },
];

export const wholesalePlans: Plan[] = [
  {
    id: "dealer-start",
    name: "Başlangıç Bayi",
    tagline: "İlk kez aydınlatma satışına başlayan işletmeler için.",
    monthly: 25000,
    yearly: 0,
    unit: "min. yıllık alım",
    badge: "%25 iskonto",
    features: [
      "Liste fiyatları üzerinden %25 iskonto",
      "25.000 ₺ minimum yıllık alım",
      "Dijital bayi paneli",
      "Ürün görseli ve teknik doküman arşivi",
      "Bölgesel kampanya desteği",
    ],
    cta: "Bayilik başvurusu",
    href: "/iletisim?konu=toptan",
  },
  {
    id: "dealer-growth",
    name: "Büyüyen Bayi",
    tagline: "Düzenli sipariş veren, stok tutan aktif satış noktaları.",
    monthly: 75000,
    yearly: 0,
    unit: "min. yıllık alım",
    badge: "%32 iskonto",
    highlight: true,
    features: [
      "Liste fiyatları üzerinden %32 iskonto",
      "75.000 ₺ minimum yıllık alım",
      "75.000 ₺'ye kadar vadeli ödeme",
      "Mağaza içi teşhir desteği",
      "Öncelikli üretim ve teslimat",
      "Yıllık ortak pazarlama bütçesi",
    ],
    cta: "Teklif al",
    href: "/iletisim?konu=toptan",
  },
  {
    id: "dealer-enterprise",
    name: "Kurumsal & Proje",
    tagline: "Zincir mağaza, otel ve büyük ölçekli proje ekipleri için.",
    monthly: 0,
    yearly: 0,
    unit: "özel fiyatlandırma",
    badge: "%38'e varan",
    features: [
      "%38'e varan proje iskontosu",
      "Özel üretim ve OEM imkânı",
      "Aydınlatma tasarımı ve simülasyon",
      "Proje bazlı tedarik takvimi",
      "Saha keşfi ve montaj desteği",
      "Özel müşteri yöneticisi",
    ],
    cta: "Proje görüşmesi",
    href: "/iletisim?konu=proje",
  },
];

export const addOns = [
  {
    title: "Işık tasarımı & simülasyon",
    price: "4.900 ₺'den",
    description:
      "Mekânınızın planı üzerinde lüks, renk sıcaklığı ve armatür yerleşimi simülasyonu; uygulama raporu dahil.",
    icon: "sparkles",
  },
  {
    title: "Profesyonel montaj",
    price: "2.400 ₺'den",
    description:
      "Sertifikalı ekip tarafından ampul, avize ve panel montajı. İstanbul içinde 48 saat içinde randevu.",
    icon: "wrench",
  },
  {
    title: "Akıllı ev entegrasyonu",
    price: "7.500 ₺'den",
    description:
      "Işık Home, Alexa, Google Asistan ve Matter uyumlu cihazların tek merkezden kurulumu ve eğitimi.",
    icon: "cpu",
  },
  {
    title: "Enerji verimliliği analizi",
    price: "Ücretsiz*",
    description:
      "Tesisinizin aydınlatma envanteri, tüketim analizi ve yatırım geri dönüş süresi raporu. 500 m² üzeri alanlarda ücretsiz.",
    icon: "gauge",
  },
];
