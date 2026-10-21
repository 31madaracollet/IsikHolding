import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  AdminMessage,
  AdminOrder,
  AdminSubscriber,
} from "@/lib/admin/types";
import type { AdminStoreLike } from "@/lib/admin/store-types";

const STORE_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(STORE_DIR, "admin-store.json");

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 3600_000).toISOString();

const daysAgo = (days: number) => hoursAgo(days * 24);

function buildOrder(input: {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  status: AdminOrder["status"];
  createdAt: string;
  coupon?: string | null;
  discountRate?: number;
  note?: string | null;
  items: { name: string; qty: number; unitPrice: number }[];
}): AdminOrder {
  const items = input.items.map((item) => ({
    name: item.name,
    qty: item.qty,
    lineTotal: Math.round(item.unitPrice * item.qty * 100) / 100,
  }));
  const subtotal =
    Math.round(items.reduce((total, item) => total + item.lineTotal, 0) * 100) /
    100;
  const discount =
    Math.round(subtotal * (input.discountRate ?? 0) * 100) / 100;
  const afterDiscount = Math.round((subtotal - discount) * 100) / 100;
  const shipping = afterDiscount >= 500 ? 0 : 79;
  const total = Math.round((afterDiscount + shipping) * 100) / 100;

  return {
    id: `demo-${input.orderNumber}`,
    orderNumber: input.orderNumber,
    customerName: input.customerName,
    email: input.email,
    phone: input.phone,
    city: input.city,
    district: input.district,
    address: input.address,
    note: input.note ?? null,
    subtotal,
    discount,
    shipping,
    total,
    coupon: input.coupon ?? null,
    status: input.status,
    createdAt: input.createdAt,
    items,
  };
}

