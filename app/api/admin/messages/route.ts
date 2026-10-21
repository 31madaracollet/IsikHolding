import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { updateMessageStatus } from "@/lib/admin/data";
import { MESSAGE_STATUSES, type MessageStatus } from "@/lib/admin/types";

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
      return NextResponse.json({ error: "Mesaj kimliği gerekli." }, { status: 400 });
    }
    if (!MESSAGE_STATUSES.includes(status as MessageStatus)) {
      return NextResponse.json({ error: "Geçersiz mesaj durumu." }, { status: 400 });
    }

    const result = await updateMessageStatus(id, status as MessageStatus);
    if (result === "not_found") {
      return NextResponse.json({ error: "Mesaj bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, persistence: result, status });
  } catch (error) {
    console.error("[admin] mesaj güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Mesaj güncellenemedi." },
      { status: 500 },
    );
  }
}
