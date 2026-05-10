/* @jsxImportSource react */
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface AuthState {
  user: unknown;
  session: unknown;
  profile: unknown;
  loading: boolean;
}

interface AuthActions {
  signIn: (credentials: { email: string; password: string }) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
}

type AuthContextValue = AuthState & AuthActions;

const AuthCtx = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<unknown>(null);
  const [session, setSession] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = getClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data);
  }, []);

  useEffect(() => {
    const supabase = getClient();
    initAuth();

    async function initAuth() {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (s) {
        setSession(s);
        setUser(s.user);
        await fetchProfile(s.user.id);
      }
      setLoading(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) await fetchProfile(s.user.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => { subscription.unsubscribe(); };
  }, [fetchProfile]);

  const signIn = async (creds: { email: string; password: string }) => {
    const supabase = getClient();
    const { error } = await supabase.auth.signInWithPassword(creds);
    return { error };
  };

  const signOut = async () => {
    const supabase = getClient();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const value: AuthContextValue = { user, session, profile, loading, signIn, signOut };

  return React.createElement(AuthCtx.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}