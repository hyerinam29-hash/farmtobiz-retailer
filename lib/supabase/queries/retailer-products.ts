/**
 * @file lib/supabase/queries/retailer-products.ts
 * @description 소매점용 상품 조회 쿼리 함수
 *
 * 소매점이 모든 도매점의 상품을 조회할 수 있는 쿼리 함수들을 제공합니다.
 * 도매 정보는 익명화되어 표시됩니다.
 *
 * @dependencies
 * - lib/supabase/clerk-client.ts
 * - types/product.ts
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

/**
 * 소매점용 상품 목록 조회 옵션
 */
export interface GetRetailerProductsOptions {
  page?: number;
  pageSize?: number;
  sortBy?: "created_at" | "price" | "standardized_name";
  sortOrder?: "asc" | "desc";
  filter?: {
    category?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
  };
}

/**
 * 소매점용 상품 목록 조회 결과 (익명화된 도매 정보 포함)
 */
export interface RetailerProduct extends Product {
  wholesaler_anonymous_code: string;
  wholesaler_region: string;
  delivery_dawn_available: boolean;
}

export interface GetRetailerProductsResult {
  products: RetailerProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 소매점용 상품 목록 조회
 *
 * 모든 도매점의 활성화된 상품을 조회하며, 도매 정보는 익명화됩니다.
 *
 * @param options 조회 옵션
 * @returns 상품 목록 및 페이지네이션 정보
 */
export async function getRetailerProducts(
  options: GetRetailerProductsOptions = {}
): Promise<GetRetailerProductsResult> {
  const {
    page = 1,
    pageSize = 12,
    sortBy = "created_at",
    sortOrder = "desc",
    filter = {},
  } = options;

  console.log("🔍 [retailer-products-query] 상품 목록 조회 시작", {
    page,
    pageSize,
    sortBy,
    sortOrder,
    filter,
  });

  const supabase = createClerkSupabaseClient();

  // products와 wholesalers를 조인하여 익명 정보 가져오기
  let query = supabase
    .from("products")
    .select(
      `
      *,
      wholesalers!inner (
        anonymous_code,
        address
      )
    `,
      { count: "exact" }
    )
    .eq("is_active", true); // 활성화된 상품만

  // 필터 적용
  if (filter.category) {
    // "곡물/견과" 카테고리는 "곡물" 또는 "견과류"를 모두 포함
    if (filter.category === "곡물/견과") {
      query = query.or("category.eq.곡물,category.eq.견과류");
    } else {
      query = query.eq("category", filter.category);
    }
  }

  if (filter.search) {
    // standardized_name, original_name, name, category에서 검색
    query = query.or(
      `standardized_name.ilike.%${filter.search}%,original_name.ilike.%${filter.search}%,name.ilike.%${filter.search}%,category.ilike.%${filter.search}%`
    );
  }

  if (filter.min_price !== undefined) {
    query = query.gte("price", filter.min_price);
  }

  if (filter.max_price !== undefined) {
    query = query.lte("price", filter.max_price);
  }

  // 정렬 적용
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // 페이지네이션 적용
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("❌ [retailer-products-query] 상품 목록 조회 오류:", error);
    throw new Error(`상품 목록 조회 실패: ${error.message}`);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  // 데이터 변환: 익명화된 도매 정보 포함
  const products: RetailerProduct[] = (data ?? []).map((item: any) => {
    const wholesaler = Array.isArray(item.wholesalers)
      ? item.wholesalers[0]
      : item.wholesalers;

    // 주소에서 시/구만 추출 (예: "서울특별시 강남구 테헤란로 123" -> "서울특별시 강남구")
    const addressParts = wholesaler?.address?.split(" ") || [];
    const region =
      addressParts.length >= 2
        ? `${addressParts[0]} ${addressParts[1]}`
        : wholesaler?.address || "";

    // delivery_options에서 새벽 배송 가능 여부 확인
    const deliveryOptions = item.delivery_options || {};
    const dawnDeliveryAvailable =
      deliveryOptions.dawn_delivery_available === true;

    return {
      ...item,
      wholesaler_anonymous_code: wholesaler?.anonymous_code || "Unknown",
      wholesaler_region: region,
      delivery_dawn_available: dawnDeliveryAvailable,
    };
  });

  console.log("✅ [retailer-products-query] 상품 목록 조회 완료", {
    count: products.length,
    total,
    page,
    totalPages,
  });

  return {
    products,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * 소매점용 상품 ID로 단일 상품 조회
 *
 * @param productId 상품 ID
 * @returns 상품 정보 또는 null
 */
export async function getRetailerProductById(
  productId: string
): Promise<RetailerProduct | null> {
  console.log("🔍 [retailer-products-query] 상품 조회 시작", { productId });

  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      wholesalers!inner (
        anonymous_code,
        address
      )
    `
    )
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      console.log("⚠️ [retailer-products-query] 상품 없음", { productId });
      return null;
    }

    console.error("❌ [retailer-products-query] 상품 조회 오류:", error);
    throw new Error(`상품 조회 실패: ${error.message}`);
  }

  // 데이터 변환
  const wholesaler = Array.isArray(data.wholesalers)
    ? data.wholesalers[0]
    : data.wholesalers;

  const addressParts = wholesaler?.address?.split(" ") || [];
  const region =
    addressParts.length >= 2
      ? `${addressParts[0]} ${addressParts[1]}`
      : wholesaler?.address || "";

  const deliveryOptions = data.delivery_options || {};
  const dawnDeliveryAvailable = deliveryOptions.dawn_delivery_available === true;

  const product: RetailerProduct = {
    ...data,
    wholesaler_anonymous_code: wholesaler?.anonymous_code || "Unknown",
    wholesaler_region: region,
    delivery_dawn_available: dawnDeliveryAvailable,
  };

  console.log("✅ [retailer-products-query] 상품 조회 완료", { productId });

  return product;
}

/**
 * 카테고리별 베스트 상품 조회
 *
 * 특정 카테고리의 베스트 상품을 조회합니다.
 * 현재는 최근 생성된 상품 중 상위 3개를 반환합니다.
 * 향후 판매량이나 추천 기준으로 변경 예정.
 *
 * @param category 카테고리명
 * @param limit 조회할 상품 개수 (기본값: 3)
 * @returns 베스트 상품 목록
 */
export async function getBestRetailerProducts(
  category: string,
  limit: number = 3
): Promise<RetailerProduct[]> {
  console.log("🏆 [retailer-products-query] 베스트 상품 조회 시작", {
    category,
    limit,
  });

  const supabase = createClerkSupabaseClient();

  let query = supabase
    .from("products")
    .select(
      `
      *,
      wholesalers!inner (
        anonymous_code,
        address
      )
    `
    )
    .eq("is_active", true);

  // 카테고리 필터 적용
  if (category === "곡물/견과") {
    query = query.or("category.eq.곡물,category.eq.견과류");
  } else {
    query = query.eq("category", category);
  }

  // 현재는 최근 생성된 순서로 정렬 (향후 판매량/추천 기준으로 변경 예정)
  query = query.order("created_at", { ascending: false }).limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("❌ [retailer-products-query] 베스트 상품 조회 오류:", error);
    throw new Error(`베스트 상품 조회 실패: ${error.message}`);
  }

  // 데이터 변환: 익명화된 도매 정보 포함
  const products: RetailerProduct[] = (data ?? []).map((item: any) => {
    const wholesaler = Array.isArray(item.wholesalers)
      ? item.wholesalers[0]
      : item.wholesalers;

    const addressParts = wholesaler?.address?.split(" ") || [];
    const region =
      addressParts.length >= 2
        ? `${addressParts[0]} ${addressParts[1]}`
        : wholesaler?.address || "";

    const deliveryOptions = item.delivery_options || {};
    const dawnDeliveryAvailable =
      deliveryOptions.dawn_delivery_available === true;

    return {
      ...item,
      wholesaler_anonymous_code: wholesaler?.anonymous_code || "Unknown",
      wholesaler_region: region,
      delivery_dawn_available: dawnDeliveryAvailable,
    };
  });

  console.log("✅ [retailer-products-query] 베스트 상품 조회 완료", {
    category,
    count: products.length,
  });

  return products;
}

/**
 * 전체 베스트 상품 조회 (인기순)
 *
 * 모든 카테고리의 베스트 상품을 조회합니다.
 * 현재는 최근 생성된 순서로 정렬하지만, 향후 판매량이나 추천 기준으로 변경 예정.
 *
 * @param limit 조회할 상품 개수 (기본값: 10)
 * @returns 베스트 상품 목록
 */
export async function getAllBestRetailerProducts(
  limit: number = 10
): Promise<RetailerProduct[]> {
  console.log("🏆 [retailer-products-query] 전체 베스트 상품 조회 시작", {
    limit,
  });

  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      wholesalers!inner (
        anonymous_code,
        address
      )
    `
    )
    .eq("is_active", true)
    // 현재는 최근 생성된 순서로 정렬 (향후 판매량/추천 기준으로 변경 예정)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("❌ [retailer-products-query] 전체 베스트 상품 조회 오류:", error);
    throw new Error(`전체 베스트 상품 조회 실패: ${error.message}`);
  }

  // 데이터 변환: 익명화된 도매 정보 포함
  const products: RetailerProduct[] = (data ?? []).map((item: any) => {
    const wholesaler = Array.isArray(item.wholesalers)
      ? item.wholesalers[0]
      : item.wholesalers;

    const addressParts = wholesaler?.address?.split(" ") || [];
    const region =
      addressParts.length >= 2
        ? `${addressParts[0]} ${addressParts[1]}`
        : wholesaler?.address || "";

    const deliveryOptions = item.delivery_options || {};
    const dawnDeliveryAvailable =
      deliveryOptions.dawn_delivery_available === true;

    return {
      ...item,
      wholesaler_anonymous_code: wholesaler?.anonymous_code || "Unknown",
      wholesaler_region: region,
      delivery_dawn_available: dawnDeliveryAvailable,
    };
  });

  console.log("✅ [retailer-products-query] 전체 베스트 상품 조회 완료", {
    count: products.length,
  });

  return products;
}

