"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LabResult } from "@/lib/supabase/database.types";

/**
 * Query keys for lab results
 */
export const labResultsKeys = {
  all: ["lab-results"] as const,
  lists: () => [...labResultsKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...labResultsKeys.lists(), filters] as const,
  details: () => [...labResultsKeys.all, "detail"] as const,
  detail: (id: string) => [...labResultsKeys.details(), id] as const,
};

/**
 * Fetch lab results from API
 */
async function fetchLabResults(limit = 50, type?: string): Promise<{ results: LabResult[]; total: number }> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (type) params.set("type", type);

  const res = await fetch(`/api/lab-results?${params.toString()}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch lab results");
  }
  const json = await res.json();
  return { results: json.data?.results || [], total: json.data?.total || 0 };
}

/**
 * Hook to fetch lab results
 */
export function useLabResults(options?: {
  limit?: number;
  type?: string;
  enabled?: boolean;
}) {
  const { limit = 50, type, enabled = true } = options || {};

  return useQuery({
    queryKey: labResultsKeys.list({ limit, type }),
    queryFn: () => fetchLabResults(limit, type),
    // User data staleTime: 1 minute
    staleTime: 60 * 1000,
    // Don't refetch while window has focus
    refetchOnWindowFocus: false,
    enabled,
  });
}

/**
 * Hook to create a new lab result
 */
export function useCreateLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      type: string;
      value: number;
      unit?: string;
      recordedAt?: string;
      notes?: string;
    }) => {
      const res = await fetch("/api/lab-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create lab result");
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      // Invalidate lab results queries after creating
      queryClient.invalidateQueries({ queryKey: labResultsKeys.lists() });
    },
  });
}

/**
 * Hook to update a lab result
 */
export function useUpdateLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        type?: string;
        value?: number;
        unit?: string;
        recordedAt?: string;
        notes?: string;
      };
    }) => {
      const res = await fetch(`/api/lab-results/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update lab result");
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: (data) => {
      // Invalidate lab results queries after updating
      queryClient.invalidateQueries({ queryKey: labResultsKeys.lists() });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: labResultsKeys.detail(data.id) });
      }
    },
  });
}

/**
 * Hook to delete a lab result
 */
export function useDeleteLabResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/lab-results/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete lab result");
      }
      return true;
    },
    onSuccess: () => {
      // Invalidate lab results queries after deleting
      queryClient.invalidateQueries({ queryKey: labResultsKeys.lists() });
    },
  });
}