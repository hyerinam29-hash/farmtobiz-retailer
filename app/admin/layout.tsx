/**
 * @file app/admin/layout.tsx
 * @description 관리자 페이지 레이아웃
 *
 * 모든 관리자 페이지를 보호하는 레이아웃입니다.
 * requireAdmin()을 통해 관리자 권한을 확인하고,
 * 관리자 전용 네비게이션 메뉴를 제공합니다.
 *
 * 주요 기능:
 * 1. 관리자 권한 체크 (requireAdmin)
 * 2. 관리자 전용 네비게이션 메뉴
 * 3. 공통 레이아웃 구조
 *
 * @dependencies
 * - lib/clerk/auth.ts (requireAdmin)
 * - next/link (네비게이션)
 */

import { requireAdmin } from "@/lib/clerk/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 관리자 권한 확인
  const profile = await requireAdmin();

  console.log("✅ [admin] 레이아웃: 관리자 권한 확인됨", {
    email: profile.email,
    role: profile.role,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gray-900">관리자 페이지</h1>
              <nav className="flex gap-6">
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  대시보드
                </Link>
                <Link
                  href="/admin/wholesalers/pending"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  도매 승인 대기
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{profile.email}</span>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

