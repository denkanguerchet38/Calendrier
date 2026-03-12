import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const { destroySession } = await import("@/lib/session");
  await destroySession();
  return NextResponse.json({ success: true });
}
