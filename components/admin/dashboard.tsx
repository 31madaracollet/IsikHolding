"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Copy,
  Database,
  Download,
  ExternalLink,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  MESSAGE_STATUSES,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type AdminData,
  type AdminMessage,
  type AdminOrder,
  type MessageStatus,
  type OrderStatus,
} from "@/lib/admin/types";
import { cn, formatDateTime, formatPrice } from "@/lib/utils";

type Tab = "overview" | "orders" | "messages" | "subscribers";

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Genel bakış", icon: LayoutDashboard },
  { id: "orders", label: "Siparişler", icon: ShoppingBag },
  { id: "messages", label: "Mesajlar", icon: Mail },
  { id: "subscribers", label: "Bülten", icon: Users },
];

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  confirmed: "bg-sky-100 text-sky-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

const MESSAGE_STATUS_STYLES: Record<MessageStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  in_progress: "bg-sky-100 text-sky-800",
  closed: "bg-ink/[0.06] text-ink/50",
};

const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  new: "Yeni",
  in_progress: "İşlemde",
  closed: "Kapandı",
};

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"),
    )
    .join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof TrendingUp;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5",
        accent
          ? "border-ink bg-ink text-white"
          : "border-ink/[0.07] bg-white text-ink",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            accent ? "bg-brand text-ink" : "bg-brand/15 text-ink",
          )}
        >
          <Icon className="size-4" strokeWidth={1.9} />
        </span>
        <span
          className={cn(
            "text-[9px] font-bold uppercase tracking-[0.14em]",
            accent ? "text-white/35" : "text-ink/30",
          )}
        >
          {label}
        </span>
      </div>
      <p className="mt-4 font-display text-[25px] font-bold leading-none tracking-tight">
        {value}
      </p>
      <p
        className={cn(
          "mt-1.5 text-[10px] leading-tight",
          accent ? "text-white/45" : "text-ink/40",
        )}
      >
        {hint}
      </p>
    </div>
  );
}

