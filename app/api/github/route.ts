import { NextResponse } from "next/server";
import { getGitHubStats } from "@/lib/github";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const stats = await getGitHubStats();
  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
