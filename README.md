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
| **Yönetim paneli** | `/admin` — Akif Işık oturumu açıkken üst menüde “Yönetim” sekmesi; KPI'lar, sipariş durumu, mesaj triyajı, bülten listesi, CSV dışa aktarma |

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
| `/api/auth/login` | POST | Yönetici girişi → imzalı httpOnly çerez (7 gün, IP başına 6 deneme/dk) |
| `/api/auth/logout` | POST | Oturum çerezini siler |
| `/api/auth/session` | GET | Aktif oturum bilgisi |
| `/api/admin/orders` | PATCH | Sipariş durumu: `new`, `confirmed`, `shipped`, `delivered`, `cancelled` |
| `/api/admin/messages` | PATCH | Mesaj durumu: `new`, `in_progress`, `closed` |

Formlarda honeypot alanı ve IP bazlı hız sınırı (rate limit) bulunur.
Sipariş tutarları istemciden gelen fiyatlara güvenilmeden, sunucuda katalogdan yeniden hesaplanır.

---

## Yönetim paneli (`/admin`)

Panel iki dağıtım modunda da çalışır:

| Mod | Oturum | Veri erişimi |
| --- | --- | --- |
| **Sunucu** (Vercel / Node) | `/api/auth/login` → HMAC imzalı httpOnly çerez, `middleware.ts` koruması | `SUPABASE_SERVICE_ROLE_KEY` ile sunucuda |
| **Statik** (GitHub Pages) | Supabase Auth (`signInWithPassword`), oturum tarayıcıda | Anon anahtar + `authenticated` RLS politikaları |

Sunucu modunda `/admin` altındaki tüm yollar `middleware.ts` ile korunur: oturum
çerezi yoksa `/admin/giris?next=...` sayfasına yönlendirilir. İmza doğrulaması
ayrıca sunucu tarafında (`app/admin/(panel)/layout.tsx`) tekrar yapılır.

`.env.local`:

```env
ADMIN_NAME=Akif Işık
ADMIN_EMAIL=akif@isikholding.com
# Değerde # varsa tırnak kullanın, yoksa .env bunu yorum sanıp değeri keser.
ADMIN_PASSWORD="guclu-bir-sifre#2026"
AUTH_SECRET=openssl-rand-hex-32   # üretmek için: openssl rand -hex 32
```

Giriş ekranı kullanıcı adı olarak **ad soyad**, **e-posta** veya **e-postanın
kullanıcı kısmını** kabul eder; Türkçe karakter farkları (ı/i, ş/s, ğ/g …)
normalize edilir, yani `Akif Isik` de çalışır. Statik modda ad soyad yazılırsa
`NEXT_PUBLIC_ADMIN_EMAIL` adresine eşlenir ve Supabase Auth ile giriş yapılır.

**Sekmenin görünmesi:** oturum açıkken `app/(site)/layout.tsx` çerezden oturumu
okur ve `site-header` / `site-footer` bileşenlerine `admin` prop'u geçer. Bu sayede
“Yönetim” sekmesi yalnızca giriş yapılmışken görünür — herkese açık bir bağlantı yoktur.

Panel sekmeleri: **Genel bakış** (ciro, sipariş, mesaj, bülten KPI'ları + 7 günlük
grafik), **Siparişler** (arama, durum filtresi, satır içi durum güncelleme),
**Mesajlar** (triyaj), **Bülten** (abone listesi, e-postaları kopyala, CSV indir).
Veriler `SUPABASE_SERVICE_ROLE_KEY` ile sunucuda okunur; Supabase'e erişilemeyen
ortamlarda panel `.data/admin-store.json` üzerindeki örnek veriyle çalışır ve
turuncu “Önizleme modu” şeridi gösterir.

> `AUTH_SECRET` değişirse tüm açık oturumlar geçersiz olur.

### Statik panel için Supabase Auth kullanıcısı

GitHub Pages'te panel Supabase Auth ile giriş yapar. Kullanıcı, Supabase
Dashboard → **Authentication → Users → Add user** (e-posta onaylı) ile veya
SQL ile oluşturulur; `user_metadata.name` alanı panelde görünen addır:

```sql
-- extensions şemasında pgcrypto gerekir
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token)
values ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated',
  'authenticated', 'akif@isikholding.com',
  extensions.crypt('guclu-bir-sifre', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', '{"name":"Akif Işık"}',
  now(), now(), '', '', '', '');

insert into auth.identities (id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), id,
  jsonb_build_object('sub', id::text, 'email', email), 'email', id::text,
  now(), now(), now()
from auth.users where email = 'akif@isikholding.com';
```

`authenticated` rolü için gerekli RLS politikaları `supabase/schema.sql` §10'da.

---

## GitHub Pages (statik yayın)

Site iki şekilde çalışır. Sunucu gerektirmeyen statik sürüm GitHub Pages'te
yayınlanabilir:

