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
 * - components/retailer/category-sidebar.tsx
 * - components/retailer/category-header.tsx
 * - components/retailer/sub-category-tabs.tsx
 * - components/retailer/best-products-section.tsx
 * - components/retailer/product-list-header.tsx
 *
 * @see {@link PRD.md} - R.SEARCH.01~05 요구사항
 */

import Link from "next/link";
import { getRetailerProducts } from "@/lib/supabase/queries/retailer-products";
import CategorySidebar from "@/components/retailer/category-sidebar";
import CategoryHeader from "@/components/retailer/category-header";
import SubCategoryTabs from "@/components/retailer/sub-category-tabs";
import BestProductsSection from "@/components/retailer/best-products-section";
import ProductListHeader from "@/components/retailer/product-list-header";
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

  // 페이지네이션 링크 생성 헬퍼 함수
  const getPaginationLink = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (sortBy !== "created_at") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    return `/retailer/products?${params.toString()}`;
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#F8F9FA]">
      {/* 배경 장식 요소 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 to-emerald-100/0 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/30 to-indigo-50/0 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 좌측 사이드바 */}
          <CategorySidebar currentCategory={category} />

          {/* 우측 메인 컨텐츠 영역 */}
          <main className="flex-1 min-w-0">
            {/* 카테고리 헤더 (카테고리가 선택된 경우만 표시) */}
            {category && (
              <>
                <CategoryHeader category={category} />
                <SubCategoryTabs category={category} />
              </>
            )}

            {/* 카테고리가 없을 때 기본 헤더 */}
            {!category && (
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  상품 목록
                </h1>
                <p className="text-base text-gray-600">
                  AI가 표준화한 상품명으로 투명한 가격 비교
                </p>
              </div>
            )}

            {/* 베스트 상품 섹션 (카테고리가 선택된 경우만 표시) */}
            {category && <BestProductsSection category={category} />}

            {/* 전체 상품 리스트 */}
            <section>
              <ProductListHeader
                total={total}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
              />

              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-12">
                      {page > 1 && (
                        <Link
                          href={getPaginationLink(page - 1)}
                          className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                        >
                          이전
                        </Link>
                      )}
                      <span className="px-6 py-3 text-gray-600">
                        {page} / {totalPages}
                      </span>
                      {page < totalPages && (
                        <Link
                          href={getPaginationLink(page + 1)}
                          className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                        >
                          다음
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-[4.5rem]">
                  <p className="text-gray-500 text-2xl">상품이 없습니다.</p>
                  <p className="text-gray-400 text-base mt-3">
                    다른 검색어나 필터를 시도해보세요.
                  </p>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

