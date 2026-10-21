# `isik-ai` Edge Function

Sitedeki "Işık AI" sohbet balonunun arka ucu: ürün/fiyat, ürün seçimi, tesisat ve
elektrik-elektronik/enerji bilgisi, canlı haber akışı. Yalnızca siyaset, spor,
magazin, hukuk/tıp/yatırım tavsiyesi, kod/ödev ve rakip önerisi reddedilir.

> **Kaynak:** fonksiyonun gövdesi Supabase panelinde tutulur (v12). Bu klasör
> yalnızca dokümantasyon ve deploy notları içindir; kodu indirmek için:
>
> ```bash
> supabase functions download isik-ai
> ```

## Gerekli secret'lar

```bash
supabase secrets set \
  GROQ_API_KEY=gsk_... \
  GROQ_API_KEY_2=gsk_... \
  GROQ_MODEL=openai/gpt-oss-120b
```

## Deploy

```bash
supabase functions deploy isik-ai --no-verify-jwt=false
```

`verify_jwt` **açık** kalmalı: istemci herkese açık anon key ile çağırır, Groq
anahtarı yalnızca fonksiyonun içinde okunur.

## Sözleşme

```http
POST /functions/v1/isik-ai
Content-Type: application/json
apikey: <anon>
Authorization: Bearer <anon>

{ "messages": [ { "role": "user", "content": "…" } ] }
```

| Durum | Gövde |
| --- | --- |
| 200 | `{ "reply", "model", "finish", "newsCount", "newsLive", "catalogCount" }` |
| 400 | `{ "error": "Mesaj boş olamaz." }` |
| 405 | `{ "error": "Yalnızca POST destekleniyor." }` |
| 429 | `{ "error": "Çok fazla soru sordun…" }` |
| 502 / 504 | `{ "error": "Işık AI şu an yanıt veremiyor…" }` |

CORS: `Access-Control-Allow-Origin: *`, `OPTIONS` → 200.

## Sistem prompt'u

Prompt gövdesi fonksiyonun içindeki `SYSTEM_PROMPT` sabitinde. Bölümleri:

- **KİMLİK** — Işık AI, Işık Holding'in ürün ve haber asistanı.
- **GÖREVLERİN** — ürün tanıt, ihtiyaca göre ürün bul, haber/duyuru tanıt, karşılaştır.
- **İHTİYACA GÖRE SEÇİM KURALLARI** — lümen/renk sıcaklığı/duy tipi/bütçe eşlemesi.
- **SINIRLAR** — konu dışı reddi, fiyat uydurmama, sipariş-iade yönlendirmesi.
- **ÜSLUP** — ≤90 kelime, dolgu yok, emoji yok.
- **HABERLER / DUYURULAR** — güncel içerik özeti.

**Katalog artık gömülü değil:** fonksiyon `catalog.json` dosyasını siteden
10 dakikalık önbellekle çeker. Ürün eklemek/düzenlemek için yalnızca
`lib/products.ts` güncellenip site yeniden derlenir; Edge Function deploy
edilmez.

## v12 notları

- Katalog `https://31madaracollet.github.io/IsikHolding/catalog.json` adresinden
  10 dk önbellekle çekilir (şu an 12 kategori / 84 ürün).
- Prompt 8.000 TPM limitine göre sıkıştırıldı: katalog tek satır
  `ad | fiyat | ilk özellik | /urunler/slug`. Katalog büyürse bu format korunmalı.
- 8 RSS akışı (Donanım Haber, Webtekno, ShiftDelete, Webrazzi, Technopat, Log,
  Habertürk Teknoloji, Enerji Günlüğü) paralel çekilir, 12 haber seçilir.
- Sağlayıcı 401/403/429/5xx dönerse `GROQ_API_KEY_2` otomatik denenir.

## v11 → v12 kök neden

v11 tam katalogla ~9.500 token gönderiyordu; Groq ücretsiz katmanı model başına
8.000 TPM olduğu için istekler 502 ile düşüyordu. Katalog satırı kısaltılıp
prompt tabanı sadeleştirilince ~5.600 token'a indi.
