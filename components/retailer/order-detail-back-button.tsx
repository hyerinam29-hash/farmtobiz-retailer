/**
 * @file components/retailer/order-detail-back-button.tsx
 * @description 주문 상세 페이지 뒤로가기 버튼 컴포넌트 (클라이언트 컴포넌트)
 *
 * 대시보드의 "최근 주문 내역" 섹션으로 스크롤하기 위한 클라이언트 컴포넌트입니다.
 */

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function OrderDetailBackButton() {
  const router = useRouter();

  const handleBack = () => {
    console.log("🔙 [주문 상세] 뒤로가기 버튼 클릭, 대시보드로 이동");
    router.push("/retailer/dashboard#recent-orders");
  };

  return (
    <button
      onClick={handleBack}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="뒤로가기"
    >
      <ArrowLeft size={24} className="text-gray-600" />
    </button>
  );
}

