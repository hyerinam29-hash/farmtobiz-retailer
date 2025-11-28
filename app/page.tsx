/**
 * @file app/page.tsx
 * @description 소매 페이지 시작 - 회원가입 및 로그인 페이지
 *
 * 소매 페이지 시작 시 회원가입 및 로그인 페이지를 제공합니다.
 * Clerk를 연동하여 인증을 처리합니다.
 *
 * 주요 기능:
 * 1. 소매 회원가입 및 로그인 페이지 표시
 * 2. Clerk 인증 연동
 * 3. 로그인 상태 확인 및 로그아웃 기능 제공
 *
 * @dependencies
 * - @clerk/nextjs (인증)
 * - next/link (라우팅)
 */

"use client";

import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, UserPlus, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("🏠 [Home] 메인 페이지 접근 - 소매 회원가입 및 로그인 페이지");
    console.log("🔐 [Home] 로그인 상태:", { isSignedIn, isLoaded });
  }, [isSignedIn, isLoaded]);

  const handleSignOut = async () => {
    console.log("🚪 [Home] 로그아웃 시작");
    try {
      await signOut({ redirectUrl: "/" });
      console.log("✅ [Home] 로그아웃 완료");
    } catch (error) {
      console.error("❌ [Home] 로그아웃 실패:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 메인 콘텐츠 */}
      <main className="flex flex-1 justify-center items-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col max-w-md w-full gap-6">
          {/* 제목 섹션 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              소매 B2B 플랫폼
            </h1>
            <p className="text-base font-normal leading-normal text-gray-600 dark:text-gray-400">
              다양한 도매업체의 상품을 발견하고 합리적인 가격으로 주문하세요.
            </p>
          </div>

          {/* 로그인된 사용자에게 안내 메시지 표시 */}
          {mounted && isLoaded && isSignedIn ? (
            <Card className="shadow-lg border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/50">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LogIn className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">로그인됨</CardTitle>
                <CardDescription>
                  이미 로그인되어 있습니다. 대시보드로 이동하거나 로그아웃할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Link href="/retailer/dashboard">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium">
                    대시보드로 이동
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* 로그인 카드 */}
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <LogIn className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl">로그인</CardTitle>
                  <CardDescription>
                    이미 계정이 있으신가요? 로그인하여 시작하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/sign-in/retailer">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium">
                      로그인하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* 회원가입 카드 */}
              <Card className="shadow-lg border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl">회원가입</CardTitle>
                  <CardDescription>
                    아직 회원이 아니신가요? 지금 바로 가입하고 소매 비즈니스를 시작하세요!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/sign-up?type=retailer">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium">
                      회원가입하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </main>
  );
}
