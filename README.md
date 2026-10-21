# Işık Holding — Kurumsal Tanıtım & Ampul Mağazası

Sarı–beyaz temalı, çok sayfalı bir kurumsal tanıtım ve e-ticaret deneyimi.
**Next.js 15 (App Router) · React 19 · Tailwind CSS · Supabase · GitHub API · RSS**

> Haber akışı, sektör sitelerinden (Webrazzi, Enerji Günlüğü, Donanım Haber, Anadolu Ajansı)
> canlı olarak çekilir; Işık Holding duyurularıyla harmanlanarak ana sayfada ve
> `/haberler` sayfasında gösterilir. Kaynaklara erişilemezse editoryal demo akışı devreye girer.

---

## Öne çıkanlar

| Alan | Açıklama |
| --- | --- |
| **Anasayfa** | Hero, güven şeridi, 5 kategori, öne çıkan ürünler, %35 ampul kampanyası, canlı haber akışı, rakamlar, Işık Asistanı (3 soruluk ürün önerisi), abonelik planları, müşteri yorumları, SSS |
| **Ürünler** | 12 ürün, kategori filtresi, arama ve sıralama; ürün detaylarında teknik tablo, stok, adet seçimi, sepete ekleme, JSON-LD |
| **Haberler** | RSS akışı + kurumsal duyurular, kategori filtreleri, arama, “daha fazla yükle”, kaynak listesi, `/api/news` JSON uç noktası |
| **Fiyatlandırma** | Işık Kulübü abonelik planları (aylık/yıllık), bayi paketleri, tek ürün fiyat listesi, hizmet ücretleri, karşılaştırma tablosu, SSS |
| **Sepet** | localStorage sepet, adet yönetimi, kupon (`ISIK15`, `HOSGELDIN10`), ücretsiz kargo eşiği, teslimat formu, sipariş numarası |
| **Hakkımızda** | Hikâye, zaman çizelgesi, değerler, sürdürülebilirlik, ekip, sertifikalar, bayilik, **canlı GitHub kartı** |
| **İletişim** | Form (Supabase), hızlı iletişim kartları, stilize harita, departman e-postaları, SSS |
| **Politikalar** | KVKK, gizlilik, çerez, mesafeli satış, teslimat, iade, garanti |

---

## Kurulum

```bash
npm install
cp .env.example .env.local   # anahtarları doldurun (opsiyonel)
npm run dev                  # http://localhost:3000
```

Supabase anahtarları boşsa site **demo modunda** çalışır: formlar ve sipariş akışı
başarıyla tamamlanır, ancak veritabanına yazılmaz. Arayüzde bu durum açıkça belirtilir.

```bash
npm run build && npm start   # üretim derlemesi
```

---

## Supabase (canlı kurulum yapıldı)

Bu depo için Supabase projesi oluşturuldu ve şema uygulandı:

| | |
| --- | --- |
| Proje | `isik-holding` |
| Ref | `qfprngbydlbnsqrexnwm` |
| Bölge | `eu-central-1` (Frankfurt) |
| Migration | `init_isik_holding_schema` (5 tablo + `order_summary` görünümü) |
| RLS | Tüm tablolarda açık; anon rolü yalnızca INSERT yapabilir |

Uygulanan şema: `contact_messages`, `newsletter_subscribers`, `orders`, `order_items`, `coupons`
(+ `order_summary` görünümü). `anon` rolüne yalnızca **insert** izni verildi;
`orders` tablosunu okuyamaz (test edildi: `permission denied for table orders`).

### Yeni bir projede sıfırdan kurulum

