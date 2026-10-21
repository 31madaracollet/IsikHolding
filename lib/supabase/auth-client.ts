"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Yönetim paneli için Supabase istemcisi.
 *
 * Statik dağıtımda (GitHub Pages) oturum Supabase Auth ile yönetilir; bu
 * istemci oturumu localStorage'da saklar ve RLS politikalarının izin verdiği
 * `authenticated` işlemleri için JWT'yi otomatik ekler.
 */
export function getSupabaseAuthClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  if (!cached) {
    cached = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: "isik-admin-auth",
      },
      global: { headers: { "X-Client-Info": "isik-holding-admin" } },
    });
  }
  return cached;
}
