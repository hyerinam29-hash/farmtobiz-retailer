/**
 * @file app/retailer/orders/page.tsx
 * @description 소매점 주문 내역 페이지
 *
 * 주요 기능:
 * 1. 주문 상태 조회 (R.MY.01)
 * 2. 배송 타임라인 (R.MY.02)
 * 3. 구매 확정 (R.MY.03)
 *
 * @dependencies
 * - app/retailer/layout.tsx (레이아웃)
 * - lib/supabase/queries/orders.ts
 * - types/order.ts
 *
 * @see {@link PRD.md} - R.MY.01~03 요구사항
 */

import Link from "next/link";
import { Search, Calendar } from "lucide-react";
import OrderListItemActions from "@/components/retailer/order-list-item-actions";
import { getOrders } from "@/lib/supabase/queries/orders";
import type { OrderStatus } from "@/types/order";

// 주문 상태별 표시 설정
const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; displayStatus: "preparing" | "shipping" | "delivered" | "cancelled" }
> = {
  pending: {
    label: "준비 중",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    displayStatus: "preparing",
  },
  confirmed: {
    label: "주문 완료",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    displayStatus: "preparing",
  },
  shipped: {
    label: "배송 중",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    displayStatus: "shipping",
  },
  completed: {
    label: "배송 완료",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    displayStatus: "delivered",
  },
  cancelled: {
    label: "주문 취소",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    displayStatus: "cancelled",
  },
};

// 날짜 포맷팅 함수
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function OrdersPage() {
  console.log("[OrdersPage] 주문 내역 페이지 로드 시작");

  // 실제 주문 데이터 가져오기
  let ordersResult;
  try {
    ordersResult = await getOrders({
      page: 1,
      pageSize: 50, // 충분한 수량 가져오기
      sortBy: "created_at",
      sortOrder: "desc",
    });
    console.log("[OrdersPage] 주문 데이터 조회 완료", {
      count: ordersResult.orders.length,
      total: ordersResult.total,
    });
  } catch (error) {
    console.error("[OrdersPage] 주문 데이터 조회 실패:", error);
    // 에러 발생 시 빈 배열로 처리
    ordersResult = {
      orders: [],
      total: 0,
      page: 1,
      pageSize: 50,
      totalPages: 0,
    };
  }

  const orders = ordersResult.orders;
  return (
    <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pb-12 md:pb-16">
      {/* 헤더 */}
      <div className="mb-12 md:mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
          주문 내역
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400">
          주문 상태 및 배송 정보를 확인하세요
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* 검색창 */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 text-gray-400" />
            <input
              type="text"
              placeholder="상품명, 주문번호로 검색"
              className="w-full pl-20 pr-8 py-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            />
          </div>
        </div>

        {/* 조회 기간 */}
        <button className="flex items-center justify-center gap-4 px-8 py-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
          <Calendar className="w-10 h-10" />
          <span className="text-lg">조회 기간 설정</span>
        </button>
      </div>

      {/* 상태 필터 */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
        <button className="px-8 py-4 bg-green-500 text-white rounded-full text-lg font-medium whitespace-nowrap">
          전체
        </button>
        <button className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-lg font-medium whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700">
          주문 완료
        </button>
        <button className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-lg font-medium whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700">
          배송 중
        </button>
        <button className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-lg font-medium whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700">
          배송 완료
        </button>
        <button className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-lg font-medium whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700">
          주문 취소
        </button>
      </div>

      {/* 주문 목록 */}
      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="p-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              주문 내역이 없습니다
            </p>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-500">
              주문하시면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const statusInfo = statusConfig[order.status];
            const productName = order.product?.name || "상품명 없음";
            const variantName = order.variant?.name ? ` (${order.variant.name})` : "";

            return (
              <div
                key={order.id}
                className="p-8 sm:p-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                {/* 주문 헤더 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
                        {formatDate(order.created_at)}
                      </span>
                      <span className="text-base sm:text-lg text-gray-400">·</span>
                      <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 break-all">
                        {order.order_number}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span
                        className={`inline-flex items-center px-5 py-1 rounded-full text-base font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/retailer/orders/${order.id}`}
                    className="text-base sm:text-lg text-green-600 dark:text-green-400 font-medium hover:underline whitespace-nowrap flex-shrink-0"
                  >
                    상세 보기
                  </Link>
                </div>

                {/* 주문 내용 */}
                <div className="py-8">
                  <div className="flex flex-col gap-4">
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
                      {productName}
                      {variantName}
                    </p>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                      수량: {order.quantity}개
                    </p>
                  </div>
                </div>

                {/* 주문 푸터 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col gap-2">
                    <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                      결제 금액
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {order.total_amount.toLocaleString()}원
                    </span>
                  </div>

                  <OrderListItemActions
                    orderId={order.id}
                    orderNumber={order.order_number}
                    status={statusInfo.displayStatus}
                    totalPrice={order.total_amount}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

