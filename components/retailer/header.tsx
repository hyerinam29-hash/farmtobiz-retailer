/**
 * @file components/retailer/header.tsx
 * @description 소매점 헤더 컴포넌트
 *
 * 소매점 페이지의 상단 헤더를 제공합니다.
 * 디자인 가이드에 맞춘 헤더 UI와 기능을 결합한 컴포넌트입니다.
 *
 * 주요 기능:
 * 1. 상단 헤더: 로고(왼쪽) + 검색 바(중앙) + 메뉴(오른쪽)
 * 2. 카테고리 네비게이션: 카테고리 드롭다운 + 홈/베스트/단독/연말특가
 * 3. 검색 기능
 * 4. 장바구니 개수 표시
 * 5. 사용자 인증 (Clerk)
 *
 * @dependencies
 * - @clerk/nextjs (useUser, useClerk)
 * - next/navigation (usePathname, Link, useRouter)
 * - next/image (Image)
 * - lucide-react (아이콘)
 * - stores/cart-store (장바구니 상태)
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { CommandPalette } from "./command-palette";
import type { UserRole } from "@/types/database";

// 카테고리 데이터 (헤더 드롭다운용)
// "전체" 제외, 곡물+견과류 통합
interface Category {
  id: string;
  label: string;
}

const CATEGORIES: Category[] = [
  { id: "과일", label: "과일" },
  { id: "채소", label: "채소" },
  { id: "수산물", label: "수산물" },
  { id: "곡물/견과류", label: "곡물/견과류" },
  { id: "기타", label: "기타" },
];

// 네비게이션 바 메뉴 항목 정의
interface NavBarItem {
  href: string;
  label: string;
  icon?: typeof Menu;
}

const navBarItems: NavBarItem[] = [
  {
    href: "/retailer/dashboard",
    label: "홈",
  },
  {
    href: "/retailer/products?sort=popular",
    label: "베스트",
  },
  {
    href: "/retailer/products?special=true",
    label: "연말특가",
  },
];

interface RetailerHeaderProps {
  /** 사용자 역할 (관리자 배지 표시용) */
  role?: UserRole;
}

