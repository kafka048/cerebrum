import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 10, // 10 seconds
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Do not retry on 401 Unauthorized or 404 Not Found
          if (typeof error === "object" && error !== null && "status" in error) {
            const status = (error as { status: number }).status;
            if (status === 401 || status === 404) return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}
