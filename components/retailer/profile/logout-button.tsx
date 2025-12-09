/**
 * @file components/retailer/profile/logout-button.tsx
 * @description Clerk 로그아웃 버튼 (소매 로그인 페이지로 리다이렉트)
 */

"use client";

import { useClerk } from "@clerk/nextjs";

export default function LogoutButton() {
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut({ redirectUrl: "/sign-in/retailer" });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
    >
      로그아웃
    </button>
  );
}


