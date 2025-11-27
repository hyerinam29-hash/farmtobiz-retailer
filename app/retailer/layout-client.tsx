/**
 * @file app/retailer/layout-client.tsx
 * @description 소매점 레이아웃 클라이언트 컴포넌트
 *
 * 사이드바 상태 관리를 위한 클라이언트 컴포넌트입니다.
 * 서버 컴포넌트인 layout.tsx에서 사용됩니다.
 *
 * 주요 기능:
 * 1. 사이드바 열림/닫힘 상태 관리
 * 2. 데스크톱: 사이드바 고정 표시
 * 3. 모바일: 햄버거 메뉴로 사이드바 제어
 */

"use client";

import { useState } from "react";
import RetailerHeader from "@/components/retailer/header";
import RetailerSidebar from "@/components/retailer/sidebar";

interface RetailerLayoutClientProps {
  children: React.ReactNode;
}

export default function RetailerLayoutClient({
  children,
}: RetailerLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* 사이드바 (데스크톱: 고정, 모바일: 오버레이) */}
      <RetailerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* 헤더 */}
        <RetailerHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* 메인 컨텐츠 */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}


