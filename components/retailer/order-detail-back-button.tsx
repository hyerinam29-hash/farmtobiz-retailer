/**
 * @file components/retailer/order-detail-back-button.tsx
 * @description 주문 상세 페이지 뒤로가기 버튼 컴포넌트 (클라이언트 컴포넌트)
 *
 * 프로필 페이지로 이동하기 위한 클라이언트 컴포넌트입니다.
 */

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function OrderDetailBackButton() {
  const router = useRouter();

  const handleBack = () => {
    console.log("🔙 [주문 상세] 뒤로가기 버튼 클릭, 프로필 페이지로 이동");
    router.push("/retailer/profile");
  };

  return (
    <button
      onClick={handleBack}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      aria-label="뒤로가기"
    >
      <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
    </button>
  );
}

