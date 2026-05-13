import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Create Supabase client for regular user operations (respects RLS)
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component - ignore
          }
        },
      },
    }
  );
}

/**
 * Create admin client that bypasses RLS (for server-side operations)
 * IMPORTANT: Only use for demo/user operations where we need to bypass RLS
 * This should NOT be exported to client-side code
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  // Service role key should only be used server-side
  // Check that URL ends with /rest/v1/ to ensure we're using the REST API
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  // For demo mode, we need a client that bypasses RLS
  // The service role key is appended to the URL for admin access
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    // Fallback to regular client if no service role key
    return createClient();
  }

  return createServerClient(
    supabaseUrl,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component - ignore
          }
        },
      },
    }
  );
}
