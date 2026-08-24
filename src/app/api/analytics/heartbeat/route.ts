import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import {
  REDIS_KEYS,
  TIME_CONSTANTS,
  HEADERS,
  ERROR_MESSAGES,
} from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";
import { createApiResponse, getClientIp } from "@/lib/utils";
import type { HeartbeatResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/analytics/heartbeat
 * 
 * Records a heartbeat from an active visitor and returns the current
 * active visitor count. Uses Redis with TTL for automatic cleanup
 * of inactive visitors.
 * 
 * Body: { visitorId: string, path?: string }
 * Response: { success: boolean, data: HeartbeatResponse }
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimit(request, {
      maxRequests: 60, // Heartbeats every 30s = 2 per minute
      windowInSeconds: TIME_CONSTANTS.RATE_LIMIT_WINDOW,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Parse and validate request body
    const body = await request.json();
    const { visitorId, path = "/" } = body;

    if (!visitorId || typeof visitorId !== "string") {
      return NextResponse.json(
        createApiResponse(false, undefined, ERROR_MESSAGES.MISSING_VISITOR_ID),
        { status: 400, headers: { "Cache-Control": HEADERS.CACHE_CONTROL_NO_STORE } }
      );
    }

    // Store visitor in Redis with TTL
    const redisKey = `${REDIS_KEYS.ACTIVE_VISITOR_PREFIX}${visitorId}`;
    const visitorData = {
      path,
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || "unknown",
      lastSeen: new Date().toISOString(),
    };

    // Use pipeline for atomic operations
    const pipeline = redis.pipeline();
    pipeline.set(redisKey, JSON.stringify(visitorData), {
      ex: TIME_CONSTANTS.ACTIVE_VISITOR_TTL,
    });
    
    // Add to active visitors set for easier counting
    pipeline.sadd(REDIS_KEYS.ACTIVE_VISITOR_SET, visitorId);
    pipeline.expire(REDIS_KEYS.ACTIVE_VISITOR_SET, TIME_CONSTANTS.ACTIVE_VISITOR_TTL);
    
    await pipeline.exec();

    // Get current active visitor count
    const activeCount = await redis.scard(REDIS_KEYS.ACTIVE_VISITOR_SET);

    const responseData: HeartbeatResponse = {
      activeVisitors: activeCount,
      ttl: TIME_CONSTANTS.ACTIVE_VISITOR_TTL,
      visitorId,
    };

    return NextResponse.json(
      createApiResponse(true, responseData),
      { headers: { "Cache-Control": HEADERS.CACHE_CONTROL_NO_STORE } }
    );
  } catch (error) {
    console.error("Heartbeat tracking failed:", {
      error,
      path: "/api/analytics/heartbeat",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      createApiResponse(false, undefined, ERROR_MESSAGES.REDIS_ERROR),
      { status: 500, headers: { "Cache-Control": HEADERS.CACHE_CONTROL_NO_STORE } }
    );
  }
}

/**
 * GET /api/analytics/heartbeat
 * 
 * Returns current active visitor count without updating Redis
 */
export async function GET(request: NextRequest) {
  try {
    const rateLimitResponse = await rateLimit(request, {
      maxRequests: 30,
      windowInSeconds: TIME_CONSTANTS.RATE_LIMIT_WINDOW,
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const activeCount = await redis.scard(REDIS_KEYS.ACTIVE_VISITOR_SET);

    return NextResponse.json(
      createApiResponse(true, {
        activeVisitors: activeCount,
        timestamp: new Date().toISOString(),
      }),
      { headers: { "Cache-Control": "no-cache" } }
    );
  } catch (error) {
    console.error("Failed to fetch active visitors:", error);
    return NextResponse.json(
      createApiResponse(false, undefined, ERROR_MESSAGES.REDIS_ERROR),
      { status: 500 }
    );
  }
}