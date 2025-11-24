/**
 * @file middleware.ts
 * @description Next.js 미들웨어 - Clerk 인증 처리
 *
 * 이 파일은 Next.js 미들웨어를 통해 모든 요청에 대해 Clerk 인증을 처리합니다.
 * Clerk의 clerkMiddleware를 사용하여 인증 상태를 확인하고 세션을 관리합니다.
 *
 * 주요 기능:
 * - 모든 라우트에서 Clerk 인증 확인
 * - 인증되지 않은 사용자 처리
 * - 공개 라우트와 보호된 라우트 구분
 * - /retailer/* 경로 보호 (미인증 사용자 리다이렉트)
 *
 * ⚠️ 주의:
 * - matcher 설정에 따라 특정 파일들은 미들웨어를 건너뜁니다
 * - 정적 파일(이미지, CSS, JS 등)은 자동으로 제외됩니다
 * - API 라우트는 항상 미들웨어를 통과합니다
 *
 * @dependencies
 * - @clerk/nextjs/server
 *
 * @see {@link https://clerk.com/docs/nextjs/middleware} - Clerk 미들웨어 문서
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * 보호된 라우트 매처
 * /retailer/* 경로는 인증이 필요합니다.
 */
const isProtectedRoute = createRouteMatcher(["/retailer(.*)"]);

/**
 * Clerk 미들웨어
 *
 * 모든 요청에 대해 Clerk 인증을 처리합니다.
 * /retailer/* 경로는 인증이 필요하며, 미인증 사용자는 로그인 페이지로 리다이렉트됩니다.
 */
export default clerkMiddleware(async (auth, req) => {
  // 보호된 라우트 확인
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!userId) {
      console.log("🚫 [middleware] 미인증 사용자 접근 차단:", req.nextUrl.pathname);
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    console.log("✅ [middleware] 인증된 사용자 접근 허용:", req.nextUrl.pathname);
  }
});

/**
 * 미들웨어 실행 조건 설정
 *
 * matcher 배열에 정의된 패턴과 일치하는 경로에만 미들웨어가 실행됩니다.
 *
 * 현재 설정:
 * - Next.js 내부 파일 제외 (_next)
 * - 정적 파일 제외 (이미지, CSS, JS, 폰트 등)
 * - API 라우트는 항상 실행
 */
export const config = {
  matcher: [
    // Next.js 내부 파일과 정적 파일 제외 (검색 파라미터에 포함된 경우 제외)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API 라우트는 항상 실행
    "/(api|trpc)(.*)",
  ],
};
