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
import { User, MapPin, CreditCard, Globe } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NotificationSettingsCard from "@/components/retailer/profile/notification-settings-card";
import ProfileEditFormClient from "@/components/retailer/profile/profile-edit-form-client";
import AccountDeleteModal from "@/components/retailer/profile/account-delete-modal";
import PasswordChangeButton from "@/components/retailer/profile/password-change-button";

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
        <header className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white dark:bg-green-500/90">
            <User className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              설정
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              계정 및 서비스 설정을 관리하세요
            </p>
          </div>
        </header>

        <section>
          <ProfileEditFormClient />
        </section>

        <div className="grid gap-6">
          <Card className="border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                비밀번호 변경
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                비밀번호를 변경하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordChangeButton />
            </CardContent>
          </Card>

          <NotificationSettingsCard />

          <Card className="border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                기타 설정
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                배송지, 결제 수단, 언어 및 통화를 관리하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border-2 border-[#3B63F6] bg-gray-50 px-4 py-4 transition-colors dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-50">
                      배송지 관리
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      자주 쓰는 배송지를 관리하세요
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4 transition-colors dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-50">
                      결제 수단
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      카드 및 결제 방법 설정
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4 transition-colors dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-50">
                      언어 및 통화
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      한국어 · KRW
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                계정 관리
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                계정 삭제를 진행할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-red-50 px-4 py-3 transition-colors dark:bg-red-900/40">
                <AccountDeleteModal />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

