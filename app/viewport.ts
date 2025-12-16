import type { Viewport } from "next";

/**
 * Viewport 설정
 * Next.js 15에서 themeColor는 viewport export로 이동해야 합니다.
 * 
 * 이 파일은 모바일 브라우저의 뷰포트 설정과 테마 색상을 정의합니다.
 */
export const viewport: Viewport = {
  themeColor: "#5B9A6F",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

