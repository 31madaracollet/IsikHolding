"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  variant = "dark",
  source = "footer",
  className,
}: {
  variant?: "dark" | "light" | "inline";
  source?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, website: honeypot }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Bir hata oluştu.");
      setState("done");
      setMessage(data.message ?? "Aramıza hoş geldiniz!");
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Bir hata oluştu.");
    }
  }

  if (state === "done") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl p-4",
          variant === "dark" ? "bg-white/10 text-white" : "bg-brand-50 text-ink",
          className,
        )}
      >
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" />
        <div>
          <p className="text-sm font-semibold">Kaydınız alındı.</p>
          <p className="mt-0.5 text-xs opacity-70">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col gap-2 sm:flex-row",
          variant === "inline" && "sm:gap-2",
        )}
      >
        <label className="sr-only" htmlFor={`newsletter-email-${source}`}>
          E-posta adresiniz
        </label>
        <input
          id={`newsletter-email-${source}`}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-posta adresiniz"
          autoComplete="email"
          className={cn(
            "w-full rounded-full border px-4 py-3 text-sm outline-none transition",
            variant === "dark"
              ? "border-white/15 bg-white/[0.06] text-white placeholder:text-white/35 focus:border-brand focus:ring-4 focus:ring-brand/20"
              : "border-ink/10 bg-white text-ink placeholder:text-ink/35 focus:border-brand-500 focus:ring-4 focus:ring-brand/20",
          )}
        />
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition disabled:opacity-70",
            variant === "dark"
              ? "bg-brand text-ink hover:bg-brand-300"
              : "bg-ink text-white hover:bg-ink-soft",
          )}
        >
          {state === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Abone ol <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-xs font-medium text-red-400">{message}</p>
      )}
      <p
        className={cn(
          "mt-2.5 text-[10.5px] leading-relaxed",
          variant === "dark" ? "text-white/40" : "text-ink/40",
        )}
      >
        Ayda en fazla 2 e-posta. İstediğiniz zaman tek tıkla çıkabilirsiniz.
        Kaydolarak{" "}
        <a
          href="/politikalar#gizlilik"
          className={cn(
            "underline underline-offset-2",
            variant === "dark" ? "hover:text-white" : "hover:text-ink",
          )}
        >
          gizlilik politikamızı
        </a>{" "}
        kabul etmiş olursunuz.
      </p>
    </form>
  );
}
