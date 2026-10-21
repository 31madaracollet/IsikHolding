import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  adminIdentity,
  createSessionToken,
  isAdminAuthConfigured,
  verifyCredentials,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = rateLimit(`login:${clientIp(request)}`, 6, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla giriş denemesi. Lütfen bir dakika sonra tekrar deneyin." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Yönetici girişi yapılandırılmamış (ADMIN_PASSWORD eksik). Sunucu ortam değişkenlerini kontrol edin.",
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const identifier = typeof body?.identifier === "string" ? body.identifier : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!identifier.trim() || !password) {
      return NextResponse.json(
        { error: "Kullanıcı adı ve şifre gerekli." },
        { status: 400 },
      );
    }

    const session = verifyCredentials(identifier, password);
    if (!session) {
      return NextResponse.json(
        { error: "Kullanıcı adı veya şifre hatalı." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      ok: true,
      admin: { name: session.name, email: session.email },
    });
    response.cookies.set(
      ADMIN_COOKIE,
      createSessionToken({ name: session.name, email: session.email }),
      adminCookieOptions(),
    );
    return response;
  } catch (error) {
    console.error("[auth] giriş hatası:", error);
    return NextResponse.json(
      { error: "Giriş yapılamadı. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}

export async function GET() {
  const identity = adminIdentity();
  return NextResponse.json({
    configured: isAdminAuthConfigured(),
    name: identity.name,
    email: identity.email,
  });
}
