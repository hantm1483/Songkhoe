/**
 * API Response Helpers
 * Provides consistent response format for all API endpoints
 * Zero Trust: Includes security headers in all responses
 */

export interface ApiError {
  message: string;
  code: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  data: null;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Security headers for all API responses (Zero Trust)
 */
export const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
} as const;

/**
 * Create a successful response with security headers
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return { data, error: null };
}

/**
 * Create an error response with security headers
 */
export function errorResponse(message: string, code: string = "INTERNAL_ERROR"): ApiResponse<never> {
  return {
    data: null,
    error: { message, code },
  };
}

/**
 * Format database error for API response
 */
export function databaseError(error: Error): ApiResponse<never> {
  console.error("Database error:", error.message);
  return errorResponse("Lỗi cơ sở dữ liệu", "DATABASE_ERROR");
}

/**
 * Format validation error for API response
 */
export function validationError(message: string): ApiResponse<never> {
  return errorResponse(message, "VALIDATION_ERROR");
}

/**
 * Format not found error for API response
 */
export function notFoundError(resource: string): ApiResponse<never> {
  return errorResponse(`${resource} không tìm thấy`, "NOT_FOUND");
}

/**
 * Format unauthorized error for API response
 */
export function unauthorizedError(): ApiResponse<never> {
  return errorResponse("Bạn cần đăng nhập để thực hiện thao tác này", "UNAUTHORIZED");
}

/**
 * Format rate limit error for API response
 */
export function rateLimitError(retryAfter?: number): ApiResponse<never> {
  return errorResponse(
    "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
    "RATE_LIMITED"
  );
}

/**
 * Parse and validate JSON body
 */
export async function parseBody<T>(request: Request): Promise<T | null> {
  try {
    const body = await request.json();
    return body as T;
  } catch {
    return null;
  }
}

/**
 * Get security headers object for Response construction
 */
export function getSecurityHeaders(): Record<string, string> {
  return { ...SECURITY_HEADERS };
}