import type { CompanyUpdate, NewsItem } from "@/lib/types";

/**
 * Canlı RSS kaynaklarına erişilemediğinde gösterilen editoryal demo akışı.
 * Kaynak bağlantıları ilgili yayın organlarının ana sayfalarına gider.
 */
export const fallbackNews: NewsItem[] = [
  {
    id: "haber-01",
    title: "Güneş enerjisinde kurulu güç yeni zirvede: 42 GW eşiği aşıldı",
    excerpt:
      "Yenilenebilir kurulu gücün toplam elektrik üretimindeki payı yüzde 25'i geçti. Sektör temsilcileri, çatı üstü sistemlerdeki ivmenin 2027'ye kadar süreceğini öngörüyor.",
    source: "Enerji Günlüğü",
    sourceUrl: "https://www.enerjigunlugu.net/",
    publishedAt: "2026-10-21T09:15:00+03:00",
    category: "Enerji",
    image: "/images/product-solar.jpg",
  },
  {
    id: "haber-02",
    title: "Akıllı ev pazarı Türkiye'de yüzde 24 büyüdü: Aydınlatma başı çekiyor",
    excerpt:
      "Tüketici araştırmalarına göre akıllı ev cihazları arasında en hızlı büyüyen kategori akıllı aydınlatma oldu. Uygulama üzerinden kontrol edilen ampullerin satışı bir yılda ikiye katlandı.",
    source: "Webrazzi",
    sourceUrl: "https://webrazzi.com/",
    publishedAt: "2026-10-21T07:40:00+03:00",
    category: "Teknoloji",
    image: "/images/product-smart.jpg",
  },
  {
    id: "haber-03",
    title: "Enerji verimliliği destek paketi genişledi: LED dönüşümüne ek teşvik",
    excerpt:
      "KOBİ'lere yönelik enerji verimliliği programına aydınlatma dönüşümü de eklendi. Yetkililer, yatırımın ortalama 18 ayda kendini amorti ettiğini belirtiyor.",
    source: "Anadolu Ajansı",
    sourceUrl: "https://www.aa.com.tr/tr",
    publishedAt: "2026-10-20T18:20:00+03:00",
    category: "Enerji",
    image: "/images/product-panel.jpg",
  },
  {
    id: "haber-04",
    title: "Matter 1.4 ile akıllı ampuller tek standartta buluşuyor",
    excerpt:
      "Yeni standart sürümü, farklı üreticilerin aydınlatma ürünlerinin tek uygulama üzerinden yönetilmesini kolaylaştırıyor. Kullanıcı deneyiminde birlikte çalışabilirlik dönemi başlıyor.",
    source: "Donanım Haber",
    sourceUrl: "https://www.donanimhaber.com/",
    publishedAt: "2026-10-20T11:05:00+03:00",
    category: "Teknoloji",
    image: "/images/product-smart.jpg",
  },
  {
    id: "haber-05",
    title: "Sanayide LED dönüşümü yatırımı kaç ayda geri dönüyor?",
    excerpt:
      "Enerji yoğun tesislerde aydınlatma kaynaklı tüketimin toplam elektrik kullanımındaki payı yüzde 15'e ulaşıyor. Dönüşüm projelerinde geri ödeme süresi 12–24 ay arasında hesaplanıyor.",
    source: "Dünya",
    sourceUrl: "https://www.dunya.com/",
    publishedAt: "2026-10-19T16:30:00+03:00",
    category: "Sektör",
    image: "/images/product-highbay.jpg",
  },
  {
    id: "haber-06",
    title: "Türkiye'nin enerji ithalatı geriledi, yenilenebilirin payı arttı",
    excerpt:
      "Yılın ilk dokuz ayında enerji ithalat faturası gerilerken, yerli ve yenilenebilir kaynakların üretimdeki ağırlığı arttı. Elektrik fiyatlarında uzun vadeli istikrar bekleniyor.",
    source: "Anadolu Ajansı",
    sourceUrl: "https://www.aa.com.tr/tr",
    publishedAt: "2026-10-19T09:10:00+03:00",
    category: "Ekonomi",
    image: "/images/product-solar.jpg",
  },
  {
    id: "haber-07",
    title: "Yapay zekâ destekli bina yönetimi: Aydınlatma kendi kendine karar veriyor",
    excerpt:
      "Sensör verilerini öğrenen yeni nesil bina yönetim sistemleri, doluluk oranına göre ışık seviyesini otomatik ayarlıyor. Pilot projelerde yüzde 30'a varan tasarruf raporlandı.",
    source: "Webrazzi",
    sourceUrl: "https://webrazzi.com/",
    publishedAt: "2026-10-18T14:45:00+03:00",
    category: "Teknoloji",
    image: "/images/product-panel.jpg",
  },
  {
    id: "haber-08",
    title: "Aydınlatma sektörü 2027'ye akıllı sistemler odağıyla hazırlanıyor",
    excerpt:
      "Üreticiler ürün yol haritalarını sensör entegrasyonu ve enerji izleme özellikleri üzerine kuruyor. Perakendede kurulum hizmeti sunan markaların payı hızla artıyor.",
    source: "Dünya",
    sourceUrl: "https://www.dunya.com/",
    publishedAt: "2026-10-18T10:20:00+03:00",
    category: "Sektör",
    image: "/images/product-panel.jpg",
  },
  {
    id: "haber-09",
    title: "EPDK'dan sanayi tüketicilerine yeni tarife düzenlemesi",
    excerpt:
      "Elektrik tarifelerinde verimlilik teşvikleri öne çıkıyor. Enerji yoğun işletmeler için tüketim planlaması ve aydınlatma optimizasyonu daha kritik hale geliyor.",
    source: "Enerji Günlüğü",
    sourceUrl: "https://www.enerjigunlugu.net/",
    publishedAt: "2026-10-17T17:10:00+03:00",
    category: "Ekonomi",
    image: "/images/product-panel.jpg",
  },
  {
    id: "haber-10",
    title: "OLED aydınlatmada yeni nesil esnek paneller tanıtıldı",
    excerpt:
      "Kıvrılabilir OLED paneller, mimari aydınlatmada yeni tasarım olanakları sunuyor. İlk ticari örneklerin önümüzdeki yıl mağaza ve otel projelerinde görülmesi bekleniyor.",
    source: "Donanım Haber",
    sourceUrl: "https://www.donanimhaber.com/",
    publishedAt: "2026-10-17T09:00:00+03:00",
    category: "Teknoloji",
    image: "/images/product-pendant.jpg",
  },
  {
    id: "haber-11",
    title: "Bakır fiyatlarındaki artış elektrik malzemeleri maliyetlerini baskılıyor",
    excerpt:
      "Kablo ve bağlantı elemanlarında hammadde maliyeti yükseliyor. Üreticiler, verimlilik odaklı ürünlerle fiyat istikrarını korumaya çalışıyor.",
    source: "Ekonomim",
    sourceUrl: "https://www.ekonomim.com/",
    publishedAt: "2026-10-16T13:25:00+03:00",
    category: "Ekonomi",
    image: "/images/product-strip.jpg",
  },
  {
    id: "haber-12",
    title: "Toptan aydınlatma kanalı büyüyor: Bayi ağı yatırımları hızlandı",
    excerpt:
      "Bölgesel bayiler, teknik destek ve hızlı teslimatla rekabette fark yaratıyor. Üreticiler stok yönetimini dijitalleştirerek tedarik süresini kısaltıyor.",
    source: "Dünya",
    sourceUrl: "https://www.dunya.com/",
    publishedAt: "2026-10-16T08:40:00+03:00",
    category: "Sektör",
    image: "/images/product-panel.jpg",
  },
  {
    id: "haber-13",
    title: "Wi-Fi 7 ve Thread destekli aydınlatma ürünleri raflarda",
    excerpt:
      "Yeni bağlantı teknolojileri, akıllı ev cihazlarında gecikmeyi azaltıyor. Aydınlatma üreticileri ürün ailesini Matter uyumlu hale getirmeye devam ediyor.",
    source: "Donanım Haber",
    sourceUrl: "https://www.donanimhaber.com/",
    publishedAt: "2026-10-15T15:15:00+03:00",
    category: "Teknoloji",
    image: "/images/product-smart.jpg",
  },
  {
    id: "haber-14",
    title: "E-ticarette elektrikli ev aletleri kategorisi çift haneli büyüdü",
    excerpt:
      "Online kanallarda aydınlatma ve küçük elektrikli ürünlere ilgi artıyor. Tüketiciler, enerji etiketi ve garanti süresini satın alma kararında ilk sıralara taşıdı.",
    source: "Webrazzi",
    sourceUrl: "https://webrazzi.com/",
    publishedAt: "2026-10-15T10:30:00+03:00",
    category: "Sektör",
    image: "/images/product-led.jpg",
  },
];

