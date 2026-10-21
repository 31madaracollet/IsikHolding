"use client";

import type { User } from "@supabase/supabase-js";
import { getSupabaseAuthClient } from "@/lib/supabase/auth-client";

export const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "akif@isikholding.com";
export const ADMIN_NAME =
  process.env.NEXT_PUBLIC_ADMIN_NAME ?? "Akif Işık";

export interface AdminIdentity {
  name: string;
  email: string;
}

export function adminFromUser(user: User | null): AdminIdentity | null {
  if (!user?.email) return null;
  if (user.email.toLocaleLowerCase("tr-TR") !== ADMIN_EMAIL.toLocaleLowerCase("tr-TR")) {
    return null;
  }
  const metaName = user.user_metadata?.name;
  return {
    name: typeof metaName === "string" && metaName.trim() ? metaName : ADMIN_NAME,
    email: user.email,
  };
}

export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  const client = getSupabaseAuthClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return adminFromUser(data.session?.user ?? null);
}

export async function signInAdmin(
  identifier: string,
  password: string,
): Promise<AdminIdentity> {
  const client = getSupabaseAuthClient();
  if (!client) {
    throw new Error("Supabase yapılandırılmamış. Ortam değişkenlerini kontrol edin.");
  }

  const email = identifier.includes("@") ? identifier.trim() : ADMIN_EMAIL;
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(
      error.message === "Invalid login credentials"
        ? "Kullanıcı adı veya şifre hatalı."
        : error.message,
    );
  }

  const admin = adminFromUser(data.user);
  if (!admin) {
    await client.auth.signOut();
    throw new Error("Bu hesabın yönetim paneli yetkisi yok.");
  }
  return admin;
}

export async function signOutAdmin() {
  const client = getSupabaseAuthClient();
  await client?.auth.signOut();
}
