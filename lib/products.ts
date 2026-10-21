import type { Product } from "@/lib/types";
import { asset } from "@/lib/mode";

export const products: Product[] = [
  {
    id: "p-001",
    slug: "isik-eco-led-9w",
    name: "Işık Eco LED Ampul 9W",
    category: "LED Aydınlatma",
    shortDescription:
      "806 lümen ışık akısı, göz yormayan titreşimsiz teknoloji ve 25.000 saat ömür.",
    description:
      "Işık Eco, evinizin her odasında kullanabileceğiniz günlük LED ampul serisidir. E27 duyu sayesinde mevcut armatürlerinize doğrudan uyum sağlar. Flicker-free sürücüsü ile göz yorgunluğunu azaltır; 9W gücüyle 60W akkor ampullerle aynı ışığı yalnızca enerjinin küçük bir kısmını kullanarak verir.",
    price: 89.9,
    oldPrice: 119.9,
    image: asset("/images/product-led.jpg"),
    badge: "En Çok Satan",
    rating: 4.8,
    reviews: 2140,
    stock: 1280,
    specs: [
      { label: "Güç", value: "9 W" },
      { label: "Işık akısı", value: "806 lm" },
      { label: "Renk sıcaklığı", value: "3000K · 4000K · 6500K" },
      { label: "Duy", value: "E27" },
      { label: "Gerilim", value: "220–240 V" },
      { label: "Ömür", value: "25.000 saat" },
      { label: "Enerji sınıfı", value: "A+" },
    ],
    features: [
      "Akkor ampule göre %85'e kadar enerji tasarrufu",
      "Göz yorgunluğu yapmayan flicker-free sürücü",
      "Üç farklı renk sıcaklığı seçeneği",
      "2 yıl Işık Holding garantisi",
    ],
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: "p-002",
    slug: "isik-smart-rgbw",
    name: "Işık Smart RGBW Akıllı Ampul",
    category: "Akıllı Aydınlatma",
    shortDescription:
      "16 milyon renk, 2700K–6500K beyaz tonları; Wi-Fi ile uygulamadan ve sesle kontrol.",
    description:
      "Işık Smart ile ışığınız ruh halinize uyum sağlar. Wi-Fi üzerinden Işık Home uygulamasına bağlanır; Alexa ve Google Asistan ile sesle kontrol edilir. Uyku, okuma, film ve parti gibi hazır sahneler sayesinde tek dokunuşla atmosfer değiştirirsiniz.",
    price: 349.9,
    oldPrice: 449.9,
    image: asset("/images/product-smart.jpg"),
    badge: "Yeni Nesil",
    rating: 4.7,
    reviews: 896,
    stock: 620,
    specs: [
      { label: "Güç", value: "9 W" },
      { label: "Işık akısı", value: "806 lm" },
      { label: "Renk", value: "RGBW · 16 milyon renk" },
      { label: "Bağlantı", value: "Wi-Fi 2.4 GHz" },
      { label: "Uyumluluk", value: "Alexa · Google Asistan" },
      { label: "Ses kontrolü", value: "Destekli" },
    ],
    features: [
      "Işık Home uygulamasıyla programlanabilir zamanlayıcı",
      "16 milyon renk ve ayarlanabilir beyaz tonları",
      "Enerji tüketimini anlık izleyen raporlar",
      "Matter protokolüne yükseltilebilir altyapı",
    ],
    isFeatured: true,
    isNew: true,
  },
  {
    id: "p-003",
    slug: "isik-pro-led-14w-3lu",
    name: "Işık Pro LED Ampul 14W · 3'lü Set",
    category: "LED Aydınlatma",
    shortDescription:
      "1.521 lümen güçlü ışık, 5 yıl garanti. Salon ve geniş alanlar için üçlü ekonomik set.",
    description:
      "Işık Pro serisi, yüksek tavanlı salonlar ve geniş yaşam alanları için tasarlandı. 14W gücünde 1.521 lümen ışık verir; düşük ısı üretimi sayesinde armatür ömrünü uzatır. Üçlü set halinde sunulur, böylece tüm mekânı tek seferde dönüştürebilirsiniz.",
    price: 269.9,
    oldPrice: 329.9,
    image: asset("/images/product-led.jpg"),
    badge: "3'lü Avantaj",
    rating: 4.9,
    reviews: 612,
    stock: 890,
    specs: [
      { label: "Güç", value: "14 W" },
      { label: "Işık akısı", value: "1.521 lm / ampul" },
      { label: "Renk sıcaklığı", value: "4000K · Doğal beyaz" },
      { label: "Duy", value: "E27" },
      { label: "Paket", value: "3 ampul" },
      { label: "Garanti", value: "5 yıl" },
    ],
    features: [
      "Geniş alanlar için yüksek lümen çıkışı",
      "Düşük ısı üretimi, uzun armatür ömrü",
      "5 yıl doğrudan üretici garantisi",
      "Kurumsal ve toptan alımlarda özel fiyat",
    ],
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: "p-004",
    slug: "edison-filament-6w",
    name: "Edison Filament Ampul 6W",
    category: "Dekoratif",
    shortDescription:
      "2.200K amber ışık, açık filaman tasarımı. Kafe ve yaşam alanlarına sıcak bir dokunuş.",
    description:
      "Klasik Edison estetiğini LED verimliliğiyle birleştiren dekoratif ampul. 2.200K sıcak amber ışığı, açık filamanı ve şeffaf camıyla göz alıcı bir atmosfer yaratır. Dim edilebilir yapısı ile restoran, kafe ve ev dekorasyonunda tercih edilir.",
    price: 149.9,
    oldPrice: 189.9,
    image: asset("/images/product-filament.jpg"),
    badge: "Editör Seçimi",
    rating: 4.9,
    reviews: 1480,
    stock: 430,
    specs: [
      { label: "Güç", value: "6 W" },
      { label: "Işık akısı", value: "540 lm" },
      { label: "Renk sıcaklığı", value: "2200K amber" },
      { label: "Duy", value: "E27" },
      { label: "Kısılabilir", value: "Evet" },
      { label: "Ömür", value: "20.000 saat" },
    ],
    features: [
      "Açık filamanlı dekoratif tasarım",
      "Dim edilebilir (dimmer uyumlu)",
      "Sıcak amber ışıkla samimi atmosfer",
      "Kafe ve restoran projeleri için ideal",
    ],
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: "p-005",
    slug: "nordik-sarkit-avize",
    name: "Nordik Sarkıt Avize",
    category: "Dekoratif",
    shortDescription:
      "Mat beyaz kubbe, pirinç detay ve 1,5 metre ayarlanabilir kablo. İskandinav sadeliği.",
    description:
      "Nordik sarkıt, sade çizgileri ve sıcak ışık dağılımıyla mutfak adaları, yemek masaları ve resepsiyon alanları için tasarlandı. Kanallı cam kubbe, sıcak ışığı yumuşak çizgilerle dağıtır; ahşap detay ve pirinç bağlantıyla tamamlanır. Kablo boyu mekânınıza göre ayarlanabilir.",
    price: 1899,
    oldPrice: 2299,
    image: asset("/images/product-pendant.jpg"),
    rating: 4.8,
    reviews: 168,
    stock: 54,
    specs: [
      { label: "Malzeme", value: "Kanallı cam · ahşap detay" },
      { label: "Renk", value: "Amber cam / ceviz" },
      { label: "Kablo", value: "1,5 m ayarlanabilir" },
      { label: "Duy", value: "E27" },
      { label: "Çap", value: "32 cm" },
      { label: "Ampul", value: "Dahil değil" },
    ],
    features: [
      "El işçiliğiyle tamamlanan ahşap ve pirinç detay",
      "Mekâna göre ayarlanabilir askı yüksekliği",
      "Kolay montaj seti ve montaj kılavuzu",
      "2 yıl yapısal garanti",
    ],
    isNew: true,
    isFeatured: true,
  },
  {
    id: "p-006",
    slug: "solar-projektor-100w",
    name: "Solar Projektör 100W",
    category: "Solar & Dış Mekan",
    shortDescription:
      "Şebekeden bağımsız güneş enerjili aydınlatma. IP66 gövde, hareket sensörü ve kumanda.",
    description:
      "Bahçe, otopark, depo ve şantiye alanları için şebekeye ihtiyaç duymayan solar projektör. Monokristal güneş paneli ve 20 Ah bataryası ile gün boyu şarj olur, akşam otomatik olarak devreye girer. IP66 koruma sınıfı yağmur ve toza karşı dayanıklıdır.",
    price: 1499,
    oldPrice: 1899,
    image: asset("/images/product-solar.jpg"),
    badge: "Enerji Bağımsız",
    rating: 4.5,
    reviews: 432,
    stock: 210,
    specs: [
      { label: "Güç", value: "100 W" },
      { label: "Işık akısı", value: "8.000 lm" },
      { label: "Batarya", value: "20 Ah LiFePO₄" },
      { label: "Koruma sınıfı", value: "IP66" },
      { label: "Sensör", value: "Hareket + alacakaranlık" },
      { label: "Garanti", value: "3 yıl" },
    ],
    features: [
      "Elektrik şebekesi gerektirmeyen kurulum",
      "Uzaktan kumanda ve hareket sensörü",
      "Yağmur, toz ve UV dayanımlı IP66 gövde",
      "3 yıl panel ve batarya garantisi",
    ],
    isFeatured: true,
  },
  {
    id: "p-007",
    slug: "isik-smart-sensor-9w",
    name: "Işık Sensörlü Akıllı Ampul 9W",
    category: "Akıllı Aydınlatma",
    shortDescription:
      "Hareketi algılar, ışığı otomatik açar. Koridor, merdiven ve depolar için akıllı çözüm.",
    description:
      "Entegre PIR sensörü ile 5 metreye kadar hareket algılar; ortamda kimse yokken ışığı kapatarak enerji israfını önler. Alacakaranlık modu sayesinde yalnızca karanlıkta devreye girer. Wi-Fi bağlantısıyla hassasiyet ve süre ayarları uygulamadan yapılabilir.",
    price: 219.9,
    image: asset("/images/product-sensor.jpg"),
    rating: 4.6,
    reviews: 312,
    stock: 340,
    specs: [
      { label: "Güç", value: "9 W" },
      { label: "Işık akısı", value: "806 lm" },
      { label: "Sensör", value: "PIR · 5 m / 120°" },
      { label: "Bağlantı", value: "Wi-Fi 2.4 GHz" },
      { label: "Duy", value: "E27" },
      { label: "Mod", value: "Gündüz / gece / zamanlayıcı" },
    ],
    features: [
      "Hareket algılama ile otomatik açma-kapama",
      "Uygulamadan hassasiyet ve süre ayarı",
      "Koridor, depo ve merdivenlerde %70'e kadar tasarruf",
      "2 yıl garanti",
    ],
    isNew: true,
  },
  {
    id: "p-008",
    slug: "led-serit-5m",
    name: "Işık LED Şerit 5m · 2700K",
    category: "LED Aydınlatma",
    shortDescription:
      "5 metre sıcak beyaz LED şerit, adaptör dahil. Mutfak ve mobilya altı için pratik çözüm.",
    description:
      "Mutfak tezgâhı, TV ünitesi ve dolap altı aydınlatma için esnek, kesilebilir LED şerit. Güçlü 3M yapıştırıcısı ile kolayca monte edilir. 5 metre boyunca homojen ışık veren 2835 LED çipleri ve dahil adaptörü ile kutudan çıktığı gibi kullanıma hazırdır.",
    price: 189.9,
    image: asset("/images/product-strip.jpg"),
    rating: 4.6,
    reviews: 740,
    stock: 760,
    specs: [
      { label: "Uzunluk", value: "5 m" },
      { label: "Güç", value: "24 W (toplam)" },
      { label: "Renk sıcaklığı", value: "2700K sıcak beyaz" },
      { label: "Adaptör", value: "12V · 2A dahil" },
      { label: "LED tipi", value: "2835 SMD" },
      { label: "Kesilebilir", value: "Her 5 cm'de" },
    ],
    features: [
      "3M güçlü yapışkan bant ile kolay montaj",
      "Kesilebilir yapı, esnek kullanım",
      "Adaptör ve bağlantı kablosu kutuda",
      "2 yıl garanti",
    ],
  },
  {
    id: "p-009",
    slug: "ultra-slim-led-panel-60x60",
    name: "Ultra Slim LED Panel 60×60 · 40W",
    category: "LED Aydınlatma",
    shortDescription:
      "Ofis ve mağazalar için homojen 3.600 lümen ışık. 2 cm incelikte, göz yormayan panel.",
    description:
      "Asma tavan sistemlerine gömülebilen 60×60 cm LED panel. 40W gücünde 3.600 lümen ışık üretir, homojen aydınlatma ile ofislerde ve mağazalarda gölge oluşumunu azaltır. 2 cm'lik inceliği sayesinde mimari görünümü bozmaz.",
    price: 549.9,
    oldPrice: 649.9,
    image: asset("/images/product-panel.jpg"),
    badge: "Ofis Favorisi",
    rating: 4.7,
    reviews: 238,
    stock: 320,
    specs: [
      { label: "Güç", value: "40 W" },
      { label: "Işık akısı", value: "3.600 lm" },
      { label: "Renk sıcaklığı", value: "4000K" },
      { label: "Ölçü", value: "60 × 60 × 2 cm" },
      { label: "Işık açısı", value: "120°" },
      { label: "Ömür", value: "25.000 saat" },
    ],
    features: [
      "Homojen, titreşimsiz ışık dağılımı",
      "Asma tavana kolay montaj",
      "UGR<19 düşük kamaşma değeri",
      "3 yıl garanti",
    ],
    isFeatured: true,
  },
  {
    id: "p-010",
    slug: "gu10-led-spot-3lu",
    name: "GU10 LED Spot 5W · 3'lü",
    category: "LED Aydınlatma",
    shortDescription:
      "38 derece odaklı ışık, 3'lü set. Mutfak ve vitrin aydınlatmasında keskin vurgular.",
    description:
      "Ray ve spot armatürler için GU10 duylu LED spot seti. 38 derecelik ışık açısı ile belirli alanları vurgular; mutfak tezgâhı, vitrin ve sanat galerisi gibi mekânlarda tercih edilir. Üçlü paket halinde sunulur.",
    price: 159.9,
    image: asset("/images/product-spot.jpg"),
    rating: 4.5,
    reviews: 366,
    stock: 540,
    specs: [
      { label: "Güç", value: "3 × 5 W" },
      { label: "Işık akısı", value: "3 × 400 lm" },
      { label: "Renk sıcaklığı", value: "2700K" },
      { label: "Duy", value: "GU10" },
      { label: "Işık açısı", value: "38°" },
      { label: "Paket", value: "3 adet" },
    ],
    features: [
      "Odaklı ışıkla etkili vurgulama",
      "Halojen spotlara doğrudan alternatif",
      "%90'a kadar enerji tasarrufu",
      "2 yıl garanti",
    ],
    isNew: true,
  },
  {
    id: "p-011",
    slug: "kubbe-masa-lambasi",
    name: "Kubbe Tasarım Masa Lambası",
    category: "Dekoratif",
    shortDescription:
      "Sarı metal gövde, dokunmatik dimmer ve USB-C çıkışı. Çalışma masalarına karakter.",
    description:
      "Kubbe masa lambası, çalışma ve okuma alanlarına hem işlev hem karakter katar. Dokunmatik dimmer ile üç ışık seviyesi sunar. Gövdesindeki USB-C çıkışı ile telefonunuzu şarj edebilirsiniz. Sarı mat metal gövdesi, Işık Holding atölyesinde üretilir.",
    price: 1249,
    image: asset("/images/product-lamp.jpg"),
    badge: "Atölye Üretimi",
    rating: 4.7,
    reviews: 94,
    stock: 48,
    specs: [
      { label: "Malzeme", value: "Metal gövde · mat boya" },
      { label: "Renk", value: "Sıcak sarı" },
      { label: "Işık", value: "3 kademeli dimmer" },
      { label: "Bağlantı", value: "USB-C şarj çıkışı" },
      { label: "Duy", value: "E27" },
      { label: "Garanti", value: "2 yıl" },
    ],
    features: [
      "Dokunmatik üç kademeli dimmer",
      "USB-C ile telefon şarjı",
      "El işçiliğiyle üretilen metal gövde",
      "Enerji verimli LED ampul dahil",
    ],
    isNew: true,
  },
  {
    id: "p-012",
    slug: "highbay-150w",
    name: "Highbay Endüstriyel Aydınlatma 150W",
    category: "Endüstriyel",
    shortDescription:
      "21.000 lümen, IP65 gövde ve 5 yıl garanti. Depo, fabrika ve spor salonları için.",
    description:
      "Yüksek tavanlı endüstriyel alanlar için tasarlanmış highbay armatür. 150W gücünde 21.000 lümen ışık üretir, alüminyum kanatlı gövdesi ısıyı verimli biçimde dağıtır. IP65 koruma sınıfı ile tozlu ve nemli ortamlarda güvenle kullanılır.",
    price: 2899,
    image: asset("/images/product-highbay.jpg"),
    rating: 4.8,
    reviews: 76,
    stock: 76,
    specs: [
      { label: "Güç", value: "150 W" },
      { label: "Işık akısı", value: "21.000 lm" },
      { label: "Renk sıcaklığı", value: "5000K" },
      { label: "Koruma sınıfı", value: "IP65" },
      { label: "Optik", value: "90° lens" },
      { label: "Garanti", value: "5 yıl" },
    ],
    features: [
      "Alüminyum kanatlı pasif soğutma",
      "Toz ve neme dayanıklı IP65 gövde",
      "Fabrika ve depolarda %60'a kadar tasarruf",
      "5 yıl yerinde garanti",
    ],
    isFeatured: true,
  },
];

