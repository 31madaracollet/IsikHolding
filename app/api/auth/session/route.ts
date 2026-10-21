import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json(
    {
      authenticated: Boolean(session),
      admin: session
        ? { name: session.name, email: session.email, role: session.role }
        : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
