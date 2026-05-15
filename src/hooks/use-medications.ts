"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Medication } from "@/lib/supabase/database.types";

const QUERY_KEY = {
  all: ["medications"] as const,
  lists: () => [...QUERY_KEY.all, "list"] as const,
  list: () => [...QUERY_KEY.lists()] as const,
};

async function fetchMedications(): Promise<Medication[]> {
  const res = await fetch("/api/medications");
  if (!res.ok) throw new Error("Failed to fetch medications");
  const data = await res.json();
  return data.data?.medications || [];
}

async function createMedication(med: {
  name: string;
  dosage?: string;
  instructions?: string;
  scheduleTime?: string;
  frequency?: string;
}): Promise<Medication> {
  const res = await fetch("/api/medications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(med),
  });
  if (!res.ok) throw new Error("Failed to create medication");
  const data = await res.json();
  return data.data;
}

async function deleteMedication(id: string): Promise<void> {
  const res = await fetch(`/api/medications/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete medication");
}

export function useMedications() {
  return useQuery({
    queryKey: QUERY_KEY.list(),
    queryFn: fetchMedications,
    staleTime: 5 * 60 * 1000, // 5 minutes - semi-static data
    gcTime: 30 * 60 * 1000,
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.lists() });
    },
  });
}

export function useDeleteMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.lists() });
    },
  });
}