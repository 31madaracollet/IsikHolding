import type { AdminStoreLike } from "@/lib/admin/store-types";
import type { AdminStats } from "@/lib/admin/types";

export function round(value: number) {
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
