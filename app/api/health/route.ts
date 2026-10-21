import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Ortam sağlık kontrolü.
 * Anahtar değerleri asla döndürülmez; yalnızca yapılandırma ve erişilebilirlik.
 */
export async function GET() {
  const configured = isSupabaseConfigured();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let reachable = false;
  let latencyMs: number | null = null;
  let detail = "Supabase yapılandırılmadı.";

  if (configured && url) {
    const startedAt = Date.now();
    try {
      const response = await fetch(`${url}/rest/v1/coupons?select=code&limit=1`, {
        headers: {
          apikey: anonKey ?? "",
          Authorization: `Bearer ${anonKey ?? ""}`,
        },
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      });
      reachable = response.ok;
      detail = reachable ? "Supabase REST erişilebilir." : `REST ${response.status}`;
    } catch (error) {
      detail =
        error instanceof Error
          ? `Sunucu Supabase'e ulaşamıyor (${error.message}). Tarayıcı köprüsü kullanılabilir.`
          : "Sunucu Supabase'e ulaşamıyor.";
    } finally {
      latencyMs = Date.now() - startedAt;
    }
  }

  return NextResponse.json(
    {
      ok: true,
      supabase: { configured, reachable, latencyMs, detail },
      updatedAt: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
