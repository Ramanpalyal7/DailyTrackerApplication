import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { REDIS_KEYS, HEADERS, ERROR_MESSAGES } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";
import { createApiResponse, getTodayString } from "@/lib/utils";
import type { AnalyticsStats } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/analytics/stats
 * 
 * Returns comprehensive analytics statistics including:
 * - Active visitors (from Redis)
 * - Total page views (from PostgreSQL)
 * - Total downloads (from PostgreSQL)
 * - Today's stats (from PostgreSQL)
 */
export async function GET(request: NextRequest) {
  try {
    const rateLimitResponse = await rateLimit(request, {
      maxRequests: 20,
      windowInSeconds: 60,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Fetch all data in parallel for performance
    const [activeVisitors, totalPageViews, totalDownloads, todayViews, todayDownloads] =
      await Promise.all([
        redis.scard(REDIS_KEYS.ACTIVE_VISITOR_SET),
        prisma.pageView.count(),
        prisma.downloadEvent.count(),
        prisma.pageView.count({
          where: {
            createdAt: {
              gte: todayStart,
              lt: todayEnd,
            },
          },
        }),
        prisma.downloadEvent.count({
          where: {
            createdAt: {
              gte: todayStart,
              lt: todayEnd,
            },
          },
        }),
      ]);

    const stats: AnalyticsStats = {
      activeVisitors,
      totalPageViews,
      totalDownloads,
      today: {
        date: getTodayString(),
        pageViews: todayViews,
        downloads: todayDownloads,
      },
    };

    return NextResponse.json(
      createApiResponse(true, stats),
      {
        headers: {
          "Cache-Control": "public, max-age=2, s-maxage=2, stale-while-revalidate=60"
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch analytics stats:", {
      error,
      path: "/api/analytics/stats",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      createApiResponse(false, undefined, ERROR_MESSAGES.DATABASE_ERROR),
      { status: 500, headers: { "Cache-Control": HEADERS.CACHE_CONTROL_NO_STORE } }
    );
  }
}