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
 *
 * @see {@link PRD.md} - R.MY.01~03 요구사항
 */

import Link from "next/link";
import { Search, Calendar } from "lucide-react";
import OrderListItemActions from "@/components/retailer/order-list-item-actions";
import { getOrders } from "@/lib/supabase/queries/orders";
import type { OrderDetail } from "@/types/order";

// 타입 정의
type OrderStatus = "preparing" | "shipping" | "delivered" | "cancelled";

// 주문 목록 표시용 타입 (UI에 맞게 변환)
interface OrderListItem {
  id: string;
  order_number: string;
  order_date: string;
  products: Array<{
    name: string;
    quantity: number;
  }>;
  total_price: number;
  status: OrderStatus;
  status_label: string;
  delivery_method: string;
  delivery_scheduled_time: string;
}

// OrderDetail을 OrderListItem으로 변환하는 함수
function transformOrderToListItem(order: OrderDetail): OrderListItem {
  // 상태 매핑 (DB 상태 → UI 상태)
  const statusMap: Record<string, OrderStatus> = {
    pending: "preparing",
    confirmed: "preparing",
    shipped: "shipping",
    completed: "delivered",
    cancelled: "cancelled",
  };

  const statusLabelMap: Record<string, string> = {
    pending: "준비 중",
    confirmed: "준비 중",
    shipped: "배송 중",
    completed: "배송 완료",
    cancelled: "주문 취소",
  };

  const uiStatus = statusMap[order.status] || "preparing";
  const statusLabel = statusLabelMap[order.status] || "준비 중";

  // 배송 방법 (추후 delivery_method 필드 추가 시 수정 필요)
  const deliveryMethod = "일반 배송"; // TODO: 실제 배송 방법 데이터로 교체

  // 배송 예정 시간 (추후 delivery_scheduled_time 필드 추가 시 수정 필요)
  const deliveryScheduledTime = "확인 중"; // TODO: 실제 배송 예정 시간 데이터로 교체

  return {
    id: order.id,
    order_number: order.order_number,
    order_date: new Date(order.created_at).toLocaleDateString("ko-KR"),
    products: [
      {
        name: order.product.name || order.product.standardized_name || "상품명 없음",
        quantity: order.quantity,
      },
    ],
    total_price: order.total_amount,
    status: uiStatus,
    status_label: statusLabel,
    delivery_method: deliveryMethod,
    delivery_scheduled_time: deliveryScheduledTime,
  };
}

const statusColors = {
  preparing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  shipping: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function OrdersPage() {
  // 주문 목록 조회 (현재는 데이터가 없을 수 있으므로 에러 처리)
  let orders: OrderListItem[] = [];
  
  try {
    console.log("[OrdersPage] 주문 목록 조회 시작");
    const result = await getOrders({
      page: 1,
      pageSize: 50, // 초기에는 50개까지 표시
      sortBy: "created_at",
      sortOrder: "desc",
    });
    
    // OrderDetail을 OrderListItem으로 변환
    orders = result.orders.map(transformOrderToListItem);
    console.log("[OrdersPage] 주문 목록 조회 완료", { count: orders.length });
  } catch (error) {
    // 에러 발생 시 빈 배열로 처리 (데이터가 없거나 API가 준비되지 않은 경우)
    console.log("[OrdersPage] 주문 목록 조회 실패 또는 데이터 없음", error);
    orders = [];
  }
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
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
              주문 내역이 없습니다
            </p>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-500">
              주문을 하시면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          orders.map((order) => (
          <div
            key={order.id}
            className="p-8 sm:p-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            {/* 주문 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-400">
                    {order.order_date}
                  </span>
                  <span className="text-base sm:text-lg text-gray-400">·</span>
                  <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 break-all">
                    {order.order_number}
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <span
                    className={`inline-flex items-center px-5 py-1 rounded-full text-base font-medium ${statusColors[order.status as keyof typeof statusColors]}`}
                  >
                    {order.status_label}
                  </span>
                  <span className="text-base text-gray-500 dark:text-gray-400">
                    {order.delivery_method}
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
                {order.products.map((product, index) => (
                  <p
                    key={index}
                    className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 break-words"
                  >
                    {product.name}
                    {order.products.length > 1 &&
                      index === 0 &&
                      ` 외 ${order.products.length - 1}건`}
                  </p>
                ))}
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                  수량: {order.products.reduce((sum, p) => sum + p.quantity, 0)}개
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
                  {order.total_price.toLocaleString()}원
                </span>
              </div>

              <OrderListItemActions
                orderId={order.id}
                orderNumber={order.order_number}
                status={order.status}
                totalPrice={order.total_price}
              />
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}

