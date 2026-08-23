import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This prevents Next.js from caching the response, ensuring we always get fresh data
export const dynamic = "force-dynamic"; 

export async function GET() {
  try {
    // Fetch all releases, ordered by newest first
    const releases = await prisma.appRelease.findMany({
      orderBy: {
        publishedAt: "desc",
      },
    });

    if (!releases || releases.length === 0) {
      return NextResponse.json(
        { error: "No releases found" },
        { status: 404 }
      );
    }

    // Find the latest available Windows and macOS releases
    const latestWindows = releases.find((r) => r.platform === "windows");
    const latestMacos = releases.find((r) => r.platform === "macos");

    return NextResponse.json({
      windows: latestWindows
        ? {
            version: latestWindows.version,
            fileName: latestWindows.fileName,
            downloadUrl: latestWindows.downloadUrl,
            size: latestWindows.size,
            publishedAt: latestWindows.publishedAt,
          }
        : null,
      macos: latestMacos
        ? {
            version: latestMacos.version,
            fileName: latestMacos.fileName,
            downloadUrl: latestMacos.downloadUrl,
            size: latestMacos.size,
            publishedAt: latestMacos.publishedAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Failed to fetch releases:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}