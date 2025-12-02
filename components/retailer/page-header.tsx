/**
 * @file components/retailer/page-header.tsx
 * @description 소매점 페이지 제목 헤더
 *
 * 현재 페이지의 제목만 표시하는 간단한 헤더입니다.
 * 사이드바 메뉴와 연동되어 페이지 제목을 자동으로 표시합니다.
 *
 * 주요 기능:
 * 1. 현재 경로에 따른 페이지 제목 자동 표시
 * 2. 모바일/태블릿/랩탑에서 햄버거 메뉴 버튼 제공
 * 3. 사이드바와 연동된 네비게이션
 *
 * @dependencies
 * - next/navigation (usePathname)
 * - lucide-react (Menu 아이콘)
 */

"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

interface PageHeaderProps {
  /** 사이드바 열기 함수 (모바일용) */
  onMenuClick?: () => void;
}

// 경로별 페이지 제목 매핑
const pageTitles: Record<string, string> = {
  "/retailer/dashboard": "대시보드",
  "/retailer/products": "상품 검색",
  "/retailer/orders": "주문 내역",
  "/retailer/profile": "마이페이지",
  "/retailer/cart": "장바구니",
  "/retailer/checkout": "결제",
};

// 경로 패턴으로 제목 찾기 (동적 라우트용)
function getPageTitle(pathname: string): string {
  // 정확히 일치하는 경우
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  // 경로가 시작하는 경우 (동적 라우트 처리)
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(path + "/")) {
      // 주문 상세 페이지인 경우
      if (pathname.startsWith("/retailer/orders/")) {
        return "주문 상세";
      }
      return title;
    }
  }

  // 기본값
  return "FarmToBiz";
}

export default function PageHeader({ onMenuClick }: PageHeaderProps) {
  const pathname = usePathname();
  // mounted 상태 제거 - pathname을 직접 사용하여 서버/클라이언트 일치 보장
  const pageTitle = pathname ? getPageTitle(pathname) : "FarmToBiz";

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 왼쪽: 햄버거 메뉴 + 페이지 제목 */}
          <div className="flex items-center gap-3">
            {/* 햄버거 메뉴 버튼 (모바일/태블릿/랩탑) */}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="xl:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                aria-label="메뉴 열기"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {/* 페이지 제목 */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {pageTitle}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}

