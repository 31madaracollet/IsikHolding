import { getSupabaseAdmin } from "@/lib/supabase/server";
import { readLocalStore, writeLocalStore } from "@/lib/admin/demo";
import type { AdminStoreLike } from "@/lib/admin/store-types";
import {
  mapMessage,
  mapOrder,
  mapSubscribers,
  type SupabaseMessageRow,
  type SupabaseOrderRow,
  type SupabaseSubscriberRow,
} from "@/lib/admin/mappers";
import { buildStats } from "@/lib/admin/stats";
import type {
  AdminData,
  MessageStatus,
  OrderStatus,
} from "@/lib/admin/types";

export { buildStats };

async function loadFromSupabase(): Promise<AdminStoreLike | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  try {
    const [ordersResult, messagesResult, subscribersResult] = await Promise.all([
      supabase
        .from("orders")
        .select("*, order_items(product_name, quantity, line_total)")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("contact_messages")
        .select(
          "id, reference, name, email, phone, subject, message, status, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("newsletter_subscribers")
        .select("email, source, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    if (ordersResult.error || messagesResult.error || subscribersResult.error) {
      console.warn(
        "[admin] Supabase okunamadı:",
        ordersResult.error?.message ??
          messagesResult.error?.message ??
          subscribersResult.error?.message,
      );
      return null;
    }

    return {
      orders: (ordersResult.data as SupabaseOrderRow[]).map(mapOrder),
      messages: (messagesResult.data as SupabaseMessageRow[]).map(mapMessage),
      subscribers: mapSubscribers(
        subscribersResult.data as SupabaseSubscriberRow[],
      ),
    };
  } catch (error) {
    console.warn("[admin] Supabase bağlantı hatası:", error);
    return null;
  }
}

export async function getAdminData(): Promise<AdminData> {
  const remote = await loadFromSupabase();

  if (remote) {
    return {
      source: "supabase",
      checkedAt: new Date().toISOString(),
      ...remote,
      stats: buildStats(remote),
    };
  }

  const local = await readLocalStore();
  return {
    source: "demo",
    checkedAt: new Date().toISOString(),
    ...local,
    stats: buildStats(local),
  };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<"supabase" | "demo" | "not_found"> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    try {
      const { error, count } = await supabase
        .from("orders")
        .update({ status }, { count: "exact" })
        .eq("id", id);
      if (!error && count && count > 0) return "supabase";
      if (error) {
        console.warn("[admin] durum güncellenemedi:", error.message);
      }
    } catch (error) {
      console.warn("[admin] durum güncelleme hatası:", error);
    }
  }

  const store = await readLocalStore();
  const order = store.orders.find((entry) => entry.id === id);
  if (!order) return "not_found";
  order.status = status;
  await writeLocalStore(store);
  return "demo";
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus,
): Promise<"supabase" | "demo" | "not_found"> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    try {
      const { error, count } = await supabase
        .from("contact_messages")
        .update({ status }, { count: "exact" })
        .eq("id", id);
      if (!error && count && count > 0) return "supabase";
      if (error) {
        console.warn("[admin] mesaj durumu güncellenemedi:", error.message);
      }
    } catch (error) {
      console.warn("[admin] mesaj durumu güncelleme hatası:", error);
    }
  }

  const store = await readLocalStore();
  const message = store.messages.find((entry) => entry.id === id);
  if (!message) return "not_found";
  message.status = status;
  await writeLocalStore(store);
  return "demo";
}
