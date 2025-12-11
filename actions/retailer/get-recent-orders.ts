/**
 * @file actions/retailer/get-recent-orders.ts
 * @description 대시보드 최근 주문 3건 조회 Server Action
 *
 * - 프로필 페이지와 동일한 실데이터를 사용하도록 getOrders를 래핑
 * - 대시보드용 최소 필드만 반환
 */

"use server";

import { getOrders } from "@/lib/supabase/queries/orders";

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  productName: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  quantity: number;
}

/**
 * 대시보드 최근 주문 3건 조회
 */
export async function getRecentOrdersForDashboard(): Promise<DashboardRecentOrder[]> {
  console.log("📦 [server-action] 대시보드 최근 주문 조회 시작");

  const { orders } = await getOrders({
    page: 1,
    pageSize: 3,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const result = orders.map((order) => ({
    id: order.id,
    orderNumber: order.order_number,
    productName:
      order.product?.name ||
      order.product?.standardized_name ||
      "상품명 없음",
    createdAt: order.created_at,
    totalAmount: order.total_amount,
    status: order.status,
    quantity: order.quantity,
  }));

  console.log("✅ [server-action] 대시보드 최근 주문 조회 완료", {
    count: result.length,
  });

  return result;
}


