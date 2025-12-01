/**
 * @file app/retailer/profile/page.tsx
 * @description 소매점 프로필 관리 페이지
 *
 * 내 정보 수정과 배송지 관리를 제공하는 마이페이지입니다.
 *
 * 주요 기능:
 * 1. 내 정보 수정 (상호명, 전화번호, 주소)
 * 2. 배송지 관리 (CRUD)
 *
 * @dependencies
 * - lib/clerk/auth.ts (requireRetailer)
 * - components/retailer/profile/ProfileTabs.tsx
 */

import { requireRetailer } from "@/lib/clerk/auth";
import ProfileTabs from "@/components/retailer/profile/ProfileTabs";

export default async function ProfilePage() {
  // 소매점 권한 확인
  const profile = await requireRetailer();

  console.log("✅ [retailer] 프로필 페이지: 권한 확인됨", {
    email: profile.email,
    role: profile.role,
  });

  return (
    <div className="p-12 md:p-16 lg:p-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-20">마이페이지</h1>
        <ProfileTabs />
      </div>
    </div>
  );
}

