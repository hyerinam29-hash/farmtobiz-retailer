/**
 * @file components/retailer/profile/profile-edit-form-client.tsx
 * @description ProfileEditForm를 클라이언트 전용으로 로드하기 위한 래퍼
 */

"use client";

import dynamic from "next/dynamic";

const ProfileEditForm = dynamic(
  () => import("./ProfileEditForm"),
  { ssr: false }
);

export default function ProfileEditFormClient() {
  return <ProfileEditForm />;
}


