"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  getCurrentAdmin,
  type AdminIdentity,
} from "@/lib/admin/client-auth";
import { getSupabaseAuthClient } from "@/lib/supabase/auth-client";

/**
 * Statik dağıtımda panel kabuğu. Oturum Supabase Auth'tan okunur; oturum
 * yoksa /admin/giris'e yönlendirilir. Veri erişimi ayrıca RLS ile korunur.
 */
export function StaticAdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);

  useEffect(() => {
    let alive = true;
    const client = getSupabaseAuthClient();

    getCurrentAdmin()
      .then((value) => {
        if (!alive) return;
        if (!value) {
          router.replace("/admin/giris");
          return;
        }
        setAdmin(value);
      })
      .catch(() => {
        if (alive) router.replace("/admin/giris");
      });

    const subscription = client?.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      if (!session) {
        router.replace("/admin/giris");
      }
    });

    return () => {
      alive = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, [router]);

  if (!admin) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <Loader2 className="size-6 animate-spin text-ink/30" />
        <span className="sr-only">Oturum kontrol ediliyor</span>
      </div>
    );
  }

  return <AdminShell name={admin.name}>{children}</AdminShell>;
}
