export type Category =
  | "LED Aydınlatma"
  | "Akıllı Aydınlatma"
  | "Dekoratif"
  | "Solar & Dış Mekan"
  | "Endüstriyel"
  | "Kablo & Uzatma"
  | "Priz & Anahtar"
  | "Pano & Sigorta"
  | "Elektrik Malzemeleri"
  | "Akıllı Ev"
  | "Enerji & Şarj"
  | "Ölçüm & Güvenlik";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  stock: number;
  specs: ProductSpec[];
  features: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
}

export type NewsCategory = "Enerji" | "Teknoloji" | "Sektör" | "Ekonomi";

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: NewsCategory;
  image?: string;
  live?: boolean;
}

export interface CompanyUpdate {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  date: string;
  tag: string;
}
