"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Tarayıcı tarafı Supabase istemcisi.
 *
 * Yalnızca `anon` anahtarı kullanılır ve yalnızca RLS politikalarının izin
 * verdiği INSERT işlemleri yapılabilir. `service_role` anahtarı buraya asla
 * girmez.
 */
export function getSupabaseBrowser(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  if (!cached) {
    cached = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "X-Client-Info": "isik-holding-web-browser" } },
    });
  }
  return cached;
}

export function isBrowserSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
