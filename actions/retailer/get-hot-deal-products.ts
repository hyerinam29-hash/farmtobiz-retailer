/**
 * @file actions/retailer/get-hot-deal-products.ts
 * @description 대시보드 HOT DEAL 섹션용 상품 4개 조회 Server Action
 *
 * - 최신순으로 4개 조회 (추가 필터가 필요하면 여기서 조정)
 * - 도매 정보는 익명화된 필드를 그대로 반환
 */

"use server";

import { getRetailerProducts } from "@/lib/supabase/queries/retailer-products";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";

/**
 * HOT DEAL 노출용 상품 4개 조회
 */
export async function getHotDealProducts(): Promise<RetailerProduct[]> {
  console.log("🔥 [server-action] HOT DEAL 상품 조회 시작");

  const { products } = await getRetailerProducts({
    page: 1,
    pageSize: 4,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  console.log("🔥 [server-action] HOT DEAL 상품 조회 완료", {
    count: products.length,
  });

  return products;
}


