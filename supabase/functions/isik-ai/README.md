# `isik-ai` Edge Function

Sitedeki "Işık AI" sohbet balonunun arka ucu. Tek sorumluluğu var: ürün/haber
sorularını yanıtlamak, konu dışını reddetmek.

> **Kaynak:** fonksiyonun gövdesi Supabase panelinde tutulur (v11). Bu klasör
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
| 200 | `{ "reply": string, "model": string, "finish": string }` |
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
