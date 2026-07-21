import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,          // 1 minute before data is considered stale
      gcTime: 5 * 60_000,         // Keep unused cache for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch when tab regains focus
      retry: 1,                    // Retry failed queries once
    },
  },
});
