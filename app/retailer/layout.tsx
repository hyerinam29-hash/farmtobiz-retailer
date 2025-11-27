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
 * @dependencies
 * - lib/clerk/auth.ts (requireRetailer)
 * - components/retailer/header.tsx (헤더)
 * - components/retailer/sidebar.tsx (사이드바)
 */

import { requireRetailer } from "@/lib/clerk/auth";
import RetailerLayoutClient from "./layout-client";

export default async function RetailerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 소매점 또는 관리자 권한 확인
  const profile = await requireRetailer();

  console.log("✅ [retailer] 레이아웃: 권한 확인됨", {
    email: profile.email,
    role: profile.role,
  });

  return <RetailerLayoutClient>{children}</RetailerLayoutClient>;
}

