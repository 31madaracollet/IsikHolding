import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { fallbackResponse, isNetworkError } from "@/lib/network";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = rateLimit(`newsletter:${clientIp(request)}`, 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();

    if (typeof body?.website === "string" && body.website.length > 0) {
      return NextResponse.json({ ok: true, persistence: "demo" });
    }

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Geçerli bir e-posta girin." },
        { status: 400 },
      );
    }

    const { email, source } = parsed.data;
    const normalized = email.toLocaleLowerCase("tr-TR");
    const supabase = getSupabaseAdmin();
    let persistence: "supabase" | "demo" = "demo";

    if (supabase) {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: normalized,
        source: source ?? "website",
        confirmed: true,
      });
      if (error) {
        if (error.code === "23505") {
          return NextResponse.json({
            ok: true,
            persistence: "supabase",
            message: "Bu e-posta zaten bültenimize kayıtlı. Teşekkürler!",
          });
        }
        console.error("[newsletter] Supabase insert failed:", error.message);
        if (isNetworkError(error)) {
          return NextResponse.json(
            fallbackResponse("Sunucu Supabase'e ulaşamadı."),
            { status: 503 },
          );
        }
      } else {
        persistence = "supabase";
      }
    } else {
      return NextResponse.json(
        fallbackResponse("Sunucu tarafı Supabase yapılandırılmadı."),
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      persistence,
      message: "Işık Bülten'e hoş geldiniz! İlk indirim kodunuz: ISIK15",
    });
  } catch (error) {
    console.error("[newsletter] unexpected error:", error);
    return NextResponse.json(
      { error: "Kayıt alınamadı. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
