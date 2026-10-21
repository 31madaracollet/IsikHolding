"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, ShieldCheck, User } from "lucide-react";
import { getCurrentAdmin, signInAdmin } from "@/lib/admin/client-auth";
import { STATIC_EXPORT } from "@/lib/mode";

export function LoginForm({ next: nextProp }: { next: string }) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  // Statik dağıtımda oturum Supabase Auth'ta tutulur; zaten açıksa panele geç.
  useEffect(() => {
    if (!STATIC_EXPORT) return;
    let alive = true;
    getCurrentAdmin().then((admin) => {
      if (alive && admin) router.replace(nextProp);
    });
    return () => {
      alive = false;
    };
  }, [router, nextProp]);

  function resolveNext() {
    if (typeof window === "undefined") return nextProp;
    const requested = new URLSearchParams(window.location.search).get("next");
    return requested && requested.startsWith("/admin") ? requested : "/admin";
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");

    try {
      if (STATIC_EXPORT) {
        await signInAdmin(identifier, password);
        // Tam sayfa geçişi: panel kabuğu Supabase oturumunu yeniden okur.
        window.location.assign(resolveNext());
        return;
      }
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Giriş yapılamadı.",
        );
      }
      router.replace(resolveNext());
      router.refresh();
    } catch (submitError) {
      setState("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Giriş yapılamadı. Lütfen tekrar deneyin.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="login-identifier">
          Kullanıcı
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/30" />
          <input
            id="login-identifier"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
            autoComplete="username"
            autoFocus
            placeholder="Akif Işık veya akif@isikholding.com"
            className="input !pl-11"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="login-password">
          Şifre
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/30" />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="input !pl-11 !pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-ink/35 transition hover:bg-ink/5 hover:text-ink"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {state === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-[11.5px] font-medium text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12.5px] font-bold text-white transition hover:bg-ink-soft disabled:opacity-60"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Giriş yapılıyor…
          </>
        ) : (
          <>
            Yönetim paneline gir
            <ArrowRight className="size-4 text-brand" />
          </>
        )}
      </button>

      <p className="flex items-start gap-2 rounded-xl bg-cream px-3 py-2.5 text-[10px] leading-relaxed text-ink/45">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
        Bu alan yalnızca yetkili kullanıcılar içindir. Oturum, HttpOnly ve imzalı
        çerez ile 7 gün boyunca korunur.
      </p>
    </form>
  );
}
