/**
 * @file app/retailer/delivery-tracking/page.tsx
 * @description 실시간 배송 조회 페이지
 *
 * 사용자가 배송 중인 주문의 실시간 위치와 상태를 조회할 수 있는 페이지입니다.
 *
 * 주요 기능:
 * 1. 배송 상태 요약 (송장번호, 도착 예정 시간)
 * 2. 배송 타임라인 (주문완료 → 결제완료 → 배송중 → 배송완료)
 * 3. 택배사 정보
 * 4. 배송 물품 목록
 *
 * @dependencies
 * - actions/retailer/get-shipping-orders.ts
 * - lucide-react: 아이콘
 * - next/navigation: 라우팅
 */

import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getOrderForDeliveryTracking } from "@/actions/retailer/get-shipping-orders";
import DeliveryTrackingContent from "./delivery-tracking-content";
import { EmptyState } from "@/components/common/EmptyState";

interface DeliveryTrackingPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

/**
 * 배송 상태에 따른 타임라인 단계 정의
 */
const timelineSteps = [
  { key: "pending", label: "주문완료", status: "pending" },
  { key: "confirmed", label: "결제완료", status: "confirmed" },
  { key: "shipped", label: "배송중", status: "shipped" },
  { key: "completed", label: "배송완료", status: "completed" },
];

/**
 * 주문 상태에 따른 배송 상태 텍스트 반환
 * 현재 사용되지 않지만 향후 사용 예정이므로 유지
 */
// function getDeliveryStatusText(status: string): string {
//   switch (status) {
//     case "pending":
//       return "주문완료";
//     case "confirmed":
//       return "배송준비";
//     case "shipped":
//       return "배송중";
//     case "completed":
//       return "배송완료";
//     case "cancelled":
//       return "주문취소";
//     default:
//       return "주문완료";
//   }
// }

/**
 * 주문 상태에 따른 배송 상태 배지 색상 반환
 */
function getDeliveryStatusBadge(status: string): {
  bg: string;
  text: string;
} {
  switch (status) {
    case "shipped":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-500",
      };
    case "completed":
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-500",
      };
    case "confirmed":
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-500",
      };
    case "pending":
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
      };
    case "cancelled":
      return {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-500",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
      };
  }
}

/**
 * 도착 예정 시간 계산 (주문 생성 시간 + 배송 옵션 기반)
 */
function calculateEstimatedDeliveryTime(
  createdAt: string,
  deliveryOption?: string | null,
): string {
  const orderDate = new Date(createdAt);
  const now = new Date();

  // 배송 옵션에 따른 예상 소요 시간 (시간)
  let estimatedHours = 24; // 기본 24시간

  if (deliveryOption === "dawn") {
    estimatedHours = 12; // 새벽 배송은 12시간
  } else if (deliveryOption === "quick") {
    estimatedHours = 6; // 긴급 배송은 6시간
  }

  // 주문 시간 + 예상 소요 시간
  const estimatedDelivery = new Date(orderDate.getTime() + estimatedHours * 60 * 60 * 1000);

  // 현재 시간이 예상 배송 시간을 넘었으면 "곧 도착" 표시
  if (now >= estimatedDelivery) {
    return "곧 도착 예정";
  }

  // 시간 포맷팅 (예: 14:00 ~ 15:00)
  const hour = estimatedDelivery.getHours();
  const nextHour = hour + 1;

  return `${hour.toString().padStart(2, "0")}:00 ~ ${nextHour.toString().padStart(2, "0")}:00`;
}

export default async function DeliveryTrackingPage({
  searchParams,
}: DeliveryTrackingPageProps) {
  const { orderId } = await searchParams;

  console.log("🚚 [배송조회] 페이지 로드", { orderId });

  // 주문 ID가 없으면 빈 상태 표시
  if (!orderId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans bg-[#F8F9FA] dark:bg-gray-900 min-h-screen">
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

        <EmptyState
          title="배송 조회할 주문을 선택해주세요"
          description="주문 내역에서 배송 중인 주문을 선택하여 배송 정보를 확인하세요."
          actionLabel="주문 내역 보기"
          actionHref="/retailer/orders"
        />
      </div>
    );
  }

  // 주문 데이터 조회
  const order = await getOrderForDeliveryTracking(orderId);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans bg-[#F8F9FA] dark:bg-gray-900 min-h-screen">
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

        <EmptyState
          title="주문을 찾을 수 없습니다"
          description="해당 주문이 존재하지 않거나 배송 조회가 불가능한 주문입니다."
          actionLabel="주문 내역 보기"
          actionHref="/retailer/orders"
        />
      </div>
    );
  }

  console.log("✅ [배송조회] 주문 데이터 조회 완료", {
    orderId: order.id,
    orderNumber: order.order_number,
    status: order.status,
  });

  const statusBadge = getDeliveryStatusBadge(order.status);
  // delivery_option은 데이터베이스에 있을 수 있지만 타입에 정의되지 않았으므로 any로 처리
  const deliveryOption = (order as any).delivery_option as string | null | undefined;
  const estimatedTime = calculateEstimatedDeliveryTime(order.created_at, deliveryOption);
  const currentStepIndex = timelineSteps.findIndex((step) => step.status === order.status);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <DeliveryTrackingContent
        order={order}
        statusBadge={statusBadge}
        estimatedTime={estimatedTime}
        currentStepIndex={currentStepIndex}
        timelineSteps={timelineSteps}
      />
    </Suspense>
  );
}

