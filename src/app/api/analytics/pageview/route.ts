import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, visitorId } = body;

    await prisma.pageView.create({
      data: {
        path: path || "/",
        visitorId: visitorId || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pageview tracking failed:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}