import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { ADMIN_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth-constants";

export { ADMIN_COOKIE, SESSION_TTL_SECONDS };
const DEV_SECRET = "isik-holding-dev-secret-please-change-in-production";

export interface AdminSession {
  name: string;
  email: string;
  role: "admin";
  exp: number;
}

function getSecret() {
  return process.env.AUTH_SECRET?.trim() || DEV_SECRET;
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(input: { name: string; email: string }) {
  const session: AdminSession = {
    name: input.name,
    email: input.email,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (provided.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(provided, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;
    if (parsed.role !== "admin") return null;
    if (!parsed.exp || parsed.exp * 1000 < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

/** Türkçe karakterleri sadeleştirip karşılaştırma için normalize eder. */
export function normalizeTr(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/\s+/g, " ");
}

function safeEqual(a: string, b: string) {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export function adminIdentity() {
  return {
    name: process.env.ADMIN_NAME?.trim() || "Akif Işık",
    email: process.env.ADMIN_EMAIL?.trim() || "akif@isikholding.com",
  };
}

export function isAdminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

/**
 * Kullanıcı adı (ad soyad) veya e-posta ile giriş.
 * "Akif Işık" yazımı Türkçe karakter farklarından bağımsız eşleşir.
 */
export function verifyCredentials(
  identifier: string,
  password: string,
): AdminSession | null {
  const configuredPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!configuredPassword) return null;

  const { name, email } = adminIdentity();
  const normalizedIdentifier = normalizeTr(identifier);
  const identityMatches =
    normalizedIdentifier === normalizeTr(name) ||
    normalizedIdentifier === normalizeTr(email) ||
    normalizedIdentifier === normalizeTr(email.split("@")[0] ?? "");

  if (!identityMatches) return null;
  if (!safeEqual(password, configuredPassword)) return null;

  return {
    name,
    email,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
}
