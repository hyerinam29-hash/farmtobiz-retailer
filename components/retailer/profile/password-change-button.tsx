/**
 * @file password-change-button.tsx
 * @description Clerk 프로필(보안/패스워드) 모달을 여는 비밀번호 변경 버튼
 *
 * 주요 기능:
 * 1. 버튼 클릭 시 Clerk 프로필 보안/패스워드 화면을 오픈
 * 2. 핵심 로직에 로그를 남겨 디버깅 지원
 */

"use client";

import { useClerk } from "@clerk/nextjs";

export default function PasswordChangeButton() {
  const { openUserProfile } = useClerk();

  return (
    <button
      onClick={() => {
        console.log("🔐 [설정] 비밀번호 변경 진입");
        openUserProfile();
      }}
      className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-500 active:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 dark:active:bg-green-600"
    >
      비밀번호 변경하기
    </button>
  );
}


