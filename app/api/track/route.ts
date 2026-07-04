import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const path = typeof body.path === "string" ? body.path.slice(0, 300) : "/";
    const referrer =
      typeof body.referrer === "string" ? body.referrer.slice(0, 300) : "";

    await prisma.pageView.create({ data: { path, referrer } });
  } catch {
    // Analytics is best-effort; never fail the page for a tracking hiccup.
  }

  return NextResponse.json({ ok: true });
}
