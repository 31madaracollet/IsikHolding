"use client";

import { useEffect, useState } from "react";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { IsikAiWidget } from "@/components/isik-ai/chat-widget";
import { getCurrentAdmin } from "@/lib/admin/client-auth";
import { getSupabaseAuthClient } from "@/lib/supabase/auth-client";
import { STATIC_EXPORT } from "@/lib/mode";

type Admin = { name: string; email: string } | null;

/**
 * Site kabuğu (sepet + header + footer).
 *
 * Statik dağıtımda yönetici oturumu Supabase Auth'tan, sunucu dağıtımında
 * imzalı çerezden (`/api/auth/session`) okunur. Böylece "Yönetim" sekmesi
 * yalnızca Akif Işık oturumu açıkken görünür.
 */
export function SiteChrome({
  children,
  initialAdmin,
}: {
  children: React.ReactNode;
  initialAdmin: Admin;
}) {
  const [admin, setAdmin] = useState<Admin>(initialAdmin);

  useEffect(() => {
    let alive = true;

    if (STATIC_EXPORT) {
      const client = getSupabaseAuthClient();
      if (!client) return;

      getCurrentAdmin().then((value) => {
        if (alive) setAdmin(value);
      });

      const { data } = client.auth.onAuthStateChange(() => {
        getCurrentAdmin().then((value) => {
          if (alive) setAdmin(value);
        });
      });

      return () => {
        alive = false;
        data.subscription.unsubscribe();
      };
    }

    if (!initialAdmin) {
      fetch("/api/auth/session", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((payload) => {
          if (alive && payload?.authenticated && payload.admin) {
            setAdmin(payload.admin as Admin);
          }
        })
        .catch(() => {});
    }

    return () => {
      alive = false;
    };
  }, [initialAdmin]);

  return (
    <CartProvider>
      <SiteHeader admin={admin} />
      <main id="main">{children}</main>
      <SiteFooter admin={admin} />
      <IsikAiWidget />
    </CartProvider>
  );
}
