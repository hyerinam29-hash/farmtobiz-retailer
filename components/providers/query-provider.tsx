/**
 * @file components/providers/query-provider.tsx
 * @description React Query Provider
 *
 * React Query를 사용하기 위한 QueryClientProvider입니다.
 * RootLayout에 추가하여 전역에서 React Query를 사용할 수 있도록 합니다.
 *
 * @dependencies
 * - @tanstack/react-query
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSR을 위해 기본 설정
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

