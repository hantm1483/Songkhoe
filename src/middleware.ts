import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";
import { getDemoUid } from "@/lib/demo-user";

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("Content-Security-Policy", "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://auth.us-east-1.supabase.com https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.cookiebot.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://auth.us-east-1.supabase.com wss://*.supabase.co;");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

// Paths that require authentication (either guest or account)
const authRequiredPaths = ["/trangchu", "/bua-an", "/thuoc", "/nhatky", "/xet-nghiem", "/kien-thuc", "/troly-ai", "/memory", "/tracking", "/care"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow auth pages through
  if (pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Allow public paths (blog, news, etc.)
  const publicPaths = ["/", "/blog", "/blood-sugar", "/nutrition", "/lifestyle", "/screening", "/health-diary", "/knowledge", "/news"];
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path));

  if (isPublicPath) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Check if path requires authentication
  const requiresAuth = authRequiredPaths.some((path) => pathname.startsWith(path));
  if (!requiresAuth) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Check Supabase session first (real authenticated user)
  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;

  if (session) {
    // Real authenticated user
    const response = NextResponse.next();
    response.headers.set("X-User-Id", session.user.id);
    response.headers.set("X-Auth-Method", "supabase-session");
    return addSecurityHeaders(response);
  }

  // Check for guest session cookie
  const guestSessionCookie = request.cookies.get("sk_guest_session");
  if (guestSessionCookie?.value) {
    // Guest user with device ID
    const response = NextResponse.next();
    response.headers.set("X-User-Id", `demo-${guestSessionCookie.value}`);
    response.headers.set("X-Auth-Method", "guest-session");
    return addSecurityHeaders(response);
  }

  // No session - redirect to login
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  const response = NextResponse.redirect(loginUrl);
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};