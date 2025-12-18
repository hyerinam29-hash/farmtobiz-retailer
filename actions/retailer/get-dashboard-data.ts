/**
 * @file actions/retailer/get-dashboard-data.ts
 * @description 대시보드 페이지의 모든 데이터를 한 번에 조회하는 통합 Server Action
 *
 * 기존의 3개 서버 액션을 통합하여 POST 요청을 3개에서 1개로 감소:
 * - getHotDealProducts (HOT DEAL 상품 4개)
 * - getRecentOrdersForDashboard (최근 주문 3건)
 * - getAllOrders (전체 주문 목록, 배송 조회용)
 *
 * @dependencies
 * - lib/supabase/queries/retailer-products.ts
 * - lib/supabase/queries/orders.ts
 */

"use server";

import { getRetailerProducts } from "@/lib/supabase/queries/retailer-products";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";
import { getOrders } from "@/lib/supabase/queries/orders";
import type { OrderDetail } from "@/types/order";

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  productName: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  quantity: number;
}

export interface DashboardData {
  hotDeals: RetailerProduct[];
  recentOrders: DashboardRecentOrder[];
  shippingOrders: OrderDetail[];
}

/**
 * 대시보드 페이지의 모든 데이터를 한 번에 조회
 *
 * @returns {Promise<DashboardData>} HOT DEAL 상품, 최근 주문, 배송 조회용 주문 데이터
 */
export async function getDashboardData(): Promise<DashboardData> {
  console.log("📊 [server-action] 대시보드 데이터 통합 조회 시작");

  try {
    // 병렬로 3개의 데이터를 동시에 가져오기
    const [hotDealsResult, recentOrdersResult, allOrdersResult] = await Promise.all([
      // 1. HOT DEAL 상품 4개 조회
      getRetailerProducts({
        page: 1,
        pageSize: 4,
        sortBy: "created_at",
        sortOrder: "desc",
      }),

      // 2. 최근 주문 3건 조회
      getOrders({
        page: 1,
        pageSize: 3,
        sortBy: "created_at",
        sortOrder: "desc",
      }),

      // 3. 전체 주문 목록 조회 (배송 조회용, 최대 50건)
      getOrders({
        page: 1,
        pageSize: 50,
        sortBy: "created_at",
        sortOrder: "desc",
      }),
    ]);

    // HOT DEAL 상품
    const hotDeals = hotDealsResult.products;

    // 최근 주문 3건 (대시보드용 포맷으로 변환)
    const recentOrders: DashboardRecentOrder[] = recentOrdersResult.orders.map((order) => ({
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

    // 전체 주문 목록 (취소된 주문 제외)
    const shippingOrders = allOrdersResult.orders.filter(
      (order) => order.status !== "cancelled"
    );

    console.log("✅ [server-action] 대시보드 데이터 통합 조회 완료", {
      hotDeals: hotDeals.length,
      recentOrders: recentOrders.length,
      shippingOrders: shippingOrders.length,
    });

    return {
      hotDeals,
      recentOrders,
      shippingOrders,
    };
  } catch (error) {
    console.error("❌ [server-action] 대시보드 데이터 통합 조회 실패:", error);

    // 에러 발생 시 빈 데이터 반환
    return {
      hotDeals: [],
      recentOrders: [],
      shippingOrders: [],
    };
  }
}
