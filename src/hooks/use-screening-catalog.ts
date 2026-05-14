"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ScreeningCatalog } from "@/lib/supabase/database.types";

/**
 * Query keys for screening catalog
 */
export const screeningCatalogKeys = {
  all: ["screening-catalog"] as const,
  lists: () => [...screeningCatalogKeys.all, "list"] as const,
  list: () => [...screeningCatalogKeys.lists()],
  details: () => [...screeningCatalogKeys.all, "detail"] as const,
  detail: (id: string) => [...screeningCatalogKeys.details(), id] as const,
};

/**
 * Default catalog items for demo users
 */
export const DEFAULT_SCREENING_CATALOG: Omit<ScreeningCatalog, "id" | "user_id" | "created_at" | "updated_at">[] = [
  { content: "HbA1c", target: "< 7.0%", frequency: "Mỗi 3-6 tháng", meaning: "Đánh giá kiểm soát đường huyết trong 3 tháng qua." },
  { content: "Đường huyết lúc đói", target: "3.9 - 7.2 mmol/L", frequency: "Hàng ngày / Định kỳ", meaning: "Kiểm soát đường huyết tại thời điểm đo." },
  { content: "Huyết áp", target: "< 130/80 mmHg", frequency: "Mỗi lần thăm khám", meaning: "Giảm nguy cơ đột quỵ và biến chứng tim mạch." },
  { content: "Soi đáy mắt", target: "Không tổn thương", frequency: "Định kỳ 12 tháng", meaning: "Phát hiện sớm biến chứng võng mạc gây mù lòa." },
  { content: "Protein niệu (Thận)", target: "Âm tính", frequency: "Định kỳ 12 tháng", meaning: "Phát hiện sớm dấu hiệu suy thận do tiểu đường." },
];

/**
 * Fetch screening catalog from API
 */
async function fetchScreeningCatalog(): Promise<{
  catalog: ScreeningCatalog[];
  isDefault: boolean;
}> {
  const res = await fetch("/api/screening-catalog");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch screening catalog");
  }
  const json = await res.json();
  return json.data || { catalog: [], isDefault: true };
}

/**
 * Hook to fetch screening catalog
 * Uses 1 hour staleTime since catalog changes infrequently
 */
export function useScreeningCatalog(options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: screeningCatalogKeys.list(),
    queryFn: fetchScreeningCatalog,
    // Screening catalog staleTime: 1 hour (rarely changes)
    staleTime: 60 * 60 * 1000,
    // Don't refetch while window has focus
    refetchOnWindowFocus: false,
    enabled,
  });
}

/**
 * Hook to create a new catalog item
 */
export function useCreateCatalogItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      content: string;
      target?: string;
      frequency?: string;
      meaning?: string;
    }) => {
      const res = await fetch("/api/screening-catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create catalog item");
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      // Invalidate screening catalog queries after creating
      queryClient.invalidateQueries({ queryKey: screeningCatalogKeys.lists() });
    },
  });
}

/**
 * Hook to update a catalog item
 */
export function useUpdateCatalogItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        content?: string;
        target?: string;
        frequency?: string;
        meaning?: string;
      };
    }) => {
      const res = await fetch(`/api/screening-catalog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update catalog item");
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      // Invalidate screening catalog queries after updating
      queryClient.invalidateQueries({ queryKey: screeningCatalogKeys.lists() });
    },
  });
}

/**
 * Hook to delete a catalog item
 */
export function useDeleteCatalogItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/screening-catalog/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete catalog item");
      }
      return true;
    },
    onSuccess: () => {
      // Invalidate screening catalog queries after deleting
      queryClient.invalidateQueries({ queryKey: screeningCatalogKeys.lists() });
    },
  });
}