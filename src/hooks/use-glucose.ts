"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GlucoseLog } from "@/lib/supabase/database.types";

const QUERY_KEY = {
  all: ["glucose"] as const,
  lists: () => [...QUERY_KEY.all, "list"] as const,
  list: (filters: { limit?: number; offset?: number }) =>
    [...QUERY_KEY.lists(), filters] as const,
};

async function fetchGlucoseLogs(
  limit = 50,
  offset = 0
): Promise<GlucoseLog[]> {
  const res = await fetch(`/api/glucose?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error("Failed to fetch glucose logs");
  const data = await res.json();
  return data.data?.logs || [];
}

async function createGlucoseLog(log: {
  value: number;
  timing?: string;
  notes?: string;
  measuredAt?: string;
}): Promise<GlucoseLog> {
  const res = await fetch("/api/glucose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log),
  });
  if (!res.ok) throw new Error("Failed to create glucose log");
  const data = await res.json();
  return data.data;
}

async function deleteGlucoseLog(id: string): Promise<void> {
  const res = await fetch(`/api/glucose/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete glucose log");
}

async function updateGlucoseLog(
  id: string,
  updates: Partial<GlucoseLog>
): Promise<GlucoseLog> {
  const res = await fetch(`/api/glucose/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update glucose log");
  const data = await res.json();
  return data.data;
}

export function useGlucoseLogs(limit = 100, offset = 0) {
  return useQuery({
    queryKey: QUERY_KEY.list({ limit, offset }),
    queryFn: () => fetchGlucoseLogs(limit, offset),
    staleTime: 60 * 1000, // 1 minute - user data changes frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useCreateGlucoseLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGlucoseLog,
    onSuccess: () => {
      // Invalidate all glucose queries to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.lists() });
    },
  });
}

export function useUpdateGlucoseLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<GlucoseLog>;
    }) => updateGlucoseLog(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.lists() });
    },
  });
}

export function useDeleteGlucoseLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGlucoseLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.lists() });
    },
  });
}