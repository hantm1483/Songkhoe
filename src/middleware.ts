import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Allow public routes
  const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/"];
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for protected routes
  const protectedPaths = ["/trangchu", "/bua-an", "/thuoc", "/nhatky", "/xet-nghiem", "/kien-thuc", "/troly-ai", "/memory"];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Create Supabase client for middleware
  const supabase = await createClient();

  // Get session from cookies
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  // Redirect to login if no session
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};