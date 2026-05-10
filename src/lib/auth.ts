import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ProfileInsert } from "@/lib/supabase/database.types";

/**
 * Create profile for newly registered user
 * Called from auth callback/API route after user creation
 */
export async function createUserProfile(userId: string, email: string, fullName: string): Promise<{ success: boolean; error?: string }> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Read-only in this context
        },
      },
    }
  );

  const profile: ProfileInsert = {
    id: userId,
    email,
    full_name: fullName,
  };

  const { error } = await supabase.from("profiles").insert(profile);

  if (error) {
    console.error("Error creating profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: { full_name?: string; avatar_url?: string }
): Promise<{ success: boolean; error?: string }> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Read-only in this context
        },
      },
    }
  );

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<{ profile: ProfileInsert | null; error?: string }> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Read-only in this context
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error getting profile:", error);
    return { profile: null, error: error.message };
  }

  return { profile: data as ProfileInsert };
}

/**
 * Password reset request
 * Sends password reset email to user
 */
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password`,
  });

  if (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}