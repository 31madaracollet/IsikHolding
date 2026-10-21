import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = rateLimit(`contact:${clientIp(request)}`, 6, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen bir dakika sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  try {
    const body = await request.json();

    // Bot tuzağı: gizli alan doldurulduysa sessizce başarı dön.
    if (typeof body?.website === "string" && body.website.length > 0) {
      return NextResponse.json({ ok: true, persistence: "demo" });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Form bilgileri geçersiz." },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const reference = `MSG-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const supabase = getSupabaseAdmin();
    let persistence: "supabase" | "demo" = "demo";

    if (supabase) {
      const { error } = await supabase.from("contact_messages").insert({
        reference,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        user_agent: request.headers.get("user-agent")?.slice(0, 400) ?? null,
      });
      if (error) {
        console.error("[contact] Supabase insert failed:", error.message);
      } else {
        persistence = "supabase";
      }
    }

    return NextResponse.json({ ok: true, reference, persistence });
  } catch (error) {
    console.error("[contact] unexpected error:", error);
    return NextResponse.json(
      { error: "Mesajınız alınamadı. Lütfen daha sonra tekrar deneyin." },
      { status: 500 },
    );
  }
}