export const companyUpdates: CompanyUpdate[] = [
  {
    id: "duyuru-01",
    title: "Işık Smart ailesi yenilendi: Matter uyumlu yeni nesil ampuller satışta",
    excerpt:
      "Daha hızlı bağlantı, düşük gecikme ve tek uygulamada tam kontrol. Yeni Işık Smart RGBW, ilk siparişlerde %22 avantajlı.",
    href: "/urunler/isik-smart-rgbw",
    date: "2026-10-21T08:30:00+03:00",
    tag: "Ürün lansmanı",
  },
  {
    id: "duyuru-02",
    title: "Işık Kulübü ile ampul aboneliği başladı: Eskisi bitmeden yenisi kapıda",
    excerpt:
      "Aylık sabit ücretle ihtiyacın kadar ampul, ücretsiz kurulum danışmanlığı ve kulüp üyelerine özel fiyatlar.",
    href: "/fiyatlandirma",
    date: "2026-10-20T12:00:00+03:00",
    tag: "Kulüp",
  },
  {
    id: "duyuru-03",
    title: "Maslak Deneyim Mağazası kapılarını açtı",
    excerpt:
      "Yeni mağazamızda ışık sıcaklığı deneyim alanı, proje danışma masası ve hızlı teslimat noktası sizi bekliyor.",
    href: "/iletisim",
    date: "2026-10-19T10:00:00+03:00",
    tag: "Perakende",
  },
  {
    id: "duyuru-04",
    title: "SolarProjektör serisinin garantisi 3 yıla çıktı",
    excerpt:
      "Dış mekân ürün ailesinde panel ve batarya garantisini 3 yıla yükselttik. Kurulumdan sonra da yanınızdayız.",
    href: "/urunler/solar-projektor-100w",
    date: "2026-10-17T09:00:00+03:00",
    tag: "Garanti",
  },
  {
    id: "duyuru-05",
    title: "Bayi ağımız 450 satış noktasına ulaştı",
    excerpt:
      "Anadolu'nun dört bir yanındaki yeni iş ortaklarımızla teslimat süremizi ortalama 24 saate indirdik.",
    href: "/hakkimizda",
    date: "2026-10-15T11:30:00+03:00",
    tag: "Büyüme",
  },
];
