// Rate limiting utility using Upstash Redis

import { NextRequest, NextResponse } from "next/server";
import { redis } from "./redis";
import { REDIS_KEYS, TIME_CONSTANTS, ERROR_MESSAGES } from "./constants";
import { getClientIp } from "./utils";

type RateLimitConfig = {
  maxRequests?: number;
  windowInSeconds?: number;
};

/**
 * Rate limit middleware for API routes
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {}
): Promise<NextResponse | null> {
  const {
    maxRequests = TIME_CONSTANTS.MAX_REQUESTS_PER_WINDOW,
    windowInSeconds = TIME_CONSTANTS.RATE_LIMIT_WINDOW,
  } = config;

  const clientIp = getClientIp(request);
  const key = `${REDIS_KEYS.RATE_LIMIT_PREFIX}${clientIp}`;

  try {
    const currentCount = await redis.incr(key);

    // Set expiry on first request
    if (currentCount === 1) {
      await redis.expire(key, windowInSeconds);
    }

    if (currentCount > maxRequests) {
      return NextResponse.json(
        {
          success: false,
          error: ERROR_MESSAGES.RATE_LIMITED,
          retryAfter: windowInSeconds,
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(windowInSeconds),
          },
        }
      );
    }

    return null; // Allow the request
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return null; // Fail open if Redis is down
  }
}

/**
 * Get remaining rate limit for a client
 */
export async function getRateLimitRemaining(
  request: NextRequest
): Promise<number> {
  try {
    const clientIp = getClientIp(request);
    const key = `${REDIS_KEYS.RATE_LIMIT_PREFIX}${clientIp}`;
    const count = await redis.get<number>(key);
    return Math.max(0, TIME_CONSTANTS.MAX_REQUESTS_PER_WINDOW - (count || 0));
  } catch {
    return TIME_CONSTANTS.MAX_REQUESTS_PER_WINDOW;
  }
}