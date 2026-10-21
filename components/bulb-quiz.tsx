"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Lightbulb, RotateCcw } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { products } from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";
import { asset } from "@/lib/mode";

type Scores = Record<string, number>;

interface Option {
  label: string;
  scores: Scores;
}

interface Question {
  title: string;
  hint: string;
  options: Option[];
}

const questions: Question[] = [
  {
    title: "Işığı nerede kullanacaksınız?",
    hint: "Mekânı seçin; ihtiyacınız olan lümen ve açıyı buna göre belirleyelim.",
    options: [
      { label: "Salon / geniş yaşam alanı", scores: { "isik-pro-led-14w-3lu": 3, "isik-eco-led-9w": 1 } },
      { label: "Yatak odası / çalışma odası", scores: { "isik-eco-led-9w": 3, "kubbe-masa-lambasi": 1 } },
      { label: "Kafe, restoran veya dekor", scores: { "edison-filament-6w": 3, "nordik-sarkit-avize": 2 } },
      { label: "Bahçe / dış mekân", scores: { "solar-projektor-100w": 4 } },
      { label: "Ofis / mağaza / depo", scores: { "ultra-slim-led-panel-60x60": 3, "highbay-150w": 2 } },
    ],
  },
  {
    title: "Nasıl kontrol etmek istersiniz?",
    hint: "Kullanım alışkanlığınız doğru ürünü belirlemenin en hızlı yoludur.",
    options: [
      { label: "Telefonumdan, sesle ve programla", scores: { "isik-smart-rgbw": 4, "isik-smart-sensor-9w": 1 } },
      { label: "Hareket edince kendi açılsın", scores: { "isik-smart-sensor-9w": 4 } },
      { label: "Sadece düğmeyle, karmaşasız", scores: { "isik-eco-led-9w": 2, "isik-pro-led-14w-3lu": 2 } },
      { label: "Profesyonel proje / yüksek tavan", scores: { "highbay-150w": 3, "ultra-slim-led-panel-60x60": 2 } },
    ],
  },
  {
    title: "Nasıl bir ışık tonu seviyorsunuz?",
    hint: "Renk sıcaklığı, mekânın hissini en çok değiştiren detaydır.",
    options: [
      { label: "Sıcak ve samimi (2700K–3000K)", scores: { "edison-filament-6w": 3, "nordik-sarkit-avize": 1 } },
      { label: "Doğal beyaz (4000K)", scores: { "isik-pro-led-14w-3lu": 2, "isik-eco-led-9w": 2, "ultra-slim-led-panel-60x60": 1 } },
      { label: "Serin ve net (5000K–6500K)", scores: { "ultra-slim-led-panel-60x60": 2, "highbay-150w": 2, "isik-pro-led-14w-3lu": 1 } },
      { label: "Renkli ve değişken", scores: { "isik-smart-rgbw": 4 } },
    ],
  },
];

export function BulbQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const { add } = useCart();

  const result = useMemo(() => {
    if (answers.length < questions.length) return null;
    const scores: Scores = {};
    answers.forEach((optionIndex, questionIndex) => {
      const option = questions[questionIndex].options[optionIndex];
      Object.entries(option.scores).forEach(([slug, score]) => {
        scores[slug] = (scores[slug] ?? 0) + score;
      });
    });
    const bestSlug = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
    return products.find((product) => product.slug === bestSlug) ?? products[0];
  }, [answers]);

  const isDone = result !== null;
  const current = questions[step];

  function choose(optionIndex: number) {
    const next = answers.slice(0, step);
    next[step] = optionIndex;
    setAnswers(next);
    if (step < questions.length - 1) {
      window.setTimeout(() => setStep(step + 1), 180);
    } else {
      window.setTimeout(() => setStep(questions.length), 180);
    }
  }

  function reset() {
    setAnswers([]);
    setStep(0);
  }

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-ink p-6 text-white sm:p-9">
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,200,0,.55), transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 dot-grid opacity-[0.06]"
        aria-hidden="true"
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300">
            <Lightbulb className="size-3.5" />
            Işık Asistanı
          </span>

          {!isDone ? (
            <div className="mt-5">
              <div className="flex items-center gap-2">
                {questions.map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-500",
                      index < answers.length
                        ? "bg-brand"
                        : index === step
                          ? "bg-brand/50"
                          : "bg-white/10",
                    )}
                  />
                ))}
                <span className="ml-2 text-[10px] font-bold text-white/40">
                  {step + 1}/{questions.length}
                </span>
              </div>

              <h3 className="mt-5 font-display text-[24px] font-semibold leading-tight sm:text-[30px]">
                {current.title}
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-white/45">
                {current.hint}
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {current.options.map((option, index) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => choose(index)}
                    className={cn(
                      "group flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left text-[12px] font-medium transition",
                      answers[step] === index
                        ? "border-brand bg-brand text-ink"
                        : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25 hover:bg-white/[0.08]",
                    )}
                  >
                    {option.label}
                    <ArrowRight
                      className={cn(
                        "size-3.5 shrink-0 opacity-0 transition group-hover:opacity-100",
                        answers[step] === index && "opacity-100",
                      )}
                    />
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/40 transition hover:text-white"
                >
                  <ArrowLeft className="size-3.5" />
                  Önceki soru
                </button>
              )}
            </div>
          ) : (
            <div className="mt-5 animate-rise">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-300">
                Size en uygun ürün
              </p>
              <h3 className="mt-2 font-display text-[26px] font-semibold leading-tight sm:text-[32px]">
                {result.name}
              </h3>
              <p className="mt-2.5 max-w-md text-[12.5px] leading-relaxed text-white/50">
                {result.shortDescription}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => add(result.slug)}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-[12px] font-bold text-ink transition hover:bg-brand-300"
                >
                  <Check className="size-4" />
                  Sepete ekle · {formatPrice(result.price)}
                </button>
                <Link
                  href={`/urunler/${result.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[12px] font-bold transition hover:border-white/40"
                >
                  Ürün detayı
                  <ArrowRight className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 px-2 py-3 text-[11px] font-semibold text-white/40 transition hover:text-white"
                >
                  <RotateCcw className="size-3.5" />
                  Baştan dene
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-[280px]">
          <div className="absolute inset-6 rounded-full bg-brand/25 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(isDone ? result.image : questions[step] ? "/images/product-smart.jpg" : "/images/hero-bulb.jpg")}
              alt={isDone ? result.name : "Işık asistanı"}
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <div className="flex items-center justify-between px-1.5 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                {isDone ? "Eşleşme tamam" : "3 soru · 30 saniye"}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-brand-300">
                <Check className="size-3" />
                Ücretsiz
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