1. [supabase.com](https://supabase.com) üzerinde proje oluşturun.
2. **SQL Editor**'da [`supabase/schema.sql`](./supabase/schema.sql) dosyasını çalıştırın.
   Tablolar: `contact_messages`, `newsletter_subscribers`, `orders`, `order_items`, `coupons`.
   Tüm tablolarda RLS açıktır; yazma yalnızca sunucu tarafındaki `service_role` anahtarıyla yapılır.
3. **Project Settings → API** ekranından URL, `anon` ve `service_role` anahtarlarını kopyalayın.
4. `.env.local` dosyasına yazın:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # asla NEXT_PUBLIC_ önekiyle kullanmayın
```

> `service_role` anahtarı yalnızca sunucu route handler'larında (`/api/contact`,
> `/api/newsletter`, `/api/orders`) kullanılır; tarayıcıya sızmaz.
> İstemci paketinde yalnızca `anon` (public) anahtarı bulunur.

### Tarayıcı köprüsü (neden var?)

Bazı önizleme/CI ortamları dış ağda yalnızca belirli alan adlarına izin verir;
bu durumda **sunucu** `*.supabase.co` adresine ulaşamaz ama **ziyaretçinin
tarayıcısı** ulaşabilir. Bu yüzden:

1. Route handler, Supabase'e ağ hatası nedeniyle yazamazsa `503` +
   `{ fallback: true }` döner.
2. İstemci, `anon` anahtarıyla doğrudan INSERT yapar (RLS politikaları izin verdiği ölçüde).
3. Üretimde (Vercel vb.) sunucu yolu çalışır, köprü hiç devreye girmez.

Tarayıcı köprüsünde hassas veri okunamaz: `SELECT` için policy yoktur.

Uç nokta: `GET /api/health` → `{ supabase: { configured, reachable, latencyMs } }`
(Sandbox önizlemesinde `reachable: false` görünmesi normaldir; canlı ortamda `true` olur.)

### API uç noktaları

| Uç nokta | Yöntem | İşlev |
| --- | --- | --- |
| `/api/news` | GET | RSS + fallback haber akışı (15 dk cache) |
| `/api/github` | GET | Depo istatistikleri ve son commit'ler (1 saat cache) |
| `/api/contact` | POST | İletişim formu → `contact_messages`, `MSG-XXXXXX` referansı |
| `/api/newsletter` | POST | Bülten kaydı → `newsletter_subscribers`, tekrar kayıtta dostça yanıt |
| `/api/orders` | POST | Sipariş → `orders` + `order_items`, sunucuda fiyat yeniden hesaplanır |
| `/api/health` | GET | Supabase yapılandırma/erişim durumu (anahtar sızdırmaz) |

Formlarda honeypot alanı ve IP bazlı hız sınırı (rate limit) bulunur.
Sipariş tutarları istemciden gelen fiyatlara güvenilmeden, sunucuda katalogdan yeniden hesaplanır.

---

## GitHub entegrasyonu

`.env.local`:

```env
NEXT_PUBLIC_GITHUB_REPO=31madaracollet/IsikHolding
GITHUB_TOKEN=ghp_...   # opsiyonel, rate limit için (read-only)
```

`/hakkimizda` sayfasındaki GitHub kartı yıldız/çatal/issue sayılarını ve son commit'leri
gösterir. Token yoksa veya API'ye erişilemezse kart zarif biçimde depo bağlantısına düşer.

---

## Klasör yapısı

```
app/
  page.tsx                 # anasayfa (haber akışı + tüm bölümler)
  urunler/                 # katalog + [slug] ürün detayı
  haberler/                # canlı haber akışı
  fiyatlandirma/           # abonelik, bayi, fiyat listesi
  hakkimizda/              # kurumsal + GitHub kartı
  iletisim/                # form + harita + departmanlar
  sepet/                   # sepet & sipariş akışı
  politikalar/             # yasal metinler
  api/                     # news, github, contact, newsletter, orders
components/                # header, footer, sepet, ürün/haber kartları, asistan…
lib/
  products.ts              # 12 ürünlük katalog
  news.ts                  # RSS çekme + fallback
  news-data.ts             # editoryal fallback + kurumsal duyurular
  checkout.ts              # kargo/kupon/toplam hesapları
  supabase/server.ts       # yalnızca sunucu tarafı Supabase istemcisi
  supabase/client.ts       # tarayıcı istemcisi (yalnızca anon anahtarı)
  supabase/fallback.ts     # sunucu erişemediğinde RLS destekli insert köprüsü
  github.ts                # GitHub API katmanı
  pricing.ts               # planlar ve hizmetler
supabase/schema.sql        # tablolar, indeksler, RLS, kupon seed, insert politikaları
public/images/             # üretilmiş kampanya & ürün görselleri
```

---

## Tema ve tasarım

- **Renkler:** marka sarısı `#FFC800`, krem beyaz `#FFFCF4`, mürekkep siyahı `#121212`.
- **Tipografi:** Space Grotesk (başlıklar) + Manrope (metin), `next/font` yerine
  `@fontsource-variable` ile kendi sunucumuzdan yüklenir (dış istek yok, gizlilik dostu).
- **Bileşen dili:** yumuşak köşeler, ince çizgiler, sarı vurgu blokları, hafif gölgeler,
  erişilebilir kontrast ve `prefers-reduced-motion` desteği.
- Tüm sayfalar Türkçe, mobil öncelikli ve klavye erişilebilir.

## Dağıtım

Vercel'a deploy etmek için depoyu bağlayın ve yukarıdaki ortam değişkenlerini ekleyin.
Supabase şeması çalıştırıldığında formlar ve siparişler kalıcı olarak kaydedilir.
`NEXT_PUBLIC_SITE_URL` değerini gerçek alan adınızla güncelleyin (sitemap ve canonical URL'ler için).

---

© 2026 Işık Holding A.Ş. — Bu proje bir tanıtım/demo çalışmasıdır; ürünler, fiyatlar ve
kurumsal bilgiler temsilidir.
