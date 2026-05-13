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

  if (authError || !user) {
    // No Supabase session - check for guest session cookie
    // The guest session cookie is set by the login page with the device ID
    const cookieStore = supabase.auth.getSession();
    // Note: getSession returns { data: { session } } synchronously in server context
    // We need to access cookies directly
    const { cookies } = await import("next/headers");
    const cookieStore2 = await cookies();
    const guestCookie = cookieStore2.get("sk_guest_session");

    if (guestCookie?.value) {
      return {
        userId: `demo-${guestCookie.value}`,
        isDemo: true,
      };
    }

    return null;
  }

  return {
    userId: user.id,
    isDemo: false,
  };
}

/**
 * Require auth - returns null if neither real auth nor demo available
 */
export async function requireAuth(): Promise<AuthContext | null> {
  return getAuthContext();
}