```bash
npm run build:static     # → docs/ (basePath: /IsikHolding)
```

Statik derleme şunları yapar:

- Sunucuya bağlı parçaları (`app/api/*`, `middleware.ts`) çıkarır.
- `revalidate`/`force-dynamic` ayarlarını statik karşılıklarına çevirir.
- Tüm formları, sepeti ve paneli **doğrudan Supabase'e** bağlar
  (anon anahtar + RLS; panelde Supabase Auth).
- Görselleri ve `_next` varlıklarını `/IsikHolding` alt yoluna taşır.

Statik sürümde çalışanlar: anasayfa, ürünler, haberler (editoryal akış), fiyatlandırma,
hakkımızda, iletişim formu, bülten, sepet ve sipariş, **yönetim paneli** (Supabase Auth).
Sunucu tarafı RSS/GitHub proxy'si olmadığı için haber akışı editoryal içerikle,
GitHub kartı ise depo bağlantısıyla görünür.

### Yayın adımları

1. `docs/` klasörünü commit'leyin (`npm run build:static` çıktısıdır).
2. GitHub → **Settings → Pages → Build and deployment**
   → Source: **Deploy from a branch**
   → Branch: `main` (veya `arena/31337e37-isikholding`) · Folder: **`/docs`**
3. Site birkaç dakika içinde şurada yayınlanır:
   `https://31madaracollet.github.io/IsikHolding/`

> Repo adı `IsikHolding` olduğu için `basePath` sabittir. Farklı bir repo adı
> kullanacaksanız `next.config.ts` ve `scripts/build-static.mjs` içindeki
> `/IsikHolding` değerlerini güncelleyin.
>
> GitHub Pages yalnızca statik dosya servis eder; bu yüzden `next start` ile
> çalışan sürümdeki `/api/*` uç noktaları statik sürümde yoktur. Panel ve formlar
> Supabase'e tarayıcıdan bağlanır, yani veri yine gerçekten kaydedilir.

Yerelde statik sürümü denemek için:

```bash
node scripts/serve-docs.mjs   # http://localhost:3000/IsikHolding/
```

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
middleware.ts              # /admin koruması (çerez yoksa /admin/giris?next=…)
app/
  layout.tsx               # <html>/<body>, fontlar, metadata, JSON-LD
  (site)/                  # herkese açık site kabuğu (CartProvider + header/footer)
    page.tsx               # anasayfa (haber akışı + tüm bölümler)
    urunler/               # katalog + [slug] ürün detayı
    haberler/              # canlı haber akışı
    fiyatlandirma/         # abonelik, bayi, fiyat listesi
    hakkimizda/            # kurumsal + GitHub kartı
    iletisim/              # form + harita + departmanlar
    sepet/                 # sepet & sipariş akışı
    politikalar/           # yasal metinler
  admin/
    giris/                 # giriş ekranı (oturum varsa /admin'e döner)
    (panel)/               # korumalı panel kabuğu + gösterge tablosu
  api/                     # news, github, contact, newsletter, orders, health, auth/*, admin/*
components/
  site-header.tsx          # admin oturumunda “Yönetim” sekmesi
  admin/                   # login-form, dashboard, logout-button
  …                        # sepet, ürün/haber kartları, asistan
lib/
  auth.ts                  # imzalı oturum çerezi (HMAC-SHA256, 7 gün)
  auth-constants.ts        # edge/node ortak sabitler (node:crypto import etmez)
  admin/                   # tipler, Supabase okuma katmanı, demo store
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

**Vercel (önerilen).** Depoyu içe aktarın, yukarıdaki ortam değişkenlerini ekleyin, deploy edin.
Supabase şeması çalıştırıldığında formlar, siparişler ve panel verileri kalıcı olarak kaydedilir.
`NEXT_PUBLIC_SITE_URL` değerini gerçek alan adınızla güncelleyin (sitemap ve canonical URL'ler için).

> **GitHub Pages bu projeyi barındıramaz.** Site yalnızca statik dosyalardan oluşmuyor:
> sunucu tarafı route handler'lar (`/api/*`), imzalı çerezle çalışan `middleware`,
> Supabase service-role okumaları ve dinamik `/admin` sayfası gerekiyor. GitHub Pages
> yalnızca statik dosya servis eder (PHP/Node çalıştırmaz), bu yüzden `next export`
> yapılmadıkça orada çalışmaz — panel, formlar ve sepet siparişleri de çalışmaz.
> Canlı önizleme için Vercel / Netlify / herhangi bir Node sunucusu kullanın.

Yerel üretim derlemesi:

```bash
npm run build
NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt npx next start -H 0.0.0.0 -p 3000
```

---

© 2026 Işık Holding A.Ş. — Bu proje bir tanıtım/demo çalışmasıdır; ürünler, fiyatlar ve
kurumsal bilgiler temsilidir.
