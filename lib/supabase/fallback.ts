"use client";

import { getSupabaseBrowser } from "@/lib/supabase/client";
import { products } from "@/lib/products";
import { calculateTotals, makeOrderNumber } from "@/lib/checkout";

/**
 * Sunucu (route handler) Supabase'e ulaşamadığında devreye giren tarayıcı
 * köprüsü. Yalnızca INSERT yapar; tablolarda SELECT/UPDATE/DELETE için anon
 * policy tanımlı değildir.
 *
 * Neden gerekli? Bazı önizleme/CI ortamları dış ağda yalnızca belirli
 * alan adlarına izin verir. Ziyaretçinin tarayıcısı ise Supabase'e doğrudan
 * erişebilir. Üretimde (Vercel vb.) sunucu yolu normal şekilde çalışır ve bu
 * köprü hiç kullanılmaz.
 */

export interface ContactFallbackInput {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}

export async function submitContactViaBrowser(
  input: ContactFallbackInput,
): Promise<{ reference: string } | null> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return null;

  const reference = `MSG-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const { error } = await supabase.from("contact_messages").insert({
    reference,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    subject: input.subject,
    message: input.message,
    user_agent: "browser-fallback",
  });
  if (error) {
    console.error("[fallback] contact insert failed:", error.message);
    return null;
  }
  return { reference };
}

export async function subscribeViaBrowser(
  email: string,
  source: string,
): Promise<boolean> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return false;

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: email.toLocaleLowerCase("tr-TR"),
    source,
    confirmed: true,
  });
  // 23505: aynı e-posta zaten kayıtlı → başarı say.
  if (error && error.code !== "23505") {
    console.error("[fallback] newsletter insert failed:", error.message);
    return false;
  }
  return true;
}

export interface OrderFallbackInput {
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
    district: string;
    address: string;
    note?: string;
  };
  items: { slug: string; qty: number }[];
  coupon?: string | null;
}

export async function submitOrderViaBrowser(
  input: OrderFallbackInput,
): Promise<{ orderNumber: string; total: number } | null> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return null;

  const lines = input.items.flatMap((item) => {
    const product = products.find((entry) => entry.slug === item.slug);
    if (!product) return [];
    return [
      {
        slug: product.slug,
        name: product.name,
        unitPrice: product.price,
        qty: item.qty,
        lineTotal: Math.round(product.price * item.qty * 100) / 100,
      },
    ];
  });
  if (lines.length === 0) return null;

  const subtotal =
    Math.round(lines.reduce((total, line) => total + line.lineTotal, 0) * 100) /
    100;
  const totals = calculateTotals(subtotal, input.coupon);
  const orderNumber = makeOrderNumber();
  const orderId = crypto.randomUUID();

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    order_number: orderNumber,
    customer_name: input.customer.name,
    email: input.customer.email,
    phone: input.customer.phone,
    city: input.customer.city,
    district: input.customer.district,
    address: input.customer.address,
    note: input.customer.note || null,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping: totals.shipping,
    total: totals.total,
    coupon: totals.coupon,
    status: "new",
  });
  if (orderError) {
    console.error("[fallback] order insert failed:", orderError.message);
    return null;
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    lines.map((line) => ({
      order_id: orderId,
      product_slug: line.slug,
      product_name: line.name,
      unit_price: line.unitPrice,
      quantity: line.qty,
      line_total: line.lineTotal,
    })),
  );
  if (itemsError) {
    console.error("[fallback] order items insert failed:", itemsError.message);
  }

  return { orderNumber, total: totals.total };
}
