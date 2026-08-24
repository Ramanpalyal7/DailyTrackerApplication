import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, visitorId } = body;

    // Find the latest release to attach the correct version number
    const release = await prisma.appRelease.findFirst({
      where: { platform: platform || "windows" },
      orderBy: { publishedAt: "desc" },
    });

    // Log the download event to Neon
    await prisma.downloadEvent.create({
      data: {
        platform: platform || "windows",
        version: release?.version || null,
        visitorId: visitorId || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Download tracking failed:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}