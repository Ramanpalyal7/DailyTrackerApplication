// Central constants for the application

export const REDIS_KEYS = {
  ACTIVE_VISITOR_PREFIX: "active_visitor:",
  ACTIVE_VISITOR_SET: "active_visitors_set",
  RATE_LIMIT_PREFIX: "rate_limit:",
} as const;

export const TIME_CONSTANTS = {
  ACTIVE_VISITOR_TTL: 60, // 60 seconds
  HEARTBEAT_INTERVAL: 30000, // 30 seconds in milliseconds
  RATE_LIMIT_WINDOW: 60, // 60 seconds window
  MAX_REQUESTS_PER_WINDOW: 30, // Max 30 requests per minute per IP
} as const;

export const HEADERS = {
  CACHE_CONTROL_NO_STORE: "no-store, no-cache, must-revalidate, proxy-revalidate",
  CACHE_CONTROL_PUBLIC: "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
} as const;

export const ERROR_MESSAGES = {
  MISSING_VISITOR_ID: "visitorId is required",
  MISSING_PATH: "path is required",
  RATE_LIMITED: "Too many requests, please try again later",
  DATABASE_ERROR: "Database operation failed",
  REDIS_ERROR: "Redis operation failed",
  NOT_FOUND: "Resource not found",
  INVALID_PLATFORM: "Invalid platform specified",
} as const;