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
import { getUserProfile } from "@/lib/clerk/auth";

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
  recommendedProducts: RetailerProduct[];
}

/**
 * 대시보드 페이지의 모든 데이터를 한 번에 조회
 *
 * @returns {Promise<DashboardData>} HOT DEAL 상품, 추천 상품, 최근 주문, 배송 조회용 주문 데이터
 */
export async function getDashboardData(): Promise<DashboardData> {
  console.log("📊 [server-action] 대시보드 데이터 통합 조회 시작");

  try {
    // ⚡ 성능 최적화: getUserProfile()을 한 번만 호출하고 retailerId 재사용
    console.log("🔍 [server-action] 사용자 프로필 조회 시작 (한 번만 호출)");
    const profile = await getUserProfile();

    if (!profile) {
      throw new Error("사용자 프로필을 찾을 수 없습니다.");
    }

    if (profile.role !== "retailer") {
      throw new Error("소매점 권한이 없습니다.");
    }

    const retailers = profile.retailers as Array<{ id: string }> | null;
    if (!retailers || retailers.length === 0) {
      throw new Error("소매점 정보를 찾을 수 없습니다.");
    }

    const retailerId = retailers[0].id;
    console.log("✅ [server-action] 소매점 ID 조회 완료:", retailerId);

    // 🚀 우선순위 로딩: 페이지 최상단 상품들을 병렬로 조회
    // ⚡ 성능 최적화:
    // 1. 대시보드에서는 total count가 필요 없으므로 includeCount: false
    // 2. unstable_cache()와 Clerk auth() 충돌로 인해 캐싱 비활성화
    console.log(
      "🔥 [server-action] HOT DEAL 및 추천 상품 조회 시작 (병렬 로딩)",
    );
    const [hotDealsResult, recommendedProductsResult] = await Promise.all([
      // HOT DEAL 상품 4개
      getRetailerProducts({
        page: 1,
        pageSize: 4,
        sortBy: "created_at",
        sortOrder: "desc",
        includeCount: false, // ⚡ count 쿼리 생략으로 성능 향상
        useCache: false, // ⚠️ Clerk auth()와 unstable_cache() 충돌 방지
      }),
      // 추천 상품 4개 (과일 카테고리)
      getRetailerProducts({
        page: 1,
        pageSize: 4,
        sortBy: "created_at",
        sortOrder: "desc",
        filter: {
          category: "과일",
        },
        includeCount: false,
        useCache: false, // ⚠️ Clerk auth()와 unstable_cache() 충돌 방지
      }),
    ]);
    console.log("✅ [server-action] HOT DEAL 및 추천 상품 조회 완료");

    // 📦 주문 데이터는 병렬로 조회 (페이지 하단 데이터이므로 HOT DEAL 이후 로딩)
    console.log("📦 [server-action] 주문 데이터 조회 시작 (병렬 처리)");
    const [recentOrdersResult, shippingOrdersResult] = await Promise.all([
      // 최근 주문 3건 조회 (retailerId 전달)
      getOrders({
        page: 1,
        pageSize: 3,
        sortBy: "created_at",
        sortOrder: "desc",
        retailerId, // ⚡ 중복 getUserProfile() 호출 방지
      }),

      // 배송 조회용 주문 2건만 조회 (실제 사용량에 맞춤, retailerId 전달)
      getOrders({
        page: 1,
        pageSize: 2,
        sortBy: "created_at",
        sortOrder: "desc",
        retailerId, // ⚡ 중복 getUserProfile() 호출 방지
      }),
    ]);
    console.log("✅ [server-action] 주문 데이터 조회 완료");

    // HOT DEAL 상품
    const hotDeals = hotDealsResult.products;

    // 추천 상품 (과일 카테고리)
    const recommendedProducts = recommendedProductsResult.products;

    // 최근 주문 3건 (대시보드용 포맷으로 변환)
    const recentOrders: DashboardRecentOrder[] = recentOrdersResult.orders.map(
      (order) => ({
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
      }),
    );

    // 배송 조회용 주문 (취소된 주문 제외)
    const shippingOrders = shippingOrdersResult.orders.filter(
      (order) => order.status !== "cancelled",
    );

    console.log("✅ [server-action] 대시보드 데이터 통합 조회 완료", {
      hotDeals: hotDeals.length,
      recommendedProducts: recommendedProducts.length,
      recentOrders: recentOrders.length,
      shippingOrders: shippingOrders.length,
    });

    return {
      hotDeals,
      recommendedProducts,
      recentOrders,
      shippingOrders,
    };
  } catch (error) {
    console.error("❌ [server-action] 대시보드 데이터 통합 조회 실패:", error);

    // 에러 발생 시 빈 데이터 반환
    return {
      hotDeals: [],
      recommendedProducts: [],
      recentOrders: [],
      shippingOrders: [],
    };
  }
}
