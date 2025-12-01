/**
 * @file app/retailer/dashboard/page.tsx
 * @description 소매점 대시보드 페이지
 *
 * 소매점 사용자의 메인 대시보드입니다.
 * Bento Grid 레이아웃을 사용하여 AI 추천 상품, 최근 주문 요약, 긴급 알림 등을 표시합니다.
 *
 * 주요 기능:
 * 1. Bento Grid 레이아웃 (R.DASH.01)
 * 2. AI 추천 상품 모듈 (R.DASH.02)
 * 3. 최근 주문 요약 (R.DASH.03)
 * 4. 긴급 알림/공지 (R.DASH.04)
 * 5. 월별 구매 추이 차트
 * 6. 배송 예정 알림
 * 7. 실시간 시세표
 * 8. 반응형 디자인 (모바일/태블릿/데스크톱)
 *
 * @dependencies
 * - app/retailer/layout.tsx (레이아웃)
 * - components/retailer/bento-grid.tsx (Bento Grid 컴포넌트)
 * - components/retailer/ai-recommendation-list.tsx (AI 추천 상품 리스트)
 * - components/retailer/recent-orders-summary.tsx (최근 주문 요약)
 * - components/retailer/urgent-alerts.tsx (긴급 알림)
 * - components/retailer/monthly-purchase-chart.tsx (월별 구매 추이 차트)
 * - components/retailer/delivery-schedule-alerts.tsx (배송 예정 알림)
 * - components/retailer/market-price-table.tsx (실시간 시세표)
 *
 * @see {@link PRD.md} - R.DASH.01~04 요구사항
 */

"use client";

import { useState } from "react";
import { BentoGrid, BentoCard } from "@/components/retailer/bento-grid";
import AIRecommendationList from "@/components/retailer/ai-recommendation-list";
import RecentOrdersSummary from "@/components/retailer/recent-orders-summary";
import UrgentAlerts from "@/components/retailer/urgent-alerts";
import MonthlyPurchaseChart from "@/components/retailer/monthly-purchase-chart";
import DeliveryScheduleAlerts from "@/components/retailer/delivery-schedule-alerts";
import MarketPriceTable from "@/components/retailer/market-price-table";

// 임시 목 데이터 - AI 추천 상품 (추후 API로 교체 예정)
const mockRecommendedProducts = [
  {
    id: "1",
    name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    standardized_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    category: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    specification: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    price: 0, // 가격 삭제, 나중에 내용 추가 가능
    moq: 1,
    image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
    is_seasonal: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    stock_warning: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
  },
  {
    id: "2",
    name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    standardized_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    category: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    specification: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    price: 0, // 가격 삭제, 나중에 내용 추가 가능
    moq: 1,
    image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
    is_seasonal: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    stock_warning: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
  },
  {
    id: "3",
    name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    standardized_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    category: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    specification: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    price: 0, // 가격 삭제, 나중에 내용 추가 가능
    moq: 2,
    image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
    is_seasonal: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    stock_warning: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
  },
  {
    id: "4",
    name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    standardized_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    category: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    specification: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    price: 0, // 가격 삭제, 나중에 내용 추가 가능
    moq: 1,
    image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
    is_seasonal: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    stock_warning: false, // 배지 표시 안 함, 나중에 내용 추가 가능
    anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
  },
];

// 임시 목 데이터 - 최근 주문 (추후 API로 교체 예정)
const mockRecentOrders = [
  {
    id: "1",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    status: "delivered" as const,
    status_label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_scheduled_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    total_price: 0, // 가격 삭제, 나중에 내용 추가 가능
  },
  {
    id: "2",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    status: "shipping" as const,
    status_label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_scheduled_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    total_price: 0, // 가격 삭제, 나중에 내용 추가 가능
  },
  {
    id: "3",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    status: "preparing" as const,
    status_label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_scheduled_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    total_price: 0, // 가격 삭제, 나중에 내용 추가 가능
  },
];

// 임시 목 데이터 - 긴급 알림 (추후 API로 교체 예정)
const mockAlerts = [
  {
    id: "1",
    type: "stock_warning" as const,
    title: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    message: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    created_at: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
  },
  {
    id: "2",
    type: "notice" as const,
    title: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    message: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    created_at: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
  },
];

// 임시 목 데이터 - 월별 구매 추이 (추후 API로 교체 예정)
const mockMonthlyPurchaseData = [
  { month: "", amount: 0 }, // 텍스트 내용 및 금액 삭제, 나중에 내용 추가 가능
  { month: "", amount: 0 }, // 텍스트 내용 및 금액 삭제, 나중에 내용 추가 가능
  { month: "", amount: 0 }, // 텍스트 내용 및 금액 삭제, 나중에 내용 추가 가능
  { month: "", amount: 0 }, // 텍스트 내용 및 금액 삭제, 나중에 내용 추가 가능
  { month: "", amount: 0 }, // 텍스트 내용 및 금액 삭제, 나중에 내용 추가 가능
];

// 임시 목 데이터 - 배송 예정 알림 (추후 API로 교체 예정)
const mockDeliverySchedules = [
  {
    id: "2",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_date: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "일반 배송" as const,
    status: "shipping" as const,
  },
  {
    id: "3",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_date: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "새벽 배송" as const,
    status: "preparing" as const,
  },
];

// 임시 목 데이터 - 실시간 시세표 (추후 API로 교체 예정)
const mockMarketPrices = [
  {
    id: "1",
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    current_price: 0, // 가격 삭제, 나중에 내용 추가 가능
    previous_price: 0, // 가격 삭제, 나중에 내용 추가 가능
    unit: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    change_rate: 0, // 변화율 삭제, 나중에 내용 추가 가능
  },
  {
    id: "2",
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    current_price: 0, // 가격 삭제, 나중에 내용 추가 가능
    previous_price: 0, // 가격 삭제, 나중에 내용 추가 가능
    unit: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    change_rate: 0, // 변화율 삭제, 나중에 내용 추가 가능
  },
  {
    id: "3",
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    current_price: 0, // 가격 삭제, 나중에 내용 추가 가능
    previous_price: 0, // 가격 삭제, 나중에 내용 추가 가능
    unit: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    change_rate: 0, // 변화율 삭제, 나중에 내용 추가 가능
  },
  {
    id: "4",
    product_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    current_price: 0, // 가격 삭제, 나중에 내용 추가 가능
    previous_price: 0, // 가격 삭제, 나중에 내용 추가 가능
    unit: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    change_rate: 0, // 변화율 삭제, 나중에 내용 추가 가능
  },
];

export default function RetailerDashboardPage() {
  // 긴급 알림 상태 관리 (추후 API로 교체 시에도 동일한 구조 사용)
  const [alerts, setAlerts] = useState(mockAlerts);

  // 알림 삭제 핸들러
  // 추후 API 연동 시: await deleteAlert(alertId) 호출 후 상태 업데이트
  const handleDeleteAlert = (alertId: string) => {
    console.log("[Dashboard] 알림 삭제 요청:", alertId);
    
    // 목 데이터 삭제 (즉시 UI 업데이트)
    setAlerts((prev) => {
      const filtered = prev.filter((alert) => alert.id !== alertId);
      console.log("[Dashboard] 알림 삭제 완료. 남은 알림 수:", filtered.length);
      return filtered;
    });

    // TODO: 추후 API 연동 시 아래 코드 활성화
    // try {
    //   await deleteAlert(alertId);
    //   setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    // } catch (error) {
    //   console.error("알림 삭제 실패:", error);
    //   // 에러 처리 (토스트 메시지 등)
    // }
  };

  return (
    <div className="px-6 sm:px-9 lg:px-12 pb-6 md:pb-8">
      {/* 헤더 섹션 */}
      <div className="mb-6 md:mb-8 pt-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          실시간 시세와 재고, 주문 알림을 한눈에!
        </h2>
        <p className="mt-2 text-base md:text-lg text-gray-600 dark:text-gray-400">
          AI가 똑똑하게 알려드립니다.
        </p>
      </div>

      {/* Bento Grid 레이아웃 */}
      <BentoGrid>
        {/* 중간 카드: 최근 주문 (1x1) - R.DASH.03 */}
        <BentoCard className="min-h-[280px]">
          <RecentOrdersSummary orders={mockRecentOrders} />
        </BentoCard>

        {/* 작은 카드: 실시간 시세표 (1x1) */}
        <BentoCard className="min-h-[280px]">
          <MarketPriceTable prices={mockMarketPrices} />
        </BentoCard>

        {/* 작은 카드: 긴급 알림 (1x1) - R.DASH.04 */}
        <BentoCard className="min-h-[280px]">
          <UrgentAlerts alerts={alerts} onDelete={handleDeleteAlert} />
        </BentoCard>

        {/* 큰 카드: AI 추천 상품 (전체 너비) - R.DASH.02 */}
        <div className="col-span-full rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow min-h-[400px] md:min-h-[500px]">
          <AIRecommendationList products={mockRecommendedProducts} />
        </div>

        {/* 배송 예정 알림과 월별 구매 추이 차트를 1칸 반씩 배치 */}
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
          {/* 배송 예정 알림 (1칸 반 = 3/6) */}
          <div className="lg:col-span-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow min-h-[280px]">
            <DeliveryScheduleAlerts schedules={mockDeliverySchedules} />
          </div>

          {/* 월별 구매 추이 차트 (1칸 반 = 3/6) */}
          <div className="lg:col-span-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow min-h-[280px]">
            <MonthlyPurchaseChart data={mockMonthlyPurchaseData} />
          </div>
        </div>
      </BentoGrid>

      {/* 이벤트/프로모션 배너 섹션 */}
      <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* 현재 진행 중인 할인 이벤트 배너 */}
        <div className="rounded-xl bg-white dark:bg-gray-800 border-2 border-red-500 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs md:text-sm font-semibold">
              진행중
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">할인 이벤트</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            연말 특가 할인
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-4">
            전체 상품 최대 30% 할인
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-bold text-red-500">30%</span>
            <span className="text-gray-600 dark:text-gray-400 text-base md:text-lg">할인</span>
          </div>
        </div>

        {/* 시즌 특가 배너 (첫 구매자/단골고객 전용) */}
        <div className="rounded-xl bg-white dark:bg-gray-800 border-2 border-blue-500 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs md:text-sm font-semibold">
              시즌 특가
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">첫 구매자/단골고객 전용</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            겨울 시즌 특가
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-4">
            첫 구매자 20% 추가 할인<br />
            단골고객 15% 추가 할인
          </p>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-blue-500">20%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">첫 구매자</span>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-blue-500">15%</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">단골고객</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
