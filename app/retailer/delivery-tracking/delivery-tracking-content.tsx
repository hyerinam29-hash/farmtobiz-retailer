/**
 * @file app/retailer/delivery-tracking/delivery-tracking-content.tsx
 * @description 배송 조회 페이지 컨텐츠 컴포넌트
 *
 * 실제 주문 데이터를 표시하는 배송 조회 페이지의 메인 컨텐츠입니다.
 */

"use client";

import Link from "next/link";
import { ChevronLeft, Clock, Truck, Package, CheckCircle } from "lucide-react";
import type { OrderDetail } from "@/types/order";

interface DeliveryTrackingContentProps {
  order: OrderDetail;
  statusBadge: { bg: string; text: string };
  estimatedTime: string;
  currentStepIndex: number;
  timelineSteps: Array<{ key: string; label: string; status: string }>;
}

export default function DeliveryTrackingContent({
  order,
  statusBadge,
  estimatedTime,
  currentStepIndex,
  timelineSteps,
}: DeliveryTrackingContentProps) {
  const productName =
    order.product?.name ||
    order.product?.standardized_name ||
    "상품명 없음";

  // 주문 시간 포맷팅
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}.${day} ${hours}:${minutes}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans bg-[#F8F9FA] dark:bg-gray-900 min-h-screen">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/retailer/dashboard"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-900 dark:text-gray-100" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          실시간 배송 조회
        </h1>
      </div>

      {/* 배송 상태 요약 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              송장번호 {order.order_number}
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1">
              고객님께{" "}
              <span
                className={
                  order.status === "shipped"
                    ? "text-green-600 dark:text-green-500"
                    : order.status === "completed"
                      ? "text-blue-600 dark:text-blue-500"
                      : "text-gray-600 dark:text-gray-400"
                }
              >
                {order.status === "shipped"
                  ? "배송 중"
                  : order.status === "completed"
                    ? "배송 완료"
                    : order.status === "confirmed"
                      ? "배송 준비 중"
                      : "주문 완료"}
              </span>
              입니다
            </h2>
            {order.status === "shipped" && (
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-2">
                <Clock size={16} /> 도착 예정:{" "}
                <span className="font-bold">{estimatedTime}</span>
              </p>
            )}
          </div>
          <span
            className={`${statusBadge.bg} ${statusBadge.text} px-4 py-2 rounded-xl font-bold text-sm`}
          >
            {order.status === "shipped"
              ? "배송중"
              : order.status === "completed"
                ? "배송완료"
                : order.status === "confirmed"
                  ? "배송준비"
                  : order.status === "pending"
                    ? "주문완료"
                    : "주문취소"}
          </span>
        </div>

        {/* 타임라인 */}
        <div className="relative pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-8 my-8">
          {timelineSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const stepDate = index <= currentStepIndex ? formatDateTime(order.created_at) : null;

            return (
              <div key={step.key} className="relative">
                <div
                  className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full border-4 flex items-center justify-center ${
                    isCompleted
                      ? "bg-white dark:bg-gray-800 border-green-500 text-green-500"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={16} fill="currentColor" className="text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  )}
                </div>
                <div className="pl-6">
                  <div
                    className={`font-bold ${
                      isCurrent
                        ? "text-green-600 dark:text-green-500 text-lg"
                        : isCompleted
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-400 dark:text-gray-600"
                    }`}
                  >
                    {step.label}
                  </div>
                  {stepDate && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {step.status === "pending" && "주문 접수"}
                      {step.status === "confirmed" && "결제 확인"}
                      {step.status === "shipped" && "배송 시작"}
                      {step.status === "completed" && "배송 완료"}
                      <span className="mx-1">·</span>
                      {stepDate}
                    </div>
                  )}
                  {!stepDate && index > currentStepIndex && (
                    <div className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                      {step.status === "completed" ? "도착 예정" : "대기 중"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 택배사 정보 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">택배사 정보</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Truck size={32} className="text-green-600 dark:text-green-500" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  팜투비즈 물류
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  신선 농산물 전문 배송
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">고객센터</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">1588-0000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">배송 문의</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  평일 09:00 - 18:00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">배송 방식</span>
                <span className="font-medium text-green-600 dark:text-green-500">
                  산지 직송 · 신선배송
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 배송 물품 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">배송 물품</h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                <Package size={16} className="text-gray-400 dark:text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {productName}
                </span>
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {order.quantity}개
              </span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link
              href={`/retailer/orders/${order.id}`}
              className="text-xs text-gray-400 dark:text-gray-500 underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              주문 상세 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