export const categories = [
  {
    name: "LED Aydınlatma",
    slug: "led-aydinlatma",
    icon: "zap",
    description: "Ev ve ofisin her köşesi için verimli LED çözümleri.",
    image: asset("/images/product-led.jpg"),
    count: 5,
  },
  {
    name: "Akıllı Aydınlatma",
    slug: "akilli-aydinlatma",
    icon: "cpu",
    description: "Uygulama, ses ve sensörle yönetilen akıllı ışık.",
    image: asset("/images/product-smart.jpg"),
    count: 2,
  },
  {
    name: "Dekoratif",
    slug: "dekoratif",
    icon: "sparkles",
    description: "Mekâna karakter katan filament, sarkıt ve masa lambaları.",
    image: asset("/images/product-filament.jpg"),
    count: 3,
  },
  {
    name: "Solar & Dış Mekan",
    slug: "solar-dis-mekan",
    icon: "sun",
    description: "Şebekeden bağımsız, dayanıklı dış mekân aydınlatması.",
    image: asset("/images/product-solar.jpg"),
    count: 1,
  },
  {
    name: "Endüstriyel",
    slug: "endustriyel",
    icon: "factory",
    description: "Depo, fabrika ve yüksek tavan için profesyonel armatürler.",
    image: asset("/images/product-highbay.jpg"),
    count: 1,
  },
] as const;

export const categoryNames = [
  "LED Aydınlatma",
  "Akıllı Aydınlatma",
  "Dekoratif",
  "Solar & Dış Mekan",
  "Endüstriyel",
] as const;

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts() {
  return products.filter((product) => product.isFeatured);
}

export function getRelatedProducts(product: Product, limit = 3) {
  return products
    .filter((item) => item.slug !== product.slug)
    .sort((a, b) => {
      const aScore = a.category === product.category ? 1 : 0;
      const bScore = b.category === product.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}

export const categoryToSlug: Record<string, string> = {
  "LED Aydınlatma": "led-aydinlatma",
  "Akıllı Aydınlatma": "akilli-aydinlatma",
  Dekoratif: "dekoratif",
  "Solar & Dış Mekan": "solar-dis-mekan",
  Endüstriyel: "endustriyel",
};
