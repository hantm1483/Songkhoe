"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Article type from database
 */
export interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

/**
 * Query keys for articles
 */
export const articlesKeys = {
  all: ["articles"] as const,
  lists: () => [...articlesKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...articlesKeys.lists(), filters] as const,
  details: () => [...articlesKeys.all, "detail"] as const,
  detail: (id: string) => [...articlesKeys.details(), id] as const,
};

/**
 * Fetch articles from API
 */
async function fetchArticles(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<{ articles: Article[]; count: number }> {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));

  const res = await fetch(`/api/articles?${params.toString()}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch articles");
  }
  const json = await res.json();
  return { articles: json.data?.articles || [], count: json.data?.count || 0 };
}

/**
 * Hook to fetch articles
 * Uses 5 minutes staleTime since articles don't change frequently
 */
export function useArticles(options?: {
  category?: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}) {
  const { category, limit = 20, offset = 0, enabled = true } = options || {};

  return useQuery({
    queryKey: articlesKeys.list({ category, limit, offset }),
    queryFn: () => fetchArticles({ category, limit, offset }),
    // Articles staleTime: 5 minutes (public content, changes infrequently)
    staleTime: 5 * 60 * 1000,
    // Don't refetch while window has focus
    refetchOnWindowFocus: false,
    enabled,
  });
}

/**
 * Hook to create a new article
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      category?: string;
      content?: string;
      image_url?: string;
    }) => {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create article");
      }
      const json = await res.json();
      return json.data?.article;
    },
    onSuccess: () => {
      // Invalidate article queries after creating
      queryClient.invalidateQueries({ queryKey: articlesKeys.lists() });
    },
  });
}

/**
 * Hook to subscribe to newsletter
 */
export function useSubscribeNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to subscribe");
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      // Invalidate article queries after subscription
      queryClient.invalidateQueries({ queryKey: articlesKeys.lists() });
    },
  });
}