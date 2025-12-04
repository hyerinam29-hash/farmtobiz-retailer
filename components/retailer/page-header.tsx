/**
 * @file components/retailer/page-header.tsx
 * @description 소매점 헤더 네비게이션
 *
 * 소매점 페이지의 상단 헤더 네비게이션입니다.
 * 디자인 이미지에 맞춰 2단 구조로 구성됩니다.
 *
 * 주요 기능:
 * 1. 상단 헤더: 로고(왼쪽) + 검색 바(중앙) + 메뉴(오른쪽)
 * 2. 네비게이션 바: 카테고리, 베스트, 단독, 연말특가
 * 3. 반응형 처리 (데스크톱: 가로 메뉴, 모바일: 햄버거 메뉴)
 *
 * @dependencies
 * - @clerk/nextjs (useUser, useClerk)
 * - next/navigation (usePathname, Link, useRouter)
 * - next/image (Image)
 * - lucide-react (아이콘)
 * - lib/utils (cn 함수)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Search,
  ShoppingCart,
  User,
  HelpCircle,
  Menu,
  X,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

// 네비게이션 바 메뉴 항목 정의
const navBarItems = [
  {
    href: "/retailer/products?category=all",
    label: "카테고리",
    icon: Menu,
  },
  {
    href: "/retailer/dashboard",
    label: "홈",
  },
  {
    href: "/retailer/products?sort=popular",
    label: "베스트",
  },
  {
    href: "/retailer/products?exclusive=true",
    label: "단독",
  },
  {
    href: "/retailer/products?special=true",
    label: "연말특가",
  },
];

interface PageHeaderProps {
  /** 모바일 메뉴 열기 함수 (사용하지 않음, 내부 상태로 관리) */
  onMenuClick?: () => void;
}

export default function PageHeader({ onMenuClick }: PageHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 장바구니 개수 가져오기
  const cartItemCount = useCartStore((state) => state.getSummary().itemCount);

  // 클라이언트 사이드 마운트 확인 (Hydration 오류 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 모바일 메뉴 닫기 (링크 클릭 시)
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setMobileMenuOpen(false);
    }
  };

  // 현재 경로가 활성화된 메뉴인지 확인
  const isActive = (href: string) => {
    if (!mounted) return false;
    
    // 쿼리 파라미터가 있는 경우 (예: /retailer/products?category=all)
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      if (pathname !== path) return false;
      
      const currentQueryString = searchParams.toString();
      const targetQueryString = query; // 간단한 비교를 위해 그대로 사용 (순서 다르면 매칭 안 될 수 있음, 현재는 단순함)
      
      // 현재 쿼리 파라미터가 타겟 쿼리 파라미터를 포함하는지 확인
      // 더 정확한 비교를 위해 URLSearchParams 사용
      const targetParams = new URLSearchParams(targetQueryString);
      let isMatch = true;
      targetParams.forEach((value, key) => {
        if (searchParams.get(key) !== value) {
          isMatch = false;
        }
      });
      return isMatch;
    }
    
    // 쿼리 파라미터가 없는 경우 (예: /retailer/dashboard)
    // 정확히 일치하거나 해당 경로로 시작하는지 확인 (단, 다른 메뉴와 겹치지 않도록 주의)
    return pathname === href;
  };

  // 검색 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/retailer/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // 나의상회 클릭 핸들러
  const handleMyShopClick = () => {
    router.push("/retailer/profile");
    handleLinkClick();
  };

  // 로그아웃 처리
  const handleSignOut = async () => {
    console.log("🚪 [Header] 로그아웃 시작");
    try {
      await signOut({ redirectUrl: "/sign-in/retailer" });
      console.log("✅ [Header] 로그아웃 완료");
    } catch (error) {
      console.error("❌ [Header] 로그아웃 실패:", error);
    }
  };

  return (
    <>
      {/* 모바일 메뉴 오버레이 */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        {/* 상단 헤더 */}
        <div className="px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
          <div className="relative flex items-center justify-between h-20 gap-4">
            {/* 왼쪽: 로고 */}
            <Link
              href="/retailer/dashboard"
              className="flex items-center gap-1 flex-shrink-0 z-10"
            >
              <Leaf className="w-7 h-7 text-green-600 dark:text-green-400" />
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                Farm to Biz
              </span>
            </Link>

            {/* 중앙: 검색 바 (절대 위치로 중앙 배치) */}
            <form
              onSubmit={handleSearch}
              className="absolute left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="상품명이나 거래처를 검색하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-full border-none outline-none text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                />
              </div>
            </form>

            {/* 오른쪽: 메뉴 아이콘들 */}
            <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0 z-10">
              {/* 상단 텍스트 링크 (고객센터 | 로그인/회원가입) */}
              <div className="hidden lg:flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Link
                    href="/retailer/cs"
                    className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    고객센터
                  </Link>
                  <span>|</span>
                  {mounted && isLoaded && !user ? (
                    <Link
                      href="/sign-in/retailer"
                      className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      로그인/회원가입
                    </Link>
                  ) : (
                    <span className="w-20 h-3" />
                  )}
                </div>
              </div>

              {/* 나의상회 (세로 배치) */}
              {mounted && isLoaded && user && (
                <button
                  onClick={handleMyShopClick}
                  className="hidden lg:flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  aria-label="나의상회"
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs">나의상회</span>
                </button>
              )}

              {/* 로그아웃 (모바일에서만 표시) */}
              {mounted && isLoaded && user && (
                <button
                  onClick={handleSignOut}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                  aria-label="로그아웃"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* 장바구니 (세로 배치 + 숫자 배지) */}
              <Link
                href="/retailer/cart"
                className="relative hidden lg:flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="장바구니"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-green-600 text-white text-[10px] font-bold rounded-full">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs">장바구니</span>
              </Link>
              
              {/* 모바일 장바구니 (가로 배치) */}
              <Link
                href="/retailer/cart"
                className="relative lg:hidden flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="장바구니"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-green-600 text-white text-[10px] font-bold rounded-full">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* 모바일: 햄버거 메뉴 버튼 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                aria-label="메뉴 열기/닫기"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 네비게이션 바 */}
        <div className="px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
          <nav className="flex items-center gap-6 lg:gap-8 h-12">
            {navBarItems.map((item) => {
              const active = isActive(item.href);
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium transition-colors",
                    active
                      ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 pb-3"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 모바일 메뉴 (드롭다운) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <nav className="px-4 py-2">
              <div className="flex flex-col gap-1">
                {/* 네비게이션 바 메뉴 */}
                {navBarItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                        active
                          ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* 구분선 */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                {/* 고객센터 */}
                <Link
                  href="/retailer/cs"
                  onClick={handleLinkClick}
                  className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  고객센터
                </Link>

                {/* 나의상회 */}
                {mounted && isLoaded && user && (
                  <button
                    onClick={handleMyShopClick}
                    className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left text-sm"
                  >
                    나의상회
                  </button>
                )}

                {/* 로그인/회원가입 또는 로그아웃 */}
                {!mounted ? (
                  // 서버 사이드: 일관된 구조 유지 (플레이스홀더)
                  <div className="px-4 py-3 h-12" />
                ) : isLoaded && !user ? (
                  <Link
                    href="/sign-in/retailer"
                    onClick={handleLinkClick}
                    className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                  >
                    로그인/회원가입
                  </Link>
                ) : (
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-sm"
                  >
                    로그아웃
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
