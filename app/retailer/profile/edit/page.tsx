/**
 * @file app/retailer/profile/edit/page.tsx
 * @description 프로필 수정 페이지
 *
 * 내 정보 수정만 제공하는 페이지입니다.
 *
 * 주요 기능:
 * 1. 내 정보 수정 (상호명, 전화번호, 주소)
 *
 * @dependencies
 * - lib/clerk/auth.ts (requireRetailer)
 * - components/retailer/profile/ProfileEditForm.tsx
 */

import { requireRetailer } from "@/lib/clerk/auth";
import ProfileEditForm from "@/components/retailer/profile/ProfileEditForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProfileEditPage() {
  // 소매점 권한 확인
  const profile = await requireRetailer();

  console.log("✅ [retailer] 프로필 수정 페이지: 권한 확인됨", {
    email: profile.email,
    role: profile.role,
  });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-950 md:px-10 md:py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
            설정
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            계정 및 서비스 설정을 관리하세요
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300">
            회원정보 수정과 계정 관련 설정을 한 곳에서 관리할 수 있습니다.
          </p>
        </header>

        <section>
          <ProfileEditForm />
        </section>

        <div className="grid gap-6">
          <Card className="border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                보안
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                비밀번호 변경 및 계정 보안을 관리하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors dark:bg-gray-800 dark:text-gray-200">
                비밀번호 변경 · 마지막 변경일: 보안 설정 페이지에서 변경 가능합니다.
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                알림 설정
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                주문, 프로모션, 뉴스레터, SMS 알림 수신 상태를 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-800 dark:text-gray-100">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition-colors dark:bg-gray-800">
                <div>
                  <p className="font-semibold">주문 알림</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    주문 상태 변경 시 알림
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  설정 유지
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition-colors dark:bg-gray-800">
                <div>
                  <p className="font-semibold">프로모션 알림</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    할인 및 이벤트 정보
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  설정 유지
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition-colors dark:bg-gray-800">
                <div>
                  <p className="font-semibold">뉴스레터</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    주간 농산물 소식
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  설정 유지
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition-colors dark:bg-gray-800">
                <div>
                  <p className="font-semibold">SMS 알림</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    문자 메시지 수신
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  설정 유지
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                기타 설정
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                결제 수단, 언어 및 통화 설정을 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800 transition-colors dark:bg-gray-800 dark:text-gray-100">
                결제 수단 · 카드 및 결제 방법 설정
              </div>
              <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800 transition-colors dark:bg-gray-800 dark:text-gray-100">
                언어 및 통화 · 한국어 · KRW
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                계정 관리
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                로그인 또는 계정 삭제를 진행할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800 transition-colors dark:bg-gray-800 dark:text-gray-100">
                로그아웃
              </div>
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 transition-colors dark:bg-red-900/40 dark:text-red-200">
                계정 삭제
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

