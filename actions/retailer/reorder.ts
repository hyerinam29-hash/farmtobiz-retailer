/**
 * @file actions/retailer/reorder.ts
 * @description 재주문 Server Action
 *
 * 이전 주문의 상품 정보를 조회하여 반환합니다.
 * 클라이언트에서 장바구니에 추가할 수 있도록 상품 정보를 제공합니다.
 *
 * @dependencies
 * - lib/supabase/queries/retailer-products.ts
 */

"use server";

import { getRetailerProductById } from "@/lib/supabase/queries/retailer-products";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";

export interface ReorderRequest {
  productIds: string[];
}

export interface ReorderResult {
  success: boolean;
  products?: RetailerProduct[];
  error?: string;
}

/**
 * 재주문을 위한 상품 정보 조회
 * 
 * @param request 재주문 요청 (상품 ID 배열)
 * @returns 상품 정보 배열
 */
export async function getReorderProducts(
  request: ReorderRequest
): Promise<ReorderResult> {
  try {
    console.group("🔄 [재주문] 상품 정보 조회 시작");
    console.log("요청 정보:", { productIds: request.productIds });

    if (!request.productIds || request.productIds.length === 0) {
      console.error("❌ 상품 ID 없음");
      console.groupEnd();
      return {
        success: false,
        error: "상품 정보가 없습니다.",
      };
    }

    const products: RetailerProduct[] = [];

    // 각 상품 정보 조회
    for (const productId of request.productIds) {
      console.log("📦 [재주문] 상품 정보 조회 중:", productId);
      
      const product = await getRetailerProductById(productId);
      
      if (!product) {
        console.warn("⚠️ [재주문] 상품을 찾을 수 없음:", productId);
        continue;
      }

      console.log("✅ [재주문] 상품 정보 조회 완료:", {
        productId: product.id,
        productName: product.name,
        price: product.price,
      });

      products.push(product);
    }

    if (products.length === 0) {
      console.error("❌ 조회된 상품 없음");
      console.groupEnd();
      return {
        success: false,
        error: "조회된 상품이 없습니다.",
      };
    }

    console.log("✅ [재주문] 상품 정보 조회 완료:", {
      totalProducts: products.length,
    });
    console.groupEnd();

    return {
      success: true,
      products,
    };
  } catch (error) {
    console.error("❌ [재주문] 상품 정보 조회 실패:", error);
    console.groupEnd();
    return {
      success: false,
      error: "상품 정보 조회 중 오류가 발생했습니다.",
    };
  }
}

