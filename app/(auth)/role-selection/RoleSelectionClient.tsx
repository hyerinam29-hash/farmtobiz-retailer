/**
 * @file RoleSelectionClient.tsx
 * @description 역할 선택 클라이언트 컴포넌트
 *
 * 사용자가 소매점 또는 도매점을 선택하는 UI를 제공합니다.
 * 클라이언트 사이드에서 사용자 인터랙션을 처리합니다.
 */

"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Warehouse, Loader2 } from "lucide-react";

export default function RoleSelectionClient() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 역할 선택 핸들러
  const handleRoleSelection = async (role: "retailer" | "wholesaler") => {
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 [role-selection] 역할 선택:", role);

      // API 호출하여 역할 업데이트
      const response = await fetch("/api/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "역할 업데이트에 실패했습니다.");
      }

      console.log("✅ [role-selection] 역할 업데이트 성공:", data);

      // 리다이렉트 URL로 이동
      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        // 기본 리다이렉트
        if (role === "retailer") {
          router.push("/retailer/dashboard");
        } else {
          router.push("/wholesaler/onboarding");
        }
      }
    } catch (err) {
      console.error("❌ [role-selection] 역할 선택 오류:", err);
      setError(
        err instanceof Error
          ? err.message
          : "역할 선택 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
      setIsLoading(false);
    }
  };

  // 로딩 중
  if (!isUserLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 사용자가 로그인하지 않은 경우
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>로그인이 필요합니다</CardTitle>
            <CardDescription>
              역할을 선택하려면 먼저 로그인해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/sign-in")} className="w-full">
              로그인하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            역할을 선택해주세요
          </h1>
          <p className="mt-2 text-gray-600">
            서비스를 이용하기 위해 소매점 또는 도매점 중 하나를 선택해주세요.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* 소매점 카드 */}
          <Card className="cursor-pointer transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">소매점</CardTitle>
              <CardDescription>
                상품을 구매하고 주문을 관리하는 소매 업체입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>다양한 도매 상품 조회 및 비교</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>장바구니 및 주문 관리</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>주문 내역 조회 및 추적</span>
                </li>
              </ul>
              <Button
                onClick={() => handleRoleSelection("retailer")}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  "소매점으로 시작하기"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 도매점 카드 */}
          <Card className="cursor-pointer transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Warehouse className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">도매점</CardTitle>
              <CardDescription>
                상품을 등록하고 주문을 처리하는 도매 업체입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>AI 기반 상품명 표준화</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>실시간 시세 조회</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>주문 관리 및 정산 조회</span>
                </li>
              </ul>
              <Button
                onClick={() => handleRoleSelection("wholesaler")}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  "도매점으로 시작하기"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
