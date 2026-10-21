"use client";

import { getSupabaseAuthClient } from "@/lib/supabase/auth-client";
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

/**
 * Statik dağıtımda panel verisini doğrudan tarayıcıdan Supabase'e okuyan
 * katman. RLS, yalnızca `authenticated` rolüne SELECT/UPDATE izni verir;
 * anon anahtarıyla dışarıdan okunamaz.
 */
export async function loadAdminDataClient(): Promise<AdminData> {
  const client = getSupabaseAuthClient();
  if (!client) {
    throw new Error("Supabase anahtarları tanımlı değil.");
  }

  const [ordersResult, messagesResult, subscribersResult] = await Promise.all([
    client
      .from("orders")
      .select("*, order_items(product_name, quantity, line_total)")
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("contact_messages")
      .select(
        "id, reference, name, email, phone, subject, message, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("newsletter_subscribers")
      .select("email, source, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const failure =
    ordersResult.error ?? messagesResult.error ?? subscribersResult.error;
  if (failure) {
    throw new Error(failure.message);
  }

  const orders = (ordersResult.data as SupabaseOrderRow[]).map(mapOrder);
  const messages = (messagesResult.data as SupabaseMessageRow[]).map(mapMessage);
  const subscribers = mapSubscribers(
    subscribersResult.data as SupabaseSubscriberRow[],
  );

  return {
    source: "supabase",
    checkedAt: new Date().toISOString(),
    orders,
    messages,
    subscribers,
    stats: buildStats({ orders, messages, subscribers }),
  };
}

export async function setOrderStatusClient(id: string, status: OrderStatus) {
  const client = getSupabaseAuthClient();
  if (!client) throw new Error("Supabase yapılandırılmamış.");
  const { error } = await client.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setMessageStatusClient(id: string, status: MessageStatus) {
  const client = getSupabaseAuthClient();
  if (!client) throw new Error("Supabase yapılandırılmamış.");
  const { error } = await client
    .from("contact_messages")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
