/**
 * @file actions/retailer/get-recommended-products.ts
 * @description 추천 상품 조회 Server Action
 *
 * "이 상품 어때요?" 섹션에서 사용하는 과일 상품 4개를 조회하는 서버 액션입니다.
 *
 * @dependencies
 * - lib/supabase/queries/retailer-products
 */

"use server";

import { getRetailerProducts } from "@/lib/supabase/queries/retailer-products";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";

/**
 * 추천 상품 조회 결과
 */
export interface GetRecommendedProductsResult {
  success: boolean;
  products?: RetailerProduct[];
  error?: string;
}

/**
 * 과일 카테고리에서 인기 상품 4개 조회
 *
 * @returns {Promise<GetRecommendedProductsResult>} 조회 결과
 */
export async function getRecommendedProducts(): Promise<GetRecommendedProductsResult> {
  console.log("🔍 [server-action] 추천 상품 조회 시작");

  try {
    const result = await getRetailerProducts({
      page: 1,
      pageSize: 4,
      sortBy: "created_at",
      sortOrder: "desc",
      filter: {
        category: "과일",
      },
    });

    console.log("✅ [server-action] 추천 상품 조회 완료:", {
      count: result.products.length,
    });

    return {
      success: true,
      products: result.products,
    };
  } catch (error) {
    console.error("❌ [server-action] 추천 상품 조회 오류:", error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "상품을 불러오는 중 오류가 발생했습니다.",
    };
  }
}

