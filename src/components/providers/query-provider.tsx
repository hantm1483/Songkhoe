"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider wraps the app with React Query's QueryClientProvider.
 * Configures default staleTime and gcTime for caching.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default staleTime: 1 minute for user data
            staleTime: 60 * 1000,
            // gcTime: 30 minutes - data stays in cache for 30 mins after last use
            gcTime: 30 * 60 * 1000,
            // Retry failed requests once
            retry: 1,
            // Refetch on window focus for important data
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Retry mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export { QueryClient };