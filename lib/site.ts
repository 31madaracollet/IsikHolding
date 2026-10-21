export const site = {
  name: "Işık Holding",
  legalName: "Işık Holding A.Ş.",
  tagline: "Işığın geleceğini tasarlıyoruz.",
  description:
    "1998'den beri aydınlatma ve elektrik teknolojileri alanında üretim, perakende ve proje çözümleri sunan Işık Holding; LED ampullerden akıllı aydınlatma sistemlerine uzanan geniş bir ürün ailesiyle 81 ilde hizmet verir.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://isikholding.com",
  phone: "+90 212 909 40 40",
  phoneHref: "+902129094040",
  email: "merhaba@isikholding.com",
  supportEmail: "destek@isikholding.com",
  address: "Maslak Mah. Aydınlık Cad. No: 18, Sarıyer / İstanbul",
  shortAddress: "Maslak, Sarıyer / İstanbul",
  workingHours: "Hafta içi 09.00 – 18.30 · Cumartesi 10.00 – 15.00",
  foundedYear: 1998,
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
    github: "https://github.com",
  },
  stats: [
    { value: 28, suffix: "+", label: "yıllık deneyim" },
    { value: 450, suffix: "+", label: "bayi ve satış noktası" },
    { value: 12, suffix: "M+", label: "satılan ampul" },
    { value: 81, suffix: "", label: "ilde teslimat" },
  ],
};

export const navigation = [
  { label: "Anasayfa", href: "/" },
  { label: "Ürünler", href: "/urunler", hasMenu: true },
  { label: "Haberler", href: "/haberler" },
  { label: "Fiyatlandırma", href: "/fiyatlandirma" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
];

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
];
