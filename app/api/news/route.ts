import { NextResponse } from "next/server";
import { getNews } from "@/lib/news";

export const runtime = "nodejs";
export const revalidate = 900;

export async function GET() {
  const { items, live } = await getNews();
  return NextResponse.json(
    {
      live,
      count: items.length,
      updatedAt: new Date().toISOString(),
      items,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    },
  );
}
