"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { AdminDashboard } from "@/components/admin/dashboard";
import {
  getCurrentAdmin,
  type AdminIdentity,
} from "@/lib/admin/client-auth";
import {
  loadAdminDataClient,
  setMessageStatusClient,
  setOrderStatusClient,
} from "@/lib/admin/client-data";
import type {
  AdminData,
  MessageStatus,
  OrderStatus,
} from "@/lib/admin/types";

/**
 * Statik dağıtımda panel gövdesi: veriyi tarayıcıdan Supabase'den okur,
 * durum güncellemelerini doğrudan Supabase'e yazar (RLS: authenticated).
 */
export function StaticAdminPanel() {
  const [data, setData] = useState<AdminData | null>(null);
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [nextData, identity] = await Promise.all([
        loadAdminDataClient(),
        getCurrentAdmin(),
      ]);
      setData(nextData);
      setAdmin(identity);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Panel verileri yüklenemedi.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-ink/30" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/35">
            Supabase'den veriler alınıyor
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertTriangle className="mx-auto size-6 text-amber-600" />
        <h2 className="mt-3 font-display text-[18px] font-bold">
          Veriler yüklenemedi
        </h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-ink/60">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[11px] font-bold text-white"
        >
          <RefreshCw className="size-3.5" /> Tekrar dene
        </button>
      </div>
    );
  }

  return (
    <AdminDashboard
      data={data}
      adminName={admin?.name ?? "Akif Işık"}
      onRefresh={() => void load()}
      mutate={{
        order: (id: string, status: OrderStatus) =>
          setOrderStatusClient(id, status),
        message: (id: string, status: MessageStatus) =>
          setMessageStatusClient(id, status),
      }}
    />
  );
}
