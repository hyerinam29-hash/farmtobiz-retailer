/**
 * @file components/retailer/sidebar.tsx
 * @description 소매점 사이드바 네비게이션
 *
 * 소매점 전용 사이드바 네비게이션 컴포넌트입니다.
 * 현재 경로를 하이라이트하고, 소매점 메뉴를 제공합니다.
 *
 * 주요 기능:
 * 1. 대시보드 링크
 * 2. 상품 검색 링크
 * 3. 장바구니 링크
 * 4. 주문 내역 링크
 * 5. 마이페이지 링크
 * 6. 고객센터 링크
 * 7. 현재 경로 하이라이트
 * 8. 모바일 반응형 지원 (햄버거 메뉴로 제어)
 * 9. 사용자 프로필 드롭다운 메뉴 (프로필 수정, 로그아웃)
 *
 * @dependencies
 * - @clerk/nextjs (useUser, useClerk)
 * - next/navigation (usePathname, Link, useRouter)
 * - lucide-react (아이콘)
 * - lib/utils (cn 함수)
 * - components/ui/dropdown-menu (드롭다운 메뉴)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import {
  LayoutDashboard,
  Search,
  ShoppingCart,
  ClipboardList,
  User,
  HelpCircle,
  X,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  {
    href: "/retailer/dashboard",
    label: "대시보드",
    icon: LayoutDashboard,
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

interface RetailerSidebarProps {
  /** 모바일에서 사이드바 열림/닫힘 상태 */
  isOpen: boolean;
  /** 사이드바 닫기 함수 */
  onClose: () => void;
}

export default function RetailerSidebar({
  isOpen,
  onClose,
}: RetailerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드 마운트 확인 (Hydration 오류 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 사용자 이름의 첫 글자 추출 (아바타 폴백용)
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // 로그아웃 처리
  const handleSignOut = async () => {
    console.log("🚪 [Sidebar] 로그아웃 시작");
    try {
      await signOut({ redirectUrl: "/" });
      console.log("✅ [Sidebar] 로그아웃 완료");
    } catch (error) {
      console.error("❌ [Sidebar] 로그아웃 실패:", error);
    }
  };

  // 마이페이지로 이동
  const handleProfileClick = () => {
    router.push("/retailer/profile");
    // 모바일에서 링크 클릭 시 사이드바 닫기
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // 아바타 이미지 URL 또는 null
  const avatarUrl = user?.imageUrl || null;
  const userName = user?.fullName || user?.firstName || null;
  const userEmail = user?.primaryEmailAddress?.emailAddress || null;

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 */}
      <aside
        className={cn(
          "fixed xl:sticky top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0",
          "w-64"
        )}
      >
        {/* 로고/제목 영역 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <Link
            href="/retailer/dashboard"
            className="flex items-center gap-2"
            onClick={() => {
              // 모바일/태블릿/랩탑에서 링크 클릭 시 사이드바 닫기
              if (window.innerWidth < 1280) {
                onClose();
              }
            }}
          >
            <Image
              src="/logo.png"
              alt="FarmToBiz"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-bold text-green-600 dark:text-green-400">
              FarmToBiz
            </span>
          </Link>

          {/* 모바일 닫기 버튼 */}
          <button
            onClick={onClose}
            className="xl:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            aria-label="사이드바 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 사용자 프로필 영역 */}
        {isLoaded && user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors p-2 -m-2">
                  {/* 아바타 */}
                  <div className="relative flex-shrink-0">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={userName || "사용자"}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-lg">
                        {getInitials(userName)}
                      </div>
                    )}
                  </div>

                  {/* 사용자 정보 */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {userName || "소매점"}
                    </p>
                    {userEmail && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {userEmail}
                      </p>
                    )}
                  </div>

                  {/* 드롭다운 아이콘 */}
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={handleProfileClick}>
                  <Settings className="w-4 h-4" />
                  <span>프로필 수정</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  variant="destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* 메뉴 네비게이션 */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // 마운트되지 않았으면 모두 비활성화 (서버 사이드 렌더링 시 Hydration 오류 방지)
              // 대시보드는 정확히 일치만 체크, 다른 메뉴는 경로가 시작하는지 체크
              const isActive = mounted
                ? item.href === "/retailer/dashboard"
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/")
                : false;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // 모바일에서 링크 클릭 시 사이드바 닫기
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}


