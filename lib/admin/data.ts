import { getSupabaseAdmin } from "@/lib/supabase/server";
import { readLocalStore, writeLocalStore } from "@/lib/admin/demo";
import type { AdminStoreLike } from "@/lib/admin/store-types";
import type {
  AdminData,
  AdminMessage,
  AdminOrder,
  AdminOrderItem,
  AdminStats,
  AdminSubscriber,
  MessageStatus,
  OrderStatus,
} from "@/lib/admin/types";

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export function buildStats(store: AdminStoreLike): AdminStats {
  const validOrders = store.orders.filter(
    (order) => order.status !== "cancelled",
  );
  const revenue = round(
    validOrders.reduce((total, order) => total + order.total, 0),
  );
  const orderCount = store.orders.length;
  const newOrders = store.orders.filter((order) => order.status === "new").length;
  const delivered = store.orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const daily = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);

    const dayOrders = store.orders.filter((order) => {
      const created = new Date(order.createdAt).getTime();
      return created >= date.getTime() && created < next.getTime();
    });
    const dayValid = dayOrders.filter((order) => order.status !== "cancelled");

    return {
      date: date.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(date),
      orders: dayOrders.length,
      revenue: round(dayValid.reduce((total, order) => total + order.total, 0)),
    };
  });

  return {
    revenue,
    orderCount,
    newOrders,
    averageOrder: validOrders.length ? round(revenue / validOrders.length) : 0,
    messageCount: store.messages.length,
    openMessages: store.messages.filter((message) => message.status !== "closed")
      .length,
    subscriberCount: store.subscribers.length,
    deliveredRate: orderCount ? Math.round((delivered / orderCount) * 100) : 0,
    daily,
  };
}

interface SupabaseOrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  note: string | null;
  subtotal: number | string;
  discount: number | string;
  shipping: number | string;
  total: number | string;
  coupon: string | null;
  status: string;
  created_at: string;
  order_items?: {
    product_name: string;
    quantity: number;
    line_total: number | string;
  }[];
}

interface SupabaseMessageRow {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface SupabaseSubscriberRow {
  email: string;
  source: string | null;
  created_at: string;
}

function mapOrder(row: SupabaseOrderRow): AdminOrder {
  const items: AdminOrderItem[] = (row.order_items ?? []).map((item) => ({
    name: item.product_name,
    qty: item.quantity,
    lineTotal: Number(item.line_total),
  }));

  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    district: row.district,
    address: row.address,
    note: row.note,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    coupon: row.coupon,
    status: (row.status as OrderStatus) ?? "new",
    createdAt: row.created_at,
    items,
  };
}

function mapMessage(row: SupabaseMessageRow): AdminMessage {
  return {
    id: row.id,
    reference: row.reference,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: (row.status as MessageStatus) ?? "new",
    createdAt: row.created_at,
  };
}

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
      subscribers: (subscribersResult.data as SupabaseSubscriberRow[]).map(
        (row, index): AdminSubscriber => ({
          id: `${row.email}-${index}`,
          email: row.email,
          source: row.source ?? "website",
          createdAt: row.created_at,
        }),
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
      console.warn("[admin] mesaj güncelleme hatası:", error);
    }
  }

  const store = await readLocalStore();
  const message = store.messages.find((entry) => entry.id === id);
  if (!message) return "not_found";
  message.status = status;
  await writeLocalStore(store);
  return "demo";
}
