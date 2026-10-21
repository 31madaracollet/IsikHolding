"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";
import { submitContactViaBrowser } from "@/lib/supabase/fallback";
import { asset, STATIC_EXPORT } from "@/lib/mode";

const subjects = [
  "Genel bilgi",
  "Satış & sipariş",
  "Toptan & bayilik",
  "Proje danışmanlığı",
  "Teknik destek",
  "Kariyer",
] as const;

const subjectByQuery: Record<string, (typeof subjects)[number]> = {
  satis: "Satış & sipariş",
  siparis: "Satış & sipariş",
  toptan: "Toptan & bayilik",
  bayi: "Toptan & bayilik",
  proje: "Proje danışmanlığı",
  destek: "Teknik destek",
  kariyer: "Kariyer",
};

export function ContactForm({
  defaultSubject = "Genel bilgi",
}: {
  defaultSubject?: (typeof subjects)[number];
}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>(defaultSubject);

  // `?konu=bayi` gibi bağlantılarda konu alanını önceden seç.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("konu");
    if (requested && subjectByQuery[requested]) {
      setSubject(subjectByQuery[requested]);
    }
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      consent: formData.get("consent") === "on",
      website: String(formData.get("website") ?? ""),
    };
    setState("loading");
    setMessage("");

    try {
      if (STATIC_EXPORT) {
        if (payload.website.trim()) {
          setState("done");
          return;
        }
        const bridged = await submitContactViaBrowser(payload);
        if (!bridged) throw new Error("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
        setReference(bridged.reference);
        setState("done");
        form.reset();
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        // Sunucu Supabase'e ulaşamıyorsa tarayıcı köprüsüyle (RLS korumalı)
        // doğrudan Supabase'e yaz.
        if (data?.fallback) {
          const bridged = await submitContactViaBrowser(payload);
          if (bridged) {
            setReference(bridged.reference);
            setState("done");
            form.reset();
            return;
          }
        }
        throw new Error(
          typeof data.error === "string" ? data.error : "Mesaj gönderilemedi.",
        );
      }
      setReference(data.reference ?? null);
      setState("done");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
      );
    }
  }

  if (state === "done") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-ink/[0.08] bg-white p-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand">
          <CheckCircle2 className="size-8" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold">Mesajınız bize ulaştı</h3>
        <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ink/55">
          Uzman ekibimiz en geç 1 iş günü içinde size dönüş yapacak. Acil
          durumlar için {""}
          <a href="tel:+902129094040" className="font-semibold text-ink underline underline-offset-2">
            0212 909 40 40
          </a>{" "}
          numaralı hattımızı arayabilirsiniz.
        </p>
        {reference && (
          <p className="mt-4 rounded-full bg-ink/[0.04] px-4 py-2 text-[11px] font-semibold text-ink/50">
            Talep numaranız: {reference}
          </p>
        )}
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[12px] font-bold text-white transition hover:bg-ink-soft"
        >
          Yeni mesaj gönder
          <ArrowRight className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-ink/[0.08] bg-white p-6 sm:p-7"
    >
      <h3 className="font-display text-[22px] font-semibold">Bize yazın</h3>
      <p className="mt-1 text-[12px] text-ink/45">
        Formu doldurun, doğru ekiple eşleştirelim.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="contact-name">
            Ad soyad *
          </label>
          <input
            id="contact-name"
            name="name"
            required
            minLength={2}
            autoComplete="name"
            className="input"
            placeholder="Adınız ve soyadınız"
          />
        </div>
        <div>
          <label className="label" htmlFor="contact-email">
            E-posta *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input"
            placeholder="ornek@firma.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="contact-phone">
            Telefon
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="input"
            placeholder="05xx xxx xx xx"
          />
        </div>
        <div>
          <label className="label" htmlFor="contact-subject">
            Konu *
          </label>
          <select
            id="contact-subject"
            name="subject"
            required
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="input appearance-none"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="label" htmlFor="contact-message">
          Mesajınız *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={5}
          className="input resize-none"
          placeholder="Projeniz, ürün veya siparişiniz hakkında kısa bilgi verin…"
        />
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <label className="mt-4 flex items-start gap-2.5 text-[11px] leading-relaxed text-ink/50">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 rounded border-ink/20 accent-[#121212]"
        />
        <span>
          Kişisel verilerimin, talebimin değerlendirilmesi amacıyla işlenmesini
          kabul ediyorum.{" "}
          <a href={asset("/politikalar#kvkk")} className="underline underline-offset-2 hover:text-ink">
            KVKK aydınlatma metni
          </a>
        </span>
      </label>

      {state === "error" && (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[11.5px] font-medium text-red-700">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12.5px] font-bold text-white transition hover:bg-ink-soft disabled:opacity-60"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Gönderiliyor…
          </>
        ) : (
          <>
            Mesajı gönder <Send className="size-4 text-brand" />
          </>
        )}
      </button>
    </form>
  );
}
