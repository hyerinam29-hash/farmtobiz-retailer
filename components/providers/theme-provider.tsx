/**
 * @file components/providers/theme-provider.tsx
 * @description Theme Provider (next-themes)
 *
 * 다크모드/라이트모드를 지원하기 위한 ThemeProvider입니다.
 * RootLayout에 추가하여 전역에서 테마를 사용할 수 있도록 합니다.
 *
 * @dependencies
 * - next-themes
 */

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

