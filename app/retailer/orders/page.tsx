/**
 * @file app/retailer/orders/page.tsx
 * @description 소매점 주문 내역 페이지
 *
 * 주요 기능:
 * 1. 주문 상태 조회 (R.MY.01)
 * 2. 배송 타임라인 (R.MY.02)
 * 3. 구매 확정 (R.MY.03)
 * 4. 상품명 및 주문번호 검색 (R.SEARCH.01)
 *
 * @dependencies
 * - app/retailer/layout.tsx (레이아웃)
 * - app/retailer/orders/OrdersClient.tsx (클라이언트 컴포넌트)
 *
 * @see {@link PRD.md} - R.MY.01~03, R.SEARCH.01 요구사항
 */

import OrdersClient from "./OrdersClient";
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

// API 실패 또는 데이터 없음 시 화면이 비지 않도록 예시 데이터 제공
const fallbackOrders: OrderListItem[] = [
  {
    id: "fallback-1",
    order_number: "ORD-EXAMPLE-001",
    order_date: new Date().toLocaleDateString("ko-KR"),
    products: [
      {
        name: "표시용 예시 상품",
        quantity: 1,
      },
    ],
    total_price: 0,
    status: "preparing",
    status_label: "준비 중",
    delivery_method: "확인 중",
    delivery_scheduled_time: "확인 중",
  },
];

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
  return <OrdersClient orders={orders} />;
}

