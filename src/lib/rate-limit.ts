/**
 * Rate Limiting Utility
 * Uses rate_limits table for per-user rate limiting
 * With in-memory fallback if RPC is unavailable
 */

import { createClient } from "./supabase/server";

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export const RATE_LIMIT_CONFIGS = {
  healthData: { limit: 100, windowMs: 60000 }, // 100 req/min
  aiChat: { limit: 50, windowMs: 3600000 }, // 50 req/hour
  aiSummary: { limit: 10, windowMs: 3600000 }, // 10 summaries/hour
} as const;

export type RateLimitAction = keyof typeof RATE_LIMIT_CONFIGS;

// In-memory fallback storage (per-process, reset on restart)
const memoryFallback: Map<string, { count: number; resetAt: number }> = new Map();

/**
 * Check if user has exceeded rate limit
 */
export async function checkRateLimit(
  userId: string,
  action: RateLimitAction
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const config = RATE_LIMIT_CONFIGS[action];
  const windowStart = new Date(Date.now() - config.windowMs);

  const supabase = await createClient();

  // Try to use RPC function for atomic increment
  const { data, error } = await supabase.rpc("atomic_rate_increment", {
    p_user_id: userId,
    p_action: action,
    p_window_start: windowStart.toISOString(),
  });

  if (error) {
    // If RPC doesn't exist, fallback to in-memory check
    console.warn("Rate limit RPC not available, using in-memory fallback:", error.message);

    const memKey = `${userId}:${action}`;
    const now = Date.now();
    const entry = memoryFallback.get(memKey);

    if (!entry || now > entry.resetAt) {
      // New window
      const newResetAt = now + config.windowMs;
      memoryFallback.set(memKey, { count: 1, resetAt: newResetAt });
      return {
        allowed: true,
        remaining: config.limit - 1,
        resetAt: new Date(newResetAt),
      };
    }

    // Existing window, increment
    entry.count += 1;
    const remaining = Math.max(0, config.limit - entry.count);
    const allowed = entry.count <= config.limit;

    return {
      allowed,
      remaining,
      resetAt: new Date(entry.resetAt),
    };
  }

  const count = data?.count ?? 0;
  const remaining = Math.max(0, config.limit - count);

  return {
    allowed: count <= config.limit,
    remaining,
    resetAt: new Date(Date.now() + config.windowMs),
  };
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(
  userId: string,
  action: RateLimitAction
): Promise<{ count: number; limit: number; resetAt: Date }> {
  const config = RATE_LIMIT_CONFIGS[action];
  const windowStart = new Date(Date.now() - config.windowMs);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("user_id", userId)
    .eq("action", action)
    .gte("window_start", windowStart.toISOString())
    .order("window_start", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return {
      count: 0,
      limit: config.limit,
      resetAt: new Date(Date.now() + config.windowMs),
    };
  }

  return {
    count: data.count,
    limit: config.limit,
    resetAt: new Date(Date.now() + config.windowMs),
  };
}

/**
 * Rate limit decorator for API handlers
 */
export function withRateLimit<T extends (...args: unknown[]) => unknown>(
  handler: T,
  action: RateLimitAction
): T {
  return (async (...args: unknown[]) => {
    const request = args[0] as Request;

    // Get user from auth header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ data: null, error: { message: "Bạn cần đăng nhập", code: "UNAUTHORIZED" } }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // For now, extract user ID from request context
    // In production, this would come from session
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return new Response(
        JSON.stringify({ data: null, error: { message: "Bạn cần đăng nhập", code: "UNAUTHORIZED" } }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { allowed, resetAt } = await checkRateLimit(userId, action);

    if (!allowed) {
      const retryAfter = Math.ceil((resetAt.getTime() - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          data: null,
          error: { message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.", code: "RATE_LIMITED" },
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }

    return handler(...args);
  }) as T;
}