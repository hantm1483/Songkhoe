"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Meal } from "@/lib/supabase/database.types";

const QUERY_KEY = {
  all: ["meals"] as const,
  lists: () => [...QUERY_KEY.all, "list"] as const,
  list: () => [...QUERY_KEY.lists()] as const,
};

async function fetchMeals(): Promise<Meal[]> {
  const res = await fetch("/api/meals");
  if (!res.ok) throw new Error("Failed to fetch meals");
  const data = await res.json();
  return data.data?.meals || [];
}

async function createMeal(meal: {
  name: string;
  gi_level?: string;
  time?: string;
  notes?: string;
}): Promise<Meal> {
  const res = await fetch("/api/meals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meal),
  });
  if (!res.ok) throw new Error("Failed to create meal");
  const data = await res.json();
  return data.data;
}

async function deleteMeal(id: string): Promise<void> {
  const res = await fetch(`/api/meals/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete meal");
}

export function useMeals() {
  return useQuery({
    queryKey: QUERY_KEY.list(),
    queryFn: fetchMeals,
    staleTime: 5 * 60 * 1000, // 5 minutes - semi-static data
    gcTime: 30 * 60 * 1000,
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.lists() });
    },
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.lists() });
    },
  });
}