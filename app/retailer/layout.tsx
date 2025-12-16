/**
 * @file app/retailer/layout.tsx
 * @description 소매점 페이지 레이아웃
 *
 * 모든 소매점 페이지를 보호하는 레이아웃입니다.
 * requireRetailer()를 통해 소매점 권한을 확인하고,
 * 소매점 전용 헤더와 사이드바를 제공합니다.
 *
 * 주요 기능:
 * 1. 소매점 권한 체크 (requireRetailer)
 * 2. 헤더 컴포넌트 (로고, 사용자 메뉴, 로그아웃)
 * 3. 사이드바 네비게이션 (데스크톱: 고정, 모바일: 햄버거 메뉴)
 * 4. 공통 레이아웃 구조
 *
 * 예외 처리:
 * - 결제 성공/실패 페이지는 토스페이먼츠 리다이렉트로 접근하므로
 *   인증 체크를 건너뛰고 레이아웃 없이 렌더링합니다.
 *
 * @dependencies
 * - lib/clerk/auth.ts (requireRetailer)
 * - components/retailer/header.tsx (헤더)
 * - components/retailer/sidebar.tsx (사이드바)
 */

export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { requireRetailer } from "@/lib/clerk/auth";
import RetailerLayoutClient from "./layout-client";

export default async function RetailerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 현재 요청 경로 확인 (여러 방법으로 확인)
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // URL에서 직접 경로 추출 시도
  const referer = headersList.get("referer") || "";
  let urlPath = "";
  try {
    if (referer) {
      urlPath = new URL(referer).pathname;
    }
  } catch {
    // URL 파싱 실패 시 무시
  }
  
  // 최종 경로 확인 (우선순위: x-pathname > referer)
  const finalPathname = pathname || urlPath;
  
  console.log("🔍 [retailer] 레이아웃: 경로 확인", {
    pathname,
    referer,
    urlPath,
    finalPathname,
  });

  // 결제 성공/실패 페이지는 레이아웃 없이 렌더링 (인증 체크 건너뛰기)
  // "success" 또는 "fail"이 포함되어 있으면 건너뛰기
  if (finalPathname.includes("success") || 
      finalPathname.includes("fail") ||
      finalPathname.includes("/payment/success") || 
      finalPathname.includes("/payment/fail")) {
    console.log("🔓 [retailer] 레이아웃: 결제 페이지 - 인증 체크 건너뜀", {
      finalPathname,
    });
    return <>{children}</>;
  }

  // 일반 소매점 페이지는 인증 체크
  const profile = await requireRetailer();

  console.log("✅ [retailer] 레이아웃: 권한 확인됨", {
    email: profile.email,
    role: profile.role,
  });

  return <RetailerLayoutClient>{children}</RetailerLayoutClient>;
}

