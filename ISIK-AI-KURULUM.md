# Işık AI — kurulum ve bakım notları

Site üzerindeki yapay zekâ asistanı (**v12**). Işık Holding ürünleri ve fiyatları,
ürün seçimi, elektrik tesisatı, aydınlatma/elektronik/enerji bilgisi, akıllı ev,
solar & EV şarjı, kargo/kupon/iade ve güncel teknoloji haberleri konularında
yardımcı olur. Sadece siyaset, spor, magazin, hukuk/tıp/yatırım tavsiyesi,
kod/ödev ve rakip marka önerisi reddedilir.

## Mimari

```
Tarayıcı (sarı "Işık AI" balonu)
   └─ POST /functions/v1/isik-ai        (Supabase Edge Function, Deno)
        └─ POST api.groq.com/openai/v1/chat/completions
             (GROQ_API_KEY → hata olursa GROQ_API_KEY_2)
```

- Groq anahtarı **yalnızca Supabase secret** olarak durur, istemci paketine girmez.
- İstemci yalnızca herkese açık `NEXT_PUBLIC_SUPABASE_ANON_KEY` ile fonksiyonun
  JWT doğrulamasını geçer (`verify_jwt = true`).
- Fonksiyon Türkçe hata mesajı döner: `400` boş mesaj, `405` yanlış metot,
  `429` saatlik limit, `502/504` sağlayıcı hatası.

## Katalog (otomatik)

`app/catalog.json/route.ts` statik derlemede `docs/catalog.json` üretir.
Edge Function bu dosyayı (10 dk önbellekle) çekip sistem prompt'una ekler.

- Ürün ekle → `npm run build:static` → commit. **AI tarafında deploy gerekmez.**
- Katalog şu an **12 kategori / 84 ürün**; yanıttaki `catalogCount` alanı doğrular.
- Katalog adresi: `https://31madaracollet.github.io/IsikHolding/catalog.json`

## Bileşenler

| Dosya | Görev |
| --- | --- |
| `components/isik-ai/chat-widget.tsx` | Yüzen buton, sohbet paneli, öneri çipleri, ürün linkleri |
| `lib/isik-ai.ts` | Uç nokta, istek/yanıt tipleri, `askIsikAi()` |
| `components/site-chrome.tsx` | Widget'ı site kabuğuna bağlar |
| `app/catalog.json/route.ts` | AI'nın okuduğu makine okunur katalog |
| `supabase/functions/isik-ai/` | Sistem prompt'unun kopyası + deploy notları (asıl kaynak panel) |

## Secret'lar

Supabase → Project Settings → Edge Functions → Secrets:

| Ad | Değer |
| --- | --- |
| `GROQ_API_KEY` | Birincil Groq anahtarı |
| `GROQ_API_KEY_2` | Yedek anahtar (401/403/429/5xx durumunda otomatik denenir) |
| `GROQ_MODEL` | `openai/gpt-oss-120b` |

Model değiştirmek için sadece `GROQ_MODEL` güncellenir; fonksiyonu yeniden
deploy etmek gerekmez.

## Davranış kuralları (sistem prompt'u)

- Kimlik: "Ben Işık AI — Işık Holding'in aydınlatma, elektrik-elektronik ve enerji asistanıyım."
- İhtiyaca göre ürün bulur: oda/m² → lümen, 2700-3000K / 4000K / 6500K, E27-GU10
  duy tipi, bütçe filtresi. En fazla 3 ürün, her biri tek satır:
  `ad — fiyat — /urunler/slug — neden uygun`.
- Tesisat/teknik sorularda referans tabloları kullanır (kablo kesiti, otomat
  seçimi, kaçak akım, solar boyutlandırma).
- Haberlerde tarih + kaynak + başlık verir; eşleşme yoksa en güncel 3'ü söyler.
- Fiyat/stok/garanti uydurmaz; katalogda yoksa "kataloğumuzda bu ürün yok" der.
- Sipariş/iade sorularını `/iletisim` sayfasına yönlendirir.
- Üslup: en fazla 100 kelime, dolgu cümlesi ve emoji yok.

### Token bütçesi (önemli)

Groq ücretsiz katmanı model başına **8.000 token/dakika (TPM)** veriyor. v11'de
katalog tam (3 özellik + 2 avantaj) gönderiliyordu ve 84 üründe prompt ~9.500
token'a çıkıp **502** dönüyordu. v12'de katalog tek satıra indirildi
(`ad | fiyat | ilk özellik | slug`) ve prompt tabanı kısaltıldı → ~5.600 token.
Katalog büyürse önce `buildCatalogBlock()` çıktısını kısalt; yoksa TPM'e takılır.

## Sınırlar

- Saatlik **40 istek / IP** (fonksiyon içi bellek; yeniden başlatmada sıfırlanır).
- Son **8 mesaj** bağlam olarak gönderilir, mesaj başına **1.200 karakter**.
- Groq isteği **26 sn** sonra iptal edilir (`temperature 0.25`, `max_tokens 900`,
  `reasoning_effort: low`).
- Haber akışı 10 dk, katalog 10 dk önbelleklenir (Edge Function bellek içi).

## Test

```bash
curl -sS -X POST "https://<proje>.supabase.co/functions/v1/isik-ai" \
  -H "Content-Type: application/json" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <ANON_KEY>" \
  -d '{"messages":[{"role":"user","content":"5 m2 banyo icin hangi ampul? Butcem 150 TL."}]}'
```

Beklenen: `{"reply":"…","model":"openai/gpt-oss-120b","finish":"stop"}`.

## Anahtar rotasyonu

1. Groq panelinde yeni anahtar oluştur.
2. `GROQ_API_KEY_2` (veya `GROQ_API_KEY`) değerini güncelle.
3. Yukarıdaki `curl` testini tekrarla. Eski anahtarı devre dışı bırak.

> Not: anahtarlar bir noktada sohbet ekranında paylaşıldıysa **yayınlanmış**
> sayılır; üretimde kullanımdan önce yenilenmesi önerilir.

## Yeniden derleme (widget değişiklikleri)

```bash
npm run build:static     # docs/ üretir
git add docs && git commit && git push
```

GitHub Pages `main` dalının `/docs` klasörünü yayınlar; push sonrası site
otomatik güncellenir.
