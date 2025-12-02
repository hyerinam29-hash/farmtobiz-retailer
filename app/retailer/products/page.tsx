/**
 * @file app/retailer/products/page.tsx
 * @description 소매점 상품 목록 페이지
 *
 * 주요 기능:
 * 1. 상품 검색 (R.SEARCH.01)
 * 2. AI 표준화된 상품명 표시 (R.SEARCH.02)
 * 3. 카테고리 필터링
 * 4. 도매 정보 익명화 (R.SEARCH.04)
 * 5. 장바구니 추가 (R.SEARCH.05)
 *
 * @dependencies
 * - lib/supabase/queries/retailer-products.ts
 * - app/retailer/layout.tsx (레이아웃)
 *
 * @see {@link PRD.md} - R.SEARCH.01~05 요구사항
 */

import Link from "next/link";
import { getRetailerProducts } from "@/lib/supabase/queries/retailer-products";
import { ProductSearchClient } from "@/components/retailer/product-search-client";
import ProductCard from "@/components/retailer/product-card";

/**
 * 소매점 상품 목록 페이지 (서버 컴포넌트)
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const params = await searchParams;

  console.log("🔍 [retailer-products-page] 페이지 로드", { params });

  // 쿼리 파라미터 파싱
  const page = parseInt(params.page ?? "1", 10);
  const category = params.category;
  const search = params.search;
  const sortBy =
    (params.sortBy as "created_at" | "price" | "standardized_name") ??
    "created_at";
  const sortOrder = (params.sortOrder as "asc" | "desc") ?? "desc";

  // 필터 구성
  const filter: {
    category?: string;
    search?: string;
  } = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.search = search;
  }

  // 상품 목록 조회
  let productsData;
  try {
    productsData = await getRetailerProducts({
      page,
      pageSize: 12,
      sortBy,
      sortOrder,
      filter,
    });
  } catch (error) {
    console.error("❌ [retailer-products-page] 상품 목록 조회 실패:", error);
    // 에러 발생 시 빈 데이터 반환
    productsData = {
      products: [],
      total: 0,
      page: 1,
      pageSize: 12,
      totalPages: 0,
    };
  }

  const { products, total, totalPages } = productsData;

  return (
    <div className="max-w-[120rem] mx-auto px-6 sm:px-9 lg:px-12 py-9 md:py-12">
      {/* 헤더 섹션 */}
      <div className="mb-9 md:mb-12">
        <h1 className="text-3xl md:text-[2.25rem] font-bold text-gray-900 dark:text-gray-100">
          상품 목록
        </h1>
        <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-400">
          AI가 표준화한 상품명으로 투명한 가격 비교
        </p>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-500">
          총 {total.toLocaleString()}개의 상품이 있습니다.
        </p>
      </div>

      {/* 검색 및 필터 영역 (클라이언트 컴포넌트) */}
      <ProductSearchClient
        initialSearch={search}
        initialCategory={category}
        initialSortBy={sortBy}
        initialSortOrder={sortOrder}
      />

      {/* 상품 그리드 */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-9">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              {page > 1 && (
                <Link
                  href={`/retailer/products?page=${page - 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                  className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  이전
                </Link>
              )}
              <span className="px-6 py-3 text-gray-600 dark:text-gray-400">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/retailer/products?page=${page + 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                  className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  다음
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-[4.5rem]">
          <p className="text-gray-500 dark:text-gray-400 text-2xl">
            상품이 없습니다.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-base mt-3">
            다른 검색어나 필터를 시도해보세요.
          </p>
        </div>
      )}
    </div>
  );
}

