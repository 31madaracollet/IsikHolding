"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, SendHorizonal, Sparkles, X } from "lucide-react";
import {
  askIsikAi,
  ISIK_AI_ENABLED,
  IsikAiError,
  type IsikAiMessage,
} from "@/lib/isik-ai";
import { getProduct } from "@/lib/products";
import { cn } from "@/lib/utils";

const GREETING =
  "Merhaba, ben Işık AI. Işık Holding'in ürün ve haber asistanıyım — ampuller, aydınlatma ürünleri, fiyatlar, kargo ve güncel sektör haberleri hakkında sorabilirsin.";

const SUGGESTIONS = [
  "Salonum için hangi ampul uygun?",
  "Kargo ücreti ne kadar?",
  "Kampanya veya kupon var mı?",
  "Son haberleri özetle",
];

type ChatEntry = IsikAiMessage & { id: number };

let nextId = 1;

function splitProductLinks(content: string) {
  const slugs: string[] = [];
  const text = content
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\/urunler\/([a-z0-9-]+)/gi, (_match, slug: string) => {
      const clean = slug.toLowerCase();
      if (!slugs.includes(clean)) slugs.push(clean);
      return "";
    })
    .replace(/[ \t]*[—–-][ \t]*(?=\n|$)/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { text, slugs };
}

export function IsikAiWidget() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, pending, error]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || pending || !ISIK_AI_ENABLED) return;

      const userEntry: ChatEntry = { id: nextId++, role: "user", content: text };
      const history = [...entries, userEntry];

      setEntries(history);
      setInput("");
      setError(null);
      setPending(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const reply = await askIsikAi(
          [
            { role: "assistant", content: GREETING },
            ...history.map(({ role, content }): IsikAiMessage => ({ role, content })),
          ],
          controller.signal,
        );
        setEntries((current) => [...current, { id: nextId++, role: "assistant", content: reply }]);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        setError(
          caught instanceof IsikAiError
            ? caught.message
            : "Işık AI şu an yanıt veremiyor, birazdan tekrar dene.",
        );
      } finally {
        abortRef.current = null;
        setPending(false);
      }
    },
    [entries, pending],
  );

  const online = ISIK_AI_ENABLED;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-end px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="pointer-events-auto flex w-full max-w-[24rem] flex-col items-end gap-3">
        {open ? (
          <section
            id="isik-ai-panel"
            role="dialog"
            aria-label="Işık AI sohbet"
            className="flex h-[min(72vh,34rem)] w-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-soft motion-safe:animate-rise"
          >
            <header className="relative flex items-center gap-3 overflow-hidden bg-ink px-4 py-3.5 text-white">
              <div
                className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-brand/30 blur-2xl"
                aria-hidden="true"
              />
              <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-brand text-ink">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <div className="relative min-w-0 flex-1">
                <p className="font-display text-sm font-semibold leading-tight">Işık AI</p>
                <p className="truncate text-[11px] text-white/60">
                  {online ? "Ürün ve haber asistanı" : "Şu an çevrimdışı"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative grid size-8 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Sohbeti kapat"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            <div
              ref={listRef}
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto bg-cream px-4 py-4"
            >
              <Bubble role="assistant" content={GREETING} />

              {entries.map((entry) => (
                <Bubble key={entry.id} role={entry.role} content={entry.content} />
              ))}

              {pending ? (
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-brand/20 text-ink">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 ring-1 ring-ink/[0.06]">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="size-1.5 animate-bounce rounded-full bg-ink/30"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </span>
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl bg-red-50 px-3.5 py-3 text-[12px] leading-relaxed text-red-700 ring-1 ring-red-100">
                  {error}
                </div>
              ) : null}

              {entries.length === 0 && !pending ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void send(suggestion)}
                      className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-ink/70 ring-1 ring-ink/10 transition hover:bg-brand-50 hover:text-ink"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void send(input);
              }}
              className="border-t border-ink/[0.06] bg-white px-3 pb-3 pt-2.5"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-ink/10 bg-cream px-3 py-2 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand/20">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void send(input);
                    }
                  }}
                  rows={1}
                  maxLength={600}
                  disabled={!online}
                  placeholder={online ? "Ürün veya haber sor…" : "Işık AI şu an çevrimdışı"}
                  aria-label="Işık AI'ya mesajın"
                  className="max-h-24 min-h-6 flex-1 resize-none bg-transparent text-sm text-ink placeholder:text-ink/35 focus:outline-none disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!online || pending || input.trim().length === 0}
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-ink transition hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Gönder"
                >
                  <SendHorizonal className="size-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-1.5 px-1 text-[10px] leading-snug text-ink/40">
                Yanıtlar Işık Holding kataloğu ve haberlerine dayanır. Fiyatlar bilgilendirme
                amaçlıdır.
              </p>
            </form>
          </section>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="isik-ai-panel"
          className={cn(
            "group flex items-center gap-2.5 rounded-full bg-brand py-3 pl-3 pr-4 text-ink shadow-glow transition duration-300 hover:-translate-y-0.5 hover:bg-brand-300",
            "ring-1 ring-ink/10",
          )}
        >
          <span className="grid size-8 place-items-center rounded-full bg-ink text-brand">
            {open ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <MessageCircle className="size-4" aria-hidden="true" />
            )}
          </span>
          <span className="text-left leading-tight">
            <span className="block font-display text-sm font-semibold">Işık AI</span>
            <span className="block text-[10px] font-medium text-ink/60">
              {open ? "Kapat" : "Ürün ve haber asistanı"}
            </span>
          </span>
          {!open ? (
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-ink/40" />
              <span className="relative inline-flex size-2 rounded-full bg-ink" />
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  const { text, slugs } = splitProductLinks(content);

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
          isUser
            ? "rounded-br-md bg-brand text-ink"
            : "rounded-bl-md bg-white text-ink/80 ring-1 ring-ink/[0.06]",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>

        {slugs.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {slugs.map((slug) => {
              const product = getProduct(slug);
              return (
                <Link
                  key={slug}
                  href={`/urunler/${slug}`}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-brand-200 transition hover:bg-brand-100"
                >
                  {product ? product.name : "Ürünü gör"}
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