export function AdminDashboard({
  data,
  adminName,
  mutate,
  onRefresh,
}: {
  data: AdminData;
  adminName: string;
  /** Statik dağıtımda durum güncellemelerini doğrudan Supabase'e yazar. */
  mutate?: {
    order: (id: string, status: OrderStatus) => Promise<void>;
    message: (id: string, status: MessageStatus) => Promise<void>;
  };
  /** Statik dağıtımda veriyi yeniden yükler (router.refresh yerine). */
  onRefresh?: () => void | Promise<void>;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<AdminOrder[]>(data.orders);
  const [messages, setMessages] = useState<AdminMessage[]>(data.messages);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [messageFilter, setMessageFilter] = useState<"all" | MessageStatus>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "error"; text: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrders(data.orders);
  }, [data.orders]);

  useEffect(() => {
    setMessages(data.messages);
  }, [data.messages]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const supabaseRef = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
    .replace(/^https?:\/\//, "")
    .split(".")[0];
  const supabaseDashboard = supabaseRef
    ? `https://supabase.com/dashboard/project/${supabaseRef}`
    : "https://supabase.com/dashboard";

  const filteredOrders = useMemo(() => {
    const normalized = query.toLocaleLowerCase("tr-TR").trim();
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesQuery =
        !normalized ||
        `${order.orderNumber} ${order.customerName} ${order.email} ${order.city} ${order.district}`
          .toLocaleLowerCase("tr-TR")
          .includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  const filteredMessages = useMemo(() => {
    const normalized = query.toLocaleLowerCase("tr-TR").trim();
    return messages.filter((message) => {
      const matchesStatus =
        messageFilter === "all" || message.status === messageFilter;
      const matchesQuery =
        !normalized ||
        `${message.name} ${message.email} ${message.subject} ${message.message}`
          .toLocaleLowerCase("tr-TR")
          .includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [messages, query, messageFilter]);

  const maxRevenue = Math.max(...data.stats.daily.map((day) => day.revenue), 1);

  async function changeOrderStatus(id: string, status: OrderStatus) {
    const previous = orders;
    setBusyId(id);
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );
    try {
      if (mutate) {
        await mutate.order(id, status);
      } else {
        const response = await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Güncellenemedi.");
      }
      setToast({
        type: "ok",
        text: `Sipariş durumu "${ORDER_STATUS_LABELS[status]}" olarak güncellendi.`,
      });
      if (onRefresh) await onRefresh();
      else router.refresh();
    } catch (error) {
      setOrders(previous);
      setToast({
        type: "error",
        text: error instanceof Error ? error.message : "Güncellenemedi.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function changeMessageStatus(id: string, status: MessageStatus) {
    const previous = messages;
    setBusyId(id);
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, status } : message,
      ),
    );
    try {
      if (mutate) {
        await mutate.message(id, status);
      } else {
        const response = await fetch("/api/admin/messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Güncellenemedi.");
      }
      setToast({
        type: "ok",
        text: `Mesaj durumu "${MESSAGE_STATUS_LABELS[status]}" olarak güncellendi.`,
      });
      if (onRefresh) await onRefresh();
      else router.refresh();
    } catch (error) {
      setMessages(previous);
      setToast({
        type: "error",
        text: error instanceof Error ? error.message : "Güncellenemedi.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function copySubscribers() {
    try {
      await navigator.clipboard.writeText(
        data.subscribers.map((subscriber) => subscriber.email).join(", "),
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
      setToast({ type: "ok", text: "Abone listesi kopyalandı." });
    } catch {
      setToast({ type: "error", text: "Panoya kopyalanamadı." });
    }
  }

  function exportOrders() {
    const rows: (string | number)[][] = [
      [
        "Sipariş No",
        "Tarih",
        "Müşteri",
        "E-posta",
        "Telefon",
        "Şehir",
        "İlçe",
        "Adres",
        "Ürünler",
        "Ara Toplam",
        "İndirim",
        "Kargo",
        "Toplam",
        "Kupon",
        "Durum",
      ],
      ...filteredOrders.map((order) => [
        order.orderNumber,
        formatDateTime(order.createdAt),
        order.customerName,
        order.email,
        order.phone,
        order.city,
        order.district,
        order.address,
        order.items.map((item) => `${item.name} x${item.qty}`).join(" | "),
        order.subtotal.toFixed(2),
        order.discount.toFixed(2),
        order.shipping.toFixed(2),
        order.total.toFixed(2),
        order.coupon ?? "",
        ORDER_STATUS_LABELS[order.status],
      ]),
    ];
    downloadCsv(`isik-siparisler-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }

  function exportSubscribers() {
    const rows: (string | number)[][] = [
      ["E-posta", "Kaynak", "Kayıt Tarihi"],
      ...data.subscribers.map((subscriber) => [
        subscriber.email,
        subscriber.source,
        formatDateTime(subscriber.createdAt),
      ]),
    ];
    downloadCsv(`isik-bulten-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }

  const todayLabel = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date());

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/20 px-3 py-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-ink/60">
            <ShieldCheck className="size-3" />
            Yönetim paneli
          </span>
          <h1 className="mt-3 font-display text-[28px] font-bold leading-tight tracking-tight sm:text-[34px]">
            Merhaba, {adminName.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-[11.5px] text-ink/45">
            {todayLabel} · Mağazanın bugünkü durumu aşağıda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-bold",
              data.source === "supabase"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-800",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                data.source === "supabase" ? "bg-emerald-500" : "bg-amber-500",
              )}
            />
            {data.source === "supabase" ? "Supabase bağlı" : "Önizleme verisi"}
          </span>
          <button
            type="button"
            onClick={() => (onRefresh ? void onRefresh() : router.refresh())}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-3.5 py-2 text-[10.5px] font-bold transition hover:border-ink/30"
          >
            <RefreshCw className="size-3.5" />
            Yenile
          </button>
        </div>
      </div>

      {data.source === "demo" && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <p className="text-[11px] leading-relaxed text-amber-900">
              <strong className="font-bold">Önizleme modu.</strong> Sunucu bu
              ortamda Supabase&apos;e ulaşamıyor; panel örnek kayıtlarla
              gösteriliyor. Canlı ortamda (Vercel) gerçek sipariş, mesaj ve
              aboneler otomatik yüklenir. Formlar şu anda tarayıcı köprüsüyle
              doğrudan Supabase&apos;e yazılıyor.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <a
              href={supabaseDashboard}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[10px] font-bold text-white"
            >
              <Database className="size-3.5 text-brand" />
              Supabase tabloları
            </a>
          </div>
        </div>
      )}

      <div className="no-scrollbar mt-6 flex items-center gap-1 overflow-x-auto rounded-full border border-ink/[0.07] bg-white p-1">
        {TABS.map((item) => {
          const badge =
            item.id === "orders"
              ? orders.length
              : item.id === "messages"
                ? messages.length
                : item.id === "subscribers"
                  ? data.subscribers.length
                  : null;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setQuery("");
              }}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[11.5px] font-bold transition",
                tab === item.id
                  ? "bg-ink text-white"
                  : "text-ink/50 hover:bg-ink/5 hover:text-ink",
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
              {badge !== null && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                    tab === item.id
                      ? "bg-brand text-ink"
                      : "bg-ink/[0.06] text-ink/50",
                  )}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── GENEL BAKIŞ ─────────────────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard
              label="Ciro"
              value={formatPrice(data.stats.revenue).replace(",00", "")}
              hint="İptaller hariç toplam"
              icon={CircleDollarSign}
              accent
            />
            <KpiCard
              label="Sipariş"
              value={String(data.stats.orderCount)}
              hint={`${data.stats.newOrders} yeni sipariş bekliyor`}
              icon={ShoppingBag}
            />
            <KpiCard
              label="Ortalama sepet"
              value={formatPrice(data.stats.averageOrder).replace(",00", "")}
              hint={`Teslim oranı %${data.stats.deliveredRate}`}
              icon={TrendingUp}
            />
            <KpiCard
              label="Bülten"
              value={String(data.stats.subscriberCount)}
              hint={`${data.stats.openMessages} açık mesaj`}
              icon={Users}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
            <div className="rounded-2xl border border-ink/[0.07] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[15px] font-semibold">
                    Son 7 gün
                  </h2>
                  <p className="mt-0.5 text-[10px] text-ink/35">
                    Günlük sipariş cirosu
                  </p>
                </div>
                <span className="rounded-full bg-cream px-2.5 py-1 text-[9.5px] font-bold text-ink/50">
                  {data.stats.daily.reduce((total, day) => total + day.orders, 0)}{" "}
                  sipariş
                </span>
              </div>

              <div className="mt-5 flex h-[150px] items-end gap-2">
                {data.stats.daily.map((day) => {
                  const height =
                    day.revenue > 0
                      ? Math.max(8, Math.round((day.revenue / maxRevenue) * 100))
                      : 3;
                  return (
                    <div
                      key={day.date}
                      className="group flex flex-1 flex-col items-center gap-2"
                      title={`${day.label}: ${formatPrice(day.revenue)} · ${day.orders} sipariş`}
                    >
                      <span className="text-[8.5px] font-bold text-ink/30 opacity-0 transition group-hover:opacity-100">
                        {day.orders}
                      </span>
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className={cn(
                            "w-full rounded-t-lg transition-all duration-500",
                            day.revenue > 0
                              ? "bg-brand group-hover:bg-ink"
                              : "bg-ink/[0.07]",
                          )}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-[8.5px] font-semibold uppercase tracking-wider text-ink/35">
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-ink/[0.07] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[15px] font-semibold">
                  Hızlı işlemler
                </h2>
                <Package className="size-4 text-ink/25" />
              </div>
              <div className="mt-3 grid gap-2">
                {[
                  {
                    label: "Yeni siparişleri gör",
                    hint: `${data.stats.newOrders} bekliyor`,
                    action: () => {
                      setTab("orders");
                      setStatusFilter("new");
                    },
                    icon: ShoppingBag,
                  },
                  {
                    label: "Açık mesajları yanıtla",
                    hint: `${data.stats.openMessages} açık`,
                    action: () => {
                      setTab("messages");
                      setMessageFilter("new");
                    },
                    icon: MessageSquare,
                  },
                  {
                    label: "Bülten listesini indir",
                    hint: `${data.subscribers.length} abone`,
                    action: () => {
                      setTab("subscribers");
                    },
                    icon: Download,
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className="flex items-center justify-between gap-2 rounded-xl border border-ink/[0.07] px-3 py-2.5 text-left transition hover:border-ink/20 hover:bg-cream"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-brand/15">
                        <item.icon className="size-3.5" />
                      </span>
                      <span>
                        <span className="block text-[11px] font-semibold">
                          {item.label}
                        </span>
                        <span className="block text-[9px] text-ink/35">
                          {item.hint}
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight className="size-3.5 text-ink/25" />
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={supabaseDashboard}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-3 py-2.5 text-[10px] font-bold text-white"
                >
                  <Database className="size-3.5 text-brand" />
                  Supabase
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-ink/12 px-3 py-2.5 text-[10px] font-bold"
                >
                  <ExternalLink className="size-3.5" />
                  Siteyi aç
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-ink/[0.07] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[15px] font-semibold">
                  Son siparişler
                </h2>
                <button
                  type="button"
                  onClick={() => setTab("orders")}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/45 hover:text-ink"
                >
                  Tümü <ArrowUpRight className="size-3" />
                </button>
              </div>
              <ul className="mt-3 divide-y divide-ink/[0.06]">
                {orders.slice(0, 5).map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-semibold">
                        {order.customerName}
                      </p>
                      <p className="text-[9px] text-ink/35">
                        {order.orderNumber} · {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[11px] font-bold">
                        {formatPrice(order.total)}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[8.5px] font-bold",
                          ORDER_STATUS_STYLES[order.status],
                        )}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                  </li>
                ))}
                {orders.length === 0 && (
                  <li className="py-4 text-[11px] text-ink/35">
                    Henüz sipariş yok.
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-ink/[0.07] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[15px] font-semibold">
                  Son mesajlar
                </h2>
                <button
                  type="button"
                  onClick={() => setTab("messages")}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-ink/45 hover:text-ink"
                >
                  Tümü <ArrowUpRight className="size-3" />
                </button>
              </div>
              <ul className="mt-3 divide-y divide-ink/[0.06]">
                {messages.slice(0, 4).map((message) => (
                  <li key={message.id} className="py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[11.5px] font-semibold">
                        {message.name}
                      </p>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[8.5px] font-bold",
                          MESSAGE_STATUS_STYLES[message.status],
                        )}
                      >
                        {MESSAGE_STATUS_LABELS[message.status]}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-ink/40">
                      {message.subject} · {message.message}
                    </p>
                  </li>
                ))}
                {messages.length === 0 && (
                  <li className="py-4 text-[11px] text-ink/35">
                    Henüz mesaj yok.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── SİPARİŞLER ──────────────────────────────────────────────────── */}
      {tab === "orders" && (
        <div className="mt-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-ink/[0.07] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/30" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Sipariş no, müşteri, şehir ara…"
                className="w-full rounded-full border border-ink/10 bg-cream py-2.5 pl-9 pr-3 text-[11.5px] outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "all" | OrderStatus)
                }
                className="rounded-full border border-ink/10 bg-white px-3 py-2.5 text-[11px] font-semibold outline-none focus:border-brand-500"
              >
                <option value="all">Tüm durumlar</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {ORDER_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={exportOrders}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2.5 text-[10.5px] font-bold text-white"
              >
                <Download className="size-3.5 text-brand" />
                CSV indir
              </button>
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-ink/[0.07] bg-white">
            <div className="hidden grid-cols-[1.25fr_1.35fr_1fr_0.85fr_1fr] gap-4 border-b border-ink/[0.07] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-ink/35 lg:grid">
              <span>Sipariş</span>
              <span>Müşteri</span>
              <span>Ürünler</span>
              <span>Tutar</span>
              <span>Durum</span>
            </div>

            <ul className="divide-y divide-ink/[0.06]">
              {filteredOrders.map((order) => (
                <li
                  key={order.id}
                  className="grid gap-3 px-4 py-4 transition hover:bg-cream/50 sm:px-5 lg:grid-cols-[1.25fr_1.35fr_1fr_0.85fr_1fr] lg:items-center lg:gap-4"
                >
                  <div>
                    <p className="font-display text-[12px] font-bold">
                      {order.orderNumber}
                    </p>
                    <p className="mt-0.5 text-[9.5px] text-ink/35">
                      {formatDateTime(order.createdAt)}
                    </p>
                    {order.coupon && (
                      <span className="mt-1 inline-flex rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700">
                        {order.coupon}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[11.5px] font-semibold">
                      {order.customerName}
                    </p>
                    <p className="truncate text-[9.5px] text-ink/40">
                      {order.email}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[9px] text-ink/35">
                      <MapPin className="size-2.5" />
                      {order.district} / {order.city}
                    </p>
                  </div>

                  <div className="text-[10px] leading-relaxed text-ink/50">
                    {order.items.length > 0 ? (
                      <>
                        <p className="truncate">
                          {order.items[0].name} ×{order.items[0].qty}
                        </p>
                        {order.items.length > 1 && (
                          <p className="text-[9px] text-ink/30">
                            +{order.items.length - 1} ürün daha
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-ink/30">Kalem yok</span>
                    )}
                  </div>

                  <div>
                    <p className="text-[12px] font-bold">
                      {formatPrice(order.total)}
                    </p>
                    {order.discount > 0 && (
                      <p className="text-[9px] text-emerald-700">
                        −{formatPrice(order.discount)} indirim
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 lg:justify-start">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-[8.5px] font-bold lg:hidden",
                        ORDER_STATUS_STYLES[order.status],
                      )}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <select
                      value={order.status}
                      disabled={busyId === order.id}
                      onChange={(event) =>
                        changeOrderStatus(
                          order.id,
                          event.target.value as OrderStatus,
                        )
                      }
                      aria-label={`${order.orderNumber} durumu`}
                      className={cn(
                        "w-full rounded-full border-0 px-2.5 py-1.5 text-[10px] font-bold outline-none ring-1 ring-inset ring-ink/10 transition disabled:opacity-50 lg:w-auto",
                        ORDER_STATUS_STYLES[order.status],
                      )}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {ORDER_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>

            {filteredOrders.length === 0 && (
              <div className="px-5 py-10 text-center">
                <p className="text-[12px] font-semibold">Sipariş bulunamadı</p>
                <p className="mt-1 text-[10.5px] text-ink/40">
                  Arama veya durum filtresini değiştirin.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MESAJLAR ────────────────────────────────────────────────────── */}
      {tab === "messages" && (
        <div className="mt-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-ink/[0.07] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/30" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Kişi, konu veya mesaj ara…"
                className="w-full rounded-full border border-ink/10 bg-cream py-2.5 pl-9 pr-3 text-[11.5px] outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand/20"
              />
            </div>
            <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
              {(["all", ...MESSAGE_STATUSES] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setMessageFilter(status)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-2 text-[10.5px] font-bold transition",
                    messageFilter === status
                      ? "bg-ink text-white"
                      : "text-ink/50 hover:bg-ink/5",
                  )}
                >
                  {status === "all" ? "Tümü" : MESSAGE_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {filteredMessages.map((message) => (
              <article
                key={message.id}
                className="flex flex-col rounded-2xl border border-ink/[0.07] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-full bg-brand/20 font-display text-[10px] font-bold">
                      {message.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toLocaleUpperCase("tr-TR")}
                    </span>
                    <div>
                      <p className="text-[12px] font-bold leading-none">
                        {message.name}
                      </p>
                      <p className="mt-1 text-[9.5px] text-ink/35">
                        {message.reference} · {formatDateTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[8.5px] font-bold",
                      MESSAGE_STATUS_STYLES[message.status],
                    )}
                  >
                    {MESSAGE_STATUS_LABELS[message.status]}
                  </span>
                </div>

                <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-brand-700">
                  {message.subject}
                </p>
                <p className="mt-1 flex-1 text-[11px] leading-relaxed text-ink/55">
                  {message.message}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-ink/[0.06] pt-3">
                  <a
                    href={`mailto:${message.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1.5 text-[9.5px] font-semibold text-ink/60 transition hover:text-ink"
                  >
                    <Mail className="size-3" />
                    {message.email}
                  </a>
                  {message.phone && (
                    <a
                      href={`tel:${message.phone.replaceAll(" ", "")}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1.5 text-[9.5px] font-semibold text-ink/60 transition hover:text-ink"
                    >
                      <Phone className="size-3" />
                      {message.phone}
                    </a>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {message.status !== "in_progress" && message.status !== "closed" && (
                    <button
                      type="button"
                      disabled={busyId === message.id}
                      onClick={() => changeMessageStatus(message.id, "in_progress")}
                      className="rounded-full bg-sky-100 px-2.5 py-1.5 text-[9.5px] font-bold text-sky-800 transition hover:bg-sky-200 disabled:opacity-50"
                    >
                      İşleme al
                    </button>
                  )}
                  {message.status !== "closed" ? (
                    <button
                      type="button"
                      disabled={busyId === message.id}
                      onClick={() => changeMessageStatus(message.id, "closed")}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1.5 text-[9.5px] font-bold text-emerald-800 transition hover:bg-emerald-200 disabled:opacity-50"
                    >
                      <Check className="size-3" />
                      Kapat
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId === message.id}
                      onClick={() => changeMessageStatus(message.id, "new")}
                      className="inline-flex items-center gap-1 rounded-full bg-ink/[0.06] px-2.5 py-1.5 text-[9.5px] font-bold text-ink/60 transition hover:bg-ink/10 disabled:opacity-50"
                    >
                      <RefreshCw className="size-3" />
                      Yeniden aç
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          {filteredMessages.length === 0 && (
            <div className="mt-3 rounded-2xl border border-dashed border-ink/15 bg-white px-5 py-10 text-center">
              <p className="text-[12px] font-semibold">Mesaj bulunamadı</p>
              <p className="mt-1 text-[10.5px] text-ink/40">
                Farklı bir arama veya durum seçin.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── BÜLTEN ─────────────────────────────────────────────────────── */}
      {tab === "subscribers" && (
        <div className="mt-5">
          <div className="flex flex-col gap-3 rounded-2xl border border-ink/[0.07] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] font-bold">
                {data.subscribers.length} bülten abonesi
              </p>
              <p className="mt-0.5 text-[10px] text-ink/40">
                Işık Bülten kayıtları · en yeni önce
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copySubscribers}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 px-3.5 py-2.5 text-[10.5px] font-bold transition hover:border-ink/30"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? "Kopyalandı" : "Tümünü kopyala"}
              </button>
              <button
                type="button"
                onClick={exportSubscribers}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2.5 text-[10.5px] font-bold text-white"
              >
                <Download className="size-3.5 text-brand" />
                CSV indir
              </button>
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-ink/[0.07] bg-white">
            <div className="hidden grid-cols-[1.6fr_0.8fr_1fr] gap-4 border-b border-ink/[0.07] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-ink/35 sm:grid">
              <span>E-posta</span>
              <span>Kaynak</span>
              <span>Kayıt tarihi</span>
            </div>
            <ul className="divide-y divide-ink/[0.06]">
              {data.subscribers.map((subscriber) => (
                <li
                  key={subscriber.id}
                  className="grid gap-1.5 px-4 py-3 sm:grid-cols-[1.6fr_0.8fr_1fr] sm:items-center sm:gap-4 sm:px-5"
                >
                  <span className="flex items-center gap-2 text-[11.5px] font-semibold">
                    <span className="flex size-6 items-center justify-center rounded-full bg-brand/20 text-[8.5px] font-bold uppercase">
                      {subscriber.email.slice(0, 2)}
                    </span>
                    <span className="truncate">{subscriber.email}</span>
                  </span>
                  <span className="w-fit rounded-full bg-cream px-2 py-0.5 text-[8.5px] font-semibold text-ink/50">
                    {subscriber.source}
                  </span>
                  <span className="text-[10px] text-ink/40">
                    {formatDateTime(subscriber.createdAt)}
                  </span>
                </li>
              ))}
            </ul>

            {data.subscribers.length === 0 && (
              <div className="px-5 py-10 text-center">
                <p className="text-[12px] font-semibold">Henüz abone yok</p>
                <p className="mt-1 text-[10.5px] text-ink/40">
                  Site altbilgisindeki bülten formundan gelen kayıtlar burada
                  görünür.
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-ink/[0.07] bg-white p-4 text-[10px] leading-relaxed text-ink/45">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
            Abone verileri yalnızca yetkili oturumla görüntülenir. Bülten
            gönderimleri için listeyi CSV olarak dışa aktarıp kendi e-posta
            sağlayıcınıza yükleyebilirsiniz.
          </div>
        </div>
      )}

      {/* Toast */}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[120] flex justify-center px-4 sm:justify-end sm:px-6">
        {toast && (
          <div
            className={cn(
              "pointer-events-auto flex items-center gap-2.5 rounded-2xl px-4 py-3 text-[11.5px] font-semibold shadow-2xl animate-rise",
              toast.type === "ok"
                ? "bg-ink text-white"
                : "bg-red-600 text-white",
            )}
          >
            {toast.type === "ok" ? (
              <CheckCircle2 className="size-4 text-brand" />
            ) : (
              <AlertTriangle className="size-4" />
            )}
            {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}
