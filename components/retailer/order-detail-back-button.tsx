/**
 * @file components/retailer/order-detail-back-button.tsx
 * @description 주문 상세 페이지 뒤로가기 버튼 컴포넌트 (클라이언트 컴포넌트)
 *
 * 대시보드의 "배송 조회" 섹션으로 이동하기 위한 클라이언트 컴포넌트입니다.
 * sessionStorage를 사용하여 해시 프래그먼트 없이 스크롤 위치를 전달합니다.
 */

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function OrderDetailBackButton() {
  const router = useRouter();

  const handleBack = () => {
    console.log("🔙 [주문 상세] 뒤로가기 버튼 클릭, 대시보드 배송 조회 섹션으로 이동");
    // sessionStorage에 스크롤 위치 저장
    sessionStorage.setItem("scrollToSection", "delivery-tracking");
    // 해시 없이 대시보드로 이동 (스크롤 제한 없음)
    router.push("/retailer/dashboard");
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

