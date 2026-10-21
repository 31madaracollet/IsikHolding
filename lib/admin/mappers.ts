import type {
  AdminMessage,
  AdminOrder,
  AdminOrderItem,
  AdminSubscriber,
  MessageStatus,
  OrderStatus,
} from "@/lib/admin/types";

export interface SupabaseOrderRow {
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

export interface SupabaseMessageRow {
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

export interface SupabaseSubscriberRow {
  email: string;
  source: string | null;
  created_at: string;
}

export function mapOrder(row: SupabaseOrderRow): AdminOrder {
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

export function mapMessage(row: SupabaseMessageRow): AdminMessage {
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

export function mapSubscribers(rows: SupabaseSubscriberRow[]): AdminSubscriber[] {
  return rows.map((row, index) => ({
    id: `${row.email}-${index}`,
    email: row.email,
    source: row.source ?? "website",
    createdAt: row.created_at,
  }));
}
