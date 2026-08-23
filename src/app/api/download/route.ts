import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { config } from "@/utils/config";
import { HEADERS, ERROR_MESSAGES } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";
import { createApiResponse, isValidPlatform } from "@/lib/utils";
import type { Platform } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/download?platform=windows&visitorId=xxx
 * 
 * Tracks download event and redirects to Cloudflare Worker
 * for direct file delivery.
 */
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting (stricter for downloads)
    const rateLimitResponse = await rateLimit(request, {
      maxRequests: 30, // Allow more download attempts
      windowInSeconds: 60,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform") || "windows";
    const visitorId = searchParams.get("visitorId");

    // Validate platform
    if (!isValidPlatform(platform)) {
      return NextResponse.json(
        createApiResponse(false, undefined, ERROR_MESSAGES.INVALID_PLATFORM),
        { status: 400 }
      );
    }

    // Find the latest release for this platform
    const release = await prisma.appRelease.findFirst({
      where: { platform: platform as Platform },
      orderBy: { publishedAt: "desc" },
      select: {
        fileName: true,
        version: true,
        platform: true,
      },
    });

    if (!release) {
      return NextResponse.json(
        createApiResponse(false, undefined, `No release found for ${platform}`),
        { status: 404 }
      );
    }

    // Track download in background (non-blocking)
    // Don't await this - we want to redirect immediately
    prisma.downloadEvent.create({
      data: {
        platform: release.platform,
        version: release.version,
        visitorId: visitorId || null,
      },
    }).catch((error) => {
      // Log but don't block the download
      console.error("Download tracking failed:", {
        error,
        platform,
        version: release.version,
        timestamp: new Date().toISOString(),
      });
    });

    // Construct Cloudflare Worker URL
    const workerUrl = new URL(config.CLOUDFLARE_WORKER_URL);
    workerUrl.pathname = `/${encodeURIComponent(release.fileName)}`;

    // Redirect immediately without waiting for database write
    return NextResponse.redirect(workerUrl.toString(), {
      status: 302,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Download route failed:", {
      error,
      path: "/api/download",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      createApiResponse(false, undefined, "Internal Server Error"),
      { status: 500 }
    );
  }
} 