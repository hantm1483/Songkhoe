/**
 * Auth helper for API routes - supports both real auth and demo mode
 */
import { createClient } from "./server";

export interface AuthContext {
  userId: string;
  isDemo: boolean;
}

/**
 * Get auth context - returns demo user if not authenticated
 * API routes should use this instead of direct auth check
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createClient();

  // First try getUser (validates JWT with Supabase)
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!authError && user) {
    return {
      userId: user.id,
      isDemo: false,
    };
  }

  // getUser() failed - try getSession() as fallback to get session from cookie
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    return {
      userId: session.user.id,
      isDemo: false,
    };
  }

  // No Supabase session - check for guest session cookie
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const guestCookie = cookieStore.get("sk_guest_session");

  if (guestCookie?.value) {
    return {
      userId: `demo-${guestCookie.value}`,
      isDemo: true,
    };
  }

  console.error("Auth check failed - getUser error:", authError?.message);
  return null;
}

/**
 * Require auth - returns null if neither real auth nor demo available
 */
export async function requireAuth(): Promise<AuthContext | null> {
  return getAuthContext();
}