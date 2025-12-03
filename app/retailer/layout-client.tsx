/**
 * @file app/retailer/layout-client.tsx
 * @description 소매점 레이아웃 클라이언트 컴포넌트
 *
 * 소매점 페이지의 레이아웃을 제공하는 클라이언트 컴포넌트입니다.
 * 서버 컴포넌트인 layout.tsx에서 사용됩니다.
 *
 * 주요 기능:
 * 1. 헤더 네비게이션 표시
 * 2. 메인 컨텐츠 영역 제공
 */

"use client";

import PageHeader from "@/components/retailer/page-header";

interface RetailerLayoutClientProps {
  children: React.ReactNode;
}

export default function RetailerLayoutClient({
  children,
}: RetailerLayoutClientProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* 헤더 네비게이션 */}
      <PageHeader />

      {/* 메인 컨텐츠 */}
      <main className="flex-1 max-w-none mx-0 pt-0 px-0">{children}</main>
    </div>
  );
}


