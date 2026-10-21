# Işık AI — kurulum ve bakım notları

Site üzerindeki yapay zekâ asistanı. **Yalnızca** Işık Holding ürünleri, fiyatları,
kargo/kupon kuralları ve haberleri hakkında cevap verir; konu dışı soruları tek
cümleyle reddeder.

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

- Kimlik: "Ben Işık AI — Işık Holding'in ürün ve haber asistanıyım."
- İhtiyaca göre ürün bulur: oda/m² → lümen, 2700-3000K / 4000K / 6500K, E27-GU10
  duy tipi, bütçe filtresi. En fazla 3 ürün, her biri tek satır:
  `ad — fiyat — /urunler/slug — neden uygun`.
- Haberlerde tarih + başlık + tek cümle özet + kaynak verir.
- Fiyat/stok/garanti uydurmaz; katalogda yoksa "kataloğumuzda bu ürün yok" der.
- Sipariş/iade sorularını `/iletisim` sayfasına yönlendirir.
- Üslup: en fazla 90 kelime, dolgu cümlesi ve emoji yok.

## Sınırlar

- Saatlik **40 istek / IP** (fonksiyon içi bellek; yeniden başlatmada sıfırlanır).
- Son **8 mesaj** bağlam olarak gönderilir, mesaj başına **1.200 karakter**.
- Groq isteği **24 sn** sonra iptal edilir (`temperature 0.2`, `max_tokens 1400`,
  `reasoning_effort: low`).

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
