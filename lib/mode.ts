/**
 * Dağıtım modu yardımcıları.
 *
 * - `STATIC_EXPORT`: site `next build` ile statik HTML olarak dışa aktarılıyor
 *   (GitHub Pages). Bu modda route handler'lar ve middleware yoktur; veri
 *   işlemleri tarayıcıdan Supabase'e yapılır.
 * - `BASE_PATH`: proje sayfası olarak yayınlandığında alt dizin
 *   (örn. `/IsikHolding`). `public/` dosyaları için `asset()` kullanın.
 */
export const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  if (!path) return path;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;
  if (!BASE_PATH) return path;
  return path.startsWith("/") ? `${BASE_PATH}${path}` : `${BASE_PATH}/${path}`;
}