// 내부 헤더 컴포넌트 (useSearchParams 사용)
function HeaderContent({
  role,
}: RetailerHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleLogoClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.log("🧭 [Header] 로고 클릭 → /retailer/dashboard");
    router.push("/retailer/dashboard");
  };

  // 장바구니 개수 가져오기
  const cartItemCount = useCartStore((state) => state.getSummary().itemCount);

  // 클라이언트 사이드 마운트 확인 (Hydration 오류 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 현재 경로가 활성화된 메뉴인지 확인
  const isActive = (href: string): boolean => {
    if (!mounted) return false;

    // 쿼리 파라미터가 있는 경우
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      if (pathname !== path) return false;

      const targetParams = new URLSearchParams(query);
      let isMatch = true;
      targetParams.forEach((value, key) => {
        if (searchParams.get(key) !== value) {
          isMatch = false;
        }
      });
      return isMatch;
    }

    // 쿼리 파라미터가 없는 경우
    return pathname === href;
  };

  // 검색 실행
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/retailer/products?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery("");
    }
  };

  // 나의상회 클릭 핸들러
  const handleMyShopClick = () => {
    router.push("/retailer/profile");
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[100]">
        {/* 상단 헤더 */}
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
          {/* 로고 */}
          <Link
            href="/retailer/dashboard"
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
          >
            <Image
              src="/farmtobiz_logo.png"
              alt="Farm to Biz Logo"
              width={200}
              height={60}
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* 관리자 배지 - 로고 옆에 표시 */}
          {role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-semibold transition-colors cursor-pointer ml-2"
              title="관리자 페이지로 돌아가기"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>관리자</span>
            </Link>
          )}

          {/* 검색바 */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl mx-10 bg-gray-100 rounded-full px-6 py-3 flex items-center shadow-inner"
          >
            <Search className="text-gray-400 w-6 h-6 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="품목이나 거래처를 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-base text-gray-600 placeholder-gray-400"
            />
          </form>

          {/* 우측 메뉴 */}
          <div className="flex flex-col items-end justify-center h-full gap-2 flex-shrink-0">
            <div className="flex items-center gap-4 text-base font-medium text-gray-600">
              <Link
                href="/retailer/cs"
                className="cursor-pointer hover:text-[#5B9A6F] transition-colors"
              >
                고객센터
              </Link>
              <span className="w-px h-3 bg-gray-300"></span>
              {mounted && isLoaded ? (
                user ? (
                  <button
                    onClick={handleSignOut}
                    className="cursor-pointer hover:text-[#5B9A6F] transition-colors"
                  >
                    로그아웃
                  </button>
                ) : (
                  <Link
                    href="/sign-in/retailer"
                    className="cursor-pointer hover:text-[#5B9A6F] transition-colors"
                  >
                    로그인 / 회원가입
                  </Link>
                )
              ) : (
                <span className="w-24 h-4" />
              )}
            </div>

            <div className="flex items-center gap-8 mt-1">
              {/* 나의상회 */}
              {mounted && isLoaded && user && (
                <button
                  onClick={handleMyShopClick}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                  aria-label="나의상회"
                >
                  <User
                    size={32}
                    strokeWidth={1.5}
                    className="text-gray-900 group-hover:text-[#5B9A6F] transition-colors"
                  />
                  <span className="text-sm text-gray-800 font-bold group-hover:text-[#5B9A6F]">
                    나의상회
                  </span>
                </button>
              )}

              {/* 장바구니 */}
              <Link
                href="/retailer/cart"
                className="flex flex-col items-center gap-1 cursor-pointer group relative"
                aria-label="장바구니"
              >
                <ShoppingCart
                  size={32}
                  strokeWidth={1.5}
                  className="text-gray-900 group-hover:text-[#5B9A6F] transition-colors"
                />
                <span className="text-sm text-gray-800 font-bold group-hover:text-[#5B9A6F]">
                  장바구니
                </span>
                {cartItemCount > 0 && (
                  <div className="absolute -top-1 -right-2 w-6 h-6 bg-[#5B9A6F] rounded-full text-xs text-white flex items-center justify-center font-bold shadow-sm border-2 border-white">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* 카테고리 네비게이션 */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 flex items-center h-14">
            {/* 카테고리 라벨 (드롭다운 메뉴) */}
            <div className="relative group z-50 border-r border-gray-200 pr-10 mr-8 shrink-0 h-full flex items-center">
              <div className="flex items-center gap-3 font-bold text-lg text-gray-800 cursor-pointer hover:text-[#5B9A6F] transition-colors">
                <Menu size={24} /> 카테고리
              </div>

              {/* 드롭다운 메뉴 */}
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-xl border border-gray-100 py-3 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/retailer/products?category=${encodeURIComponent(cat.id)}`}
                    className="block px-6 py-3.5 text-base text-gray-600 hover:bg-gray-50 hover:text-[#5B9A6F] hover:font-bold transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      {cat.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 나머지 메뉴 링크들 */}
            <div className="flex items-center gap-10 overflow-x-auto no-scrollbar flex-1 h-full">
              {navBarItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center h-full text-lg font-bold whitespace-nowrap border-b-[3px] transition-colors",
                      active
                        ? "border-[#5B9A6F] text-[#5B9A6F]"
                        : "border-transparent text-gray-800 hover:text-[#5B9A6F]"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>
  );
}

// 메인 헤더 컴포넌트 (Suspense로 감싸서 useSearchParams 사용)
export default function RetailerHeader(props: RetailerHeaderProps) {
  return (
    <>
      <CommandPalette />
      <Suspense
        fallback={
          <header className="bg-white border-b border-gray-200 sticky top-0 z-[100]">
            <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="h-14 w-32 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="flex-1 max-w-2xl mx-10 bg-gray-100 rounded-full h-12 animate-pulse" />
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
                <div className="w-32 h-8 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </header>
        }
      >
        <HeaderContent {...props} />
      </Suspense>
    </>
  );
}
