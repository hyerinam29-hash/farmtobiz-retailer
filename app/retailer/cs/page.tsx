/**
 * @file app/retailer/cs/page.tsx
 * @description 소매점 고객센터 페이지
 *
 * 고객센터 문의 작성 및 내역 조회 페이지입니다.
 *
 * 주요 기능:
 * 1. 새 문의 작성 (R.AI.01 관련)
 * 2. 내 문의 내역 조회
 *
 * @dependencies
 * - app/retailer/layout.tsx (레이아웃)
 * - app/retailer/cs/CsClient.tsx (클라이언트 컴포넌트)
 */

export const dynamic = "force-dynamic";

import { requireRetailer } from "@/lib/clerk/auth";
import CsClient from "./CsClient";

export default async function CsPage() {
  // 소매점 권한 확인
  const profile = await requireRetailer();

  console.log("✅ [retailer] 고객센터 페이지: 권한 확인됨", {
    email: profile.email,
    role: profile.role,
    profileId: profile.id,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#f6f8f7] dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <CsClient userId={profile.id} />
      </div>
    </div>
  );
}

