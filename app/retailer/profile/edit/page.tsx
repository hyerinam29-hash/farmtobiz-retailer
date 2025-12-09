/**
 * @file app/retailer/profile/edit/page.tsx
 * @description 프로필 수정 페이지
 *
 * 내 정보 수정만 제공하는 페이지입니다.
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
import ProfileEditForm from "@/components/retailer/profile/ProfileEditForm";

export default async function ProfileEditPage() {
  // 소매점 권한 확인
  const profile = await requireRetailer();

  console.log("✅ [retailer] 프로필 수정 페이지: 권한 확인됨", {
    email: profile.email,
    role: profile.role,
  });

  return (
    <div className="p-12 md:p-16 lg:p-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-20">회원정보 수정</h1>
        <ProfileEditForm />
      </div>
    </div>
  );
}

