export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Yeni",
  confirmed: "Onaylandı",
  shipped: "Kargoda",
  delivered: "Teslim edildi",
  cancelled: "İptal",
};

export const MESSAGE_STATUSES = ["new", "in_progress", "closed"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export interface AdminOrderItem {
  name: string;
  qty: number;
  lineTotal: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  note: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: string | null;
  status: OrderStatus;
  createdAt: string;
  items: AdminOrderItem[];
}

export interface AdminMessage {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

export interface AdminSubscriber {
  id: string;
  email: string;
  source: string;
  createdAt: string;
}

export interface AdminStats {
  revenue: number;
  orderCount: number;
  newOrders: number;
  averageOrder: number;
  messageCount: number;
  openMessages: number;
  subscriberCount: number;
  deliveredRate: number;
  daily: { date: string; label: string; orders: number; revenue: number }[];
}

export interface AdminData {
  source: "supabase" | "demo";
  checkedAt: string;
  orders: AdminOrder[];
  messages: AdminMessage[];
  subscribers: AdminSubscriber[];
  stats: AdminStats;
}
