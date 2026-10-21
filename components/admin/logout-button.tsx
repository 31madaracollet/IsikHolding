"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  label = "Çıkış",
  compact = false,
  tone = "default",
}: {
  className?: string;
  label?: string;
  compact?: boolean;
  tone?: "default" | "dark";
}) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/");
      router.refresh();
    }
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Oturumu kapat"
        title="Oturumu kapat"
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full border transition",
          tone === "dark"
            ? "border-white/15 text-white/60 hover:border-white/40 hover:bg-white/10 hover:text-white"
            : "border-ink/10 text-ink/50 hover:border-red-200 hover:bg-red-50 hover:text-red-600",
          className,
        )}
      >
        <LogOut className="size-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-4 py-2.5 text-[11.5px] font-bold text-ink/70 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600",
        className,
      )}
    >
      <LogOut className="size-3.5" />
      {label}
    </button>
  );
}
