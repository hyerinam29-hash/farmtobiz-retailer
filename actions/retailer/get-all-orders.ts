/**
 * @file actions/retailer/get-all-orders.ts
 * @description 전체 주문 목록 조회 Server Action
 *
 * 주문 내역 페이지와 동일하게 전체 주문 목록을 조회합니다.
 * 취소된 주문은 제외하고 모든 상태의 주문을 반환합니다.
 *
 * @dependencies
 * - lib/supabase/queries/orders.ts
 */

"use server";

import { getOrders } from "@/lib/supabase/queries/orders";
import type { OrderDetail } from "@/types/order";

/**
 * 전체 주문 목록 조회 (취소된 주문 제외)
 * 주문 내역 페이지와 동일한 데이터를 반환합니다.
 */
export async function getAllOrders(): Promise<OrderDetail[]> {
  console.log("📦 [server-action] 전체 주문 목록 조회 시작");

  try {
    // 전체 주문 조회 (필터 없음, 취소된 주문 포함)
    const { orders } = await getOrders({
      page: 1,
      pageSize: 50, // 주문 내역 페이지와 동일하게 50개까지
      sortBy: "created_at",
      sortOrder: "desc",
    });

    // 취소된 주문 제외
    const filteredOrders = orders.filter(
      (order) => order.status !== "cancelled"
    );

    console.log("✅ [server-action] 전체 주문 목록 조회 완료", {
      total: orders.length,
      filtered: filteredOrders.length,
    });

    return filteredOrders;
  } catch (error) {
    console.error("❌ [server-action] 전체 주문 목록 조회 실패:", error);
    return [];
  }
}

