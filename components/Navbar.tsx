"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 소매점 페이지에서는 Navbar를 표시하지 않음
  if (pathname?.startsWith("/retailer")) {
    return null;
  }

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link
        href="/"
        className="flex items-center gap-2"
      >
        <Image
          src="/logo.png"
          alt="FarmToBiz"
          width={32}
          height={32}
          className="object-contain"
        />
        <span className="text-2xl font-bold text-green-600">FarmToBiz</span>
      </Link>

      {/* 우측 영역: 테마 토글 및 사용자 정보 */}
      <div className="flex items-center gap-3">
        {/* 테마 토글 버튼 */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="테마 변경"
        >
          {mounted ? (
            theme === "dark" ? (
              <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-orange-500" />
            )
          ) : (
            <div className="w-5 h-5" /> // hydration mismatch 방지용 placeholder
          )}
        </button>

        {/* 로그인 상태에 따라 사용자 정보 표시 */}
        {isLoaded && isSignedIn && (
          <>
            {/* 로그인 상태 표시 */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="hidden sm:inline">로그인됨</span>
              {user?.primaryEmailAddress?.emailAddress && (
                <span className="hidden md:inline text-gray-500 dark:text-gray-400">
                  ({user.primaryEmailAddress.emailAddress})
                </span>
              )}
            </div>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
