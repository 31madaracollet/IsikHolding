import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/admin/data";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/admin/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : "";
    const status = typeof body?.status === "string" ? body.status : "";

    if (!id) {
      return NextResponse.json({ error: "Sipariş kimliği gerekli." }, { status: 400 });
    }
    if (!ORDER_STATUSES.includes(status as OrderStatus)) {
      return NextResponse.json({ error: "Geçersiz sipariş durumu." }, { status: 400 });
    }

    const result = await updateOrderStatus(id, status as OrderStatus);
    if (result === "not_found") {
      return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, persistence: result, status });
  } catch (error) {
    console.error("[admin] sipariş güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Sipariş güncellenemedi." },
      { status: 500 },
    );
  }
}
