/**
 * @file components/retailer/page-header.tsx
 * @description 소매점 헤더 네비게이션
 *
 * 소매점 페이지의 상단 헤더 네비게이션입니다.
 * 모든 메뉴와 기능을 헤더에 통합하여 제공합니다.
 *
 * 주요 기능:
 * 1. 로고 표시
 * 2. 네비게이션 메뉴 (홈, 상품 검색, 장바구니, 주문 내역, 마이페이지, 고객센터)
 * 3. 프로필 수정, 로그아웃 버튼
 * 4. 반응형 처리 (데스크톱: 가로 메뉴, 모바일: 햄버거 메뉴)
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
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Home,
  Search,
  ShoppingCart,
  ClipboardList,
  User,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 네비게이션 메뉴 항목 정의
const navMenuItems = [
  {
    href: "/retailer/dashboard",
    label: "홈",
    icon: Home,
  },
  {
    href: "/retailer/products",
    label: "상품 검색",
    icon: Search,
  },
  {
    href: "/retailer/cart",
    label: "장바구니",
    icon: ShoppingCart,
  },
  {
    href: "/retailer/orders",
    label: "주문 내역",
    icon: ClipboardList,
  },
  {
    href: "/retailer/profile",
    label: "마이페이지",
    icon: User,
  },
  {
    href: "/retailer/cs",
    label: "고객센터",
    icon: HelpCircle,
  },
];

interface PageHeaderProps {
  /** 모바일 메뉴 열기 함수 (사용하지 않음, 내부 상태로 관리) */
  onMenuClick?: () => void;
}

export default function PageHeader({ onMenuClick }: PageHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (href === "/retailer/dashboard") {
      return pathname === href;
    }
    return pathname === href || pathname?.startsWith(href + "/");
  };

  // 프로필 수정 클릭 핸들러
  const handleProfileClick = () => {
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
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 왼쪽: 로고 + 데스크톱 네비게이션 */}
            <div className="flex items-center gap-4 lg:gap-8">
              {/* 로고 */}
              <Link
                href="/retailer/dashboard"
                className="flex items-center gap-2 flex-shrink-0"
              >
                <Image
                  src="/logo.png"
                  alt="FarmToBiz"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-xl font-bold text-green-600 dark:text-green-400 hidden sm:inline">
                  FarmToBiz
                </span>
              </Link>

              {/* 데스크톱 네비게이션 메뉴 */}
              <nav className="hidden lg:flex items-center gap-1">
                {navMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* 오른쪽: 데스크톱 프로필 메뉴 + 모바일 햄버거 버튼 */}
            <div className="flex items-center gap-2">
              {/* 데스크톱: 프로필 수정, 로그아웃 버튼 */}
              {isLoaded && user && (
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>프로필 수정</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}

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

        {/* 모바일 메뉴 (드롭다운) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <nav className="px-4 py-2">
              <div className="flex flex-col gap-1">
                {/* 네비게이션 메뉴 */}
                {navMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        active
                          ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* 구분선 */}
                {isLoaded && user && (
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                )}

                {/* 프로필 수정, 로그아웃 */}
                {isLoaded && user && (
                  <>
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <Settings className="w-5 h-5" />
                      <span>프로필 수정</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>로그아웃</span>
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
