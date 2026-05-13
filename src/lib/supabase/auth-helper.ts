/**
 * Auth helper for API routes - supports both real auth and demo mode
 */
import { createClient } from "./server";
import { getDemoUid } from "../demo-user";

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

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    // Demo mode - use device ID as user_id
    const demoUid = getDemoUid();
    if (!demoUid) return null;

    return {
      userId: `demo-${demoUid}`,
      isDemo: true,
    };
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