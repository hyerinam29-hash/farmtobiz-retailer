/**
 * @file actions/retailer/get-shipping-orders.ts
 * @description 배송 중인 주문 조회 Server Action
 *
 * 배송 조회 페이지에서 사용할 배송 중인 주문 목록을 조회합니다.
 *
 * @dependencies
 * - lib/supabase/queries/orders.ts
 */

"use server";

import { getOrders } from "@/lib/supabase/queries/orders";
import type { OrderDetail } from "@/types/order";

/**
 * 배송 중인 주문 조회
 * shipped, completed 상태의 주문만 조회
 */
export async function getShippingOrders(): Promise<OrderDetail[]> {
  console.log("🚚 [server-action] 배송 중인 주문 조회 시작");

  try {
    // 배송 중(shipped) 또는 배송 완료(completed) 상태의 주문 조회
    const { orders } = await getOrders({
      page: 1,
      pageSize: 10,
      sortBy: "created_at",
      sortOrder: "desc",
      filter: {
        status: "shipped", // 배송 중인 주문만
      },
    });

    console.log("✅ [server-action] 배송 중인 주문 조회 완료", {
      count: orders.length,
    });

    return orders;
  } catch (error) {
    console.error("❌ [server-action] 배송 중인 주문 조회 실패:", error);
    return [];
  }
}

/**
 * 특정 주문의 배송 정보 조회
 */
export async function getOrderForDeliveryTracking(
  orderId: string,
): Promise<OrderDetail | null> {
  console.log("🚚 [server-action] 배송 조회용 주문 정보 조회 시작", { orderId });

  try {
    const { getOrderById } = await import("@/lib/supabase/queries/orders");
    const order = await getOrderById(orderId);

    if (!order) {
      console.log("⚠️ [server-action] 주문 없음", { orderId });
      return null;
    }

    // 배송 관련 상태만 조회 가능 (pending, confirmed는 배송 전 단계)
    if (order.status === "cancelled") {
      console.log("⚠️ [server-action] 취소된 주문", { orderId });
      return null;
    }

    console.log("✅ [server-action] 배송 조회용 주문 정보 조회 완료", {
      orderId,
      status: order.status,
    });

    return order;
  } catch (error) {
    console.error("❌ [server-action] 배송 조회용 주문 정보 조회 실패:", error);
    return null;
  }
}