export function seedStore(): AdminStoreLike {
  const orders: AdminOrder[] = [
    buildOrder({
      orderNumber: "ISH-20261021-K7M2",
      customerName: "Akif Işık",
      email: "akif@isikholding.com",
      phone: "0532 418 22 90",
      city: "İstanbul",
      district: "Sarıyer",
      address: "Maslak Mah. Aydınlık Cad. No 18 D: 4",
      status: "new",
      createdAt: hoursAgo(2),
      coupon: "ISIK15",
      discountRate: 0.15,
      note: "Kurumsal fatura, kapıda arayın.",
      items: [
        { name: "Işık Smart RGBW Akıllı Ampul", qty: 2, unitPrice: 349.9 },
        { name: "Işık Eco LED Ampul 9W", qty: 6, unitPrice: 89.9 },
      ],
    }),
    buildOrder({
      orderNumber: "ISH-20261021-P3T8",
      customerName: "Elif Kaya",
      email: "elif.kaya@veracafe.com",
      phone: "0555 612 44 17",
      city: "İzmir",
      district: "Karşıyaka",
      address: "Bostanlı Mah. 1797 Sok. No 4",
      status: "new",
      createdAt: hoursAgo(6),
      note: "Kafe açılışı için, sabah teslim.",
      items: [
        { name: "Edison Filament Ampul 6W", qty: 12, unitPrice: 149.9 },
        { name: "Nordik Sarkıt Avize", qty: 3, unitPrice: 1899 },
      ],
    }),
    buildOrder({
      orderNumber: "ISH-20261020-R9C4",
      customerName: "Murat Demir",
      email: "murat.demir@kuzeykonut.com",
      phone: "0505 330 71 62",
      city: "İstanbul",
      district: "Ümraniye",
      address: "Site yönetimi, A Blok zemin kat",
      status: "confirmed",
      createdAt: hoursAgo(22),
      coupon: "HOSGELDIN10",
      discountRate: 0.1,
      items: [
        { name: "Işık Sensörlü Akıllı Ampul 9W", qty: 24, unitPrice: 219.9 },
      ],
    }),
    buildOrder({
      orderNumber: "ISH-20261020-H2L6",
      customerName: "Zeynep Arslan",
      email: "zeynep.arslan@studioz.com",
      phone: "0542 907 18 44",
      city: "Ankara",
      district: "Çankaya",
      address: "Çukurambar Mah. Dumlupınar Cad. No 9",
      status: "shipped",
      createdAt: daysAgo(2),
      items: [
        { name: "Kubbe Tasarım Masa Lambası", qty: 1, unitPrice: 1249 },
        { name: "LED Şerit 5m · 2700K", qty: 2, unitPrice: 189.9 },
      ],
    }),
    buildOrder({
      orderNumber: "ISH-20261019-M5F1",
      customerName: "Hakan Yıldız",
      email: "hakan@egeelektrik.com",
      phone: "0533 214 66 08",
      city: "Bursa",
      district: "Nilüfer",
      address: "Küçük Sanayi Sitesi 12. Blok No 44",
      status: "delivered",
      createdAt: daysAgo(4),
      coupon: "ISIK15",
      discountRate: 0.15,
      items: [
        { name: "Highbay Endüstriyel Aydınlatma 150W", qty: 8, unitPrice: 2899 },
        { name: "Ultra Slim LED Panel 60×60 · 40W", qty: 10, unitPrice: 549.9 },
      ],
    }),
    buildOrder({
      orderNumber: "ISH-20261018-B7Q3",
      customerName: "Selin Aydın",
      email: "selin.aydin@marmaraproje.com",
      phone: "0530 118 90 25",
      city: "Antalya",
      district: "Konyaaltı",
      address: "Liman Mah. Otel projesi şantiye ofisi",
      status: "delivered",
      createdAt: daysAgo(6),
      note: "Şantiye teslimi, forklift ile indirilecek.",
      items: [
        { name: "Solar Projektör 100W", qty: 14, unitPrice: 1499 },
        { name: "GU10 LED Spot 5W · 3'lü", qty: 6, unitPrice: 159.9 },
      ],
    }),
    buildOrder({
      orderNumber: "ISH-20261017-T4N9",
      customerName: "Burak Koç",
      email: "burak.koc@outlook.com",
      phone: "0538 772 41 13",
      city: "Kocaeli",
      district: "Gebze",
      address: "Osman Yılmaz Mah. 1203 Sok. No 7",
      status: "delivered",
      createdAt: daysAgo(8),
      items: [
        { name: "Işık Pro LED Ampul 14W · 3'lü Set", qty: 4, unitPrice: 269.9 },
      ],
    }),
    buildOrder({
      orderNumber: "ISH-20261016-D8V2",
      customerName: "Cemre Şahin",
      email: "cemre.sahin@gmail.com",
      phone: "0546 903 57 31",
      city: "İstanbul",
      district: "Kadıköy",
      address: "Moda Cad. No 112 D: 6",
      status: "cancelled",
      createdAt: daysAgo(9),
      note: "Müşteri talebiyle iptal edildi.",
      items: [
        { name: "Işık Smart RGBW Akıllı Ampul", qty: 1, unitPrice: 349.9 },
      ],
    }),
  ];

  const messages: AdminMessage[] = [
    {
      id: "demo-msg-1",
      reference: "MSG-A7K21Q",
      name: "Elif Kaya",
      email: "elif.kaya@veracafe.com",
      phone: "0555 612 44 17",
      subject: "Proje danışmanlığı",
      message:
        "Merhaba, 60 m² kafemiz için aydınlatma planı ve ürün seçimi konusunda destek almak istiyoruz. Keşif için randevu oluşturabilir miyiz?",
      status: "new",
      createdAt: hoursAgo(3),
    },
    {
      id: "demo-msg-2",
      reference: "MSG-B3M08X",
      name: "Hakan Yıldız",
      email: "hakan@egeelektrik.com",
      phone: "0533 214 66 08",
      subject: "Toptan & bayilik",
      message:
        "Bursa'da elektrik malzemeleri satıyoruz. Highbay ve panel ürünlerinde bayilik şartlarınızı ve iskonto tablosunu paylaşabilir misiniz?",
      status: "in_progress",
      createdAt: hoursAgo(9),
    },
    {
      id: "demo-msg-3",
      reference: "MSG-C9R54L",
      name: "Zeynep Arslan",
      email: "zeynep.arslan@studioz.com",
      phone: "0542 907 18 44",
      subject: "Teknik destek",
      message:
        "Kubbe masa lambasının ampulü birkaç gün içinde titremeye başladı. Garanti kapsamında değişim yapılıyor mu, süreç nasıl işliyor?",
      status: "new",
      createdAt: hoursAgo(14),
    },
    {
      id: "demo-msg-4",
      reference: "MSG-D2W77P",
      name: "Murat Demir",
      email: "murat.demir@kuzeykonut.com",
      phone: "0505 330 71 62",
      subject: "Satış & sipariş",
      message:
        "120 dairelik sitemiz için sipariş numarası ISH-20261020-R9C4. Faturayı site yönetimi adına düzenleyebilir miyiz?",
      status: "in_progress",
      createdAt: daysAgo(1),
    },
    {
      id: "demo-msg-5",
      reference: "MSG-E6Y19H",
      name: "Buse Altın",
      email: "buse.altin@hotmail.com",
      phone: "0531 441 20 09",
      subject: "Genel bilgi",
      message:
        "Işık Kulübü aboneliğini iki kişilik ev için önerir misiniz? Aylık ampul hakkı birikiyor mu?",
      status: "closed",
      createdAt: daysAgo(3),
    },
    {
      id: "demo-msg-6",
      reference: "MSG-F1J63K",
      name: "Kerem Öztürk",
      email: "kerem.ozturk@otelgrup.com",
      phone: "0532 887 45 60",
      subject: "Proje danışmanlığı",
      message:
        "Antalya'da 96 odalı otel projemiz var. Oda, koridor ve lobi aydınlatması için teklif ve simülasyon talep ediyoruz.",
      status: "new",
      createdAt: daysAgo(2),
    },
  ];

  const subscriberSeeds = [
    ["akif@isikholding.com", "footer", 1],
    ["elif.kaya@veracafe.com", "footer", 2],
    ["murat.demir@kuzeykonut.com", "newsletter-popup", 3],
    ["zeynep.arslan@studioz.com", "news-page", 4],
    ["hakan@egeelektrik.com", "footer", 5],
    ["buse.altin@hotmail.com", "footer", 6],
    ["kerem.ozturk@otelgrup.com", "news-page", 7],
    ["selin.aydin@marmaraproje.com", "footer", 8],
    ["burak.koc@outlook.com", "footer", 9],
    ["cemre.sahin@gmail.com", "newsletter-popup", 11],
    ["deniz.yalcin@isikholding.com", "footer", 13],
    ["selin.demir@ornek.com", "footer", 16],
  ] as const;

  const subscribers: AdminSubscriber[] = subscriberSeeds.map(
    ([email, source, days], index) => ({
      id: `demo-sub-${index + 1}`,
      email,
      source,
      createdAt: daysAgo(Number(days)),
    }),
  );

  return { orders, messages, subscribers };
}

export async function readLocalStore(): Promise<AdminStoreLike> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as AdminStoreLike;
    if (!Array.isArray(parsed.orders)) throw new Error("invalid store");
    return parsed;
  } catch {
    const seeded = seedStore();
    await writeLocalStore(seeded);
    return seeded;
  }
}

export async function writeLocalStore(store: AdminStoreLike) {
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch (error) {
    console.error("[admin] local store yazılamadı:", error);
  }
}
