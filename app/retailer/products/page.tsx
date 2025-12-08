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
 * - components/retailer/category-header.tsx
 * - components/retailer/best-products-section.tsx
 * - components/retailer/product-list-header.tsx
 * - components/ui/button.tsx
 *
 * @see {@link PRD.md} - R.SEARCH.01~05 요구사항
 */

import Link from "next/link";
import { getRetailerProducts, getAllBestRetailerProducts } from "@/lib/supabase/queries/retailer-products";
import CategoryHeader from "@/components/retailer/category-header";
import BestProductsSection from "@/components/retailer/best-products-section";
import ProductListHeader from "@/components/retailer/product-list-header";
import ProductCard from "@/components/retailer/product-card";
import BestEventBanner from "@/components/retailer/best-event-banner";
import BestTopThreeCard from "@/components/retailer/best-top-three-card";
import BestListItem from "@/components/retailer/best-list-item";
import ExclusiveEventBanner from "@/components/retailer/exclusive-event-banner";
import ExclusiveCategoryIcons from "@/components/retailer/exclusive-category-icons";
import ExclusiveProductCard from "@/components/retailer/exclusive-product-card";
import SpecialEventBanner from "@/components/retailer/special-event-banner";
import SpecialTimerSection from "@/components/retailer/special-timer-section";
import SpecialProductCard from "@/components/retailer/special-product-card";
import { PremiumFarmBanner, CategoryBanners } from "@/components/retailer/exclusive-mid-banner";
import { Zap, AlertCircle, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    sort?: string;
    exclusive?: string;
    special?: string;
  }>;
}) {
  const params = await searchParams;

  console.log("🔍 [retailer-products-page] 페이지 로드", { params });

  // 베스트 페이지 여부 확인
  const isBestPage = params.sort === "popular";
  
  // 단독관 페이지 여부 확인
  const isExclusivePage = params.exclusive === "true";

  // 특가 페이지 여부 확인
  const isSpecialPage = params.special === "true";

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

  // 베스트 페이지 데이터 조회
  let bestProducts: typeof products = [];
  if (isBestPage) {
    try {
      console.log("🏆 [retailer-products-page] 베스트 상품 조회 시작");
      bestProducts = await getAllBestRetailerProducts(10);
      console.log("✅ [retailer-products-page] 베스트 상품 조회 완료", {
        count: bestProducts.length,
      });
    } catch (error) {
      console.error("❌ [retailer-products-page] 베스트 상품 조회 실패:", error);
      bestProducts = [];
    }
  }

  // 페이지네이션 링크 생성 헬퍼 함수
  const getPaginationLink = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (sortBy !== "created_at") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (isBestPage) params.set("sort", "popular");
    if (isExclusivePage) params.set("exclusive", "true");
    if (isSpecialPage) params.set("special", "true");
    return `/retailer/products?${params.toString()}`;
  };

  // 단독관 페이지 레이아웃
  if (isExclusivePage) {
    // 단독관용 상품 데이터 (전체 상품 사용, 섹션별로 분할)
    const exclusiveProducts = products.slice(0, 8); // 첫 번째 섹션용
    const trendingProducts = products.slice(8, 16); // 두 번째 섹션용
    const giftProducts = products.slice(0, 4); // 선물용 (첫 4개 재사용)

    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 font-sans">
        {/* 상단 히어로 배너 */}
        <ExclusiveEventBanner />

        {/* 섹션 제목 */}
        <h2 className="text-2xl font-bold text-purple-700 mb-6 mt-12">
          💜 팜투비즈 단독 상품
        </h2>

        {/* 카테고리 아이콘 메뉴 */}
        <ExclusiveCategoryIcons />

        {/* 첫 번째 상품 그리드 - 팜투비즈 단독 상품 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {exclusiveProducts.length > 0 ? (
            exclusiveProducts.map((product) => (
              <ExclusiveProductCard key={product.id} product={product} tag="Only" />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              단독 상품이 없습니다.
            </div>
          )}
        </div>

        {/* 중간 이벤트 배너 */}
        <PremiumFarmBanner
          title="팜투비즈 X 명품 농장"
          subtitle="오직 여기서만 만날 수 있는 프리미엄 라인업"
          imageUrl="https://images.unsplash.com/photo-1593301333770-29d3df13178f?auto=format&fit=crop&w=1600&q=80"
        />

        {/* 두 번째 상품 그리드 - 지금 뜨는 단독 상품 */}
        <h3 className="text-xl font-bold text-gray-800 mb-6">👀 지금 뜨는 단독 상품</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <ExclusiveProductCard key={product.id} product={product} tag="단독특가" />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              인기 단독 상품이 없습니다.
            </div>
          )}
        </div>

        {/* 카테고리 배너 */}
        <CategoryBanners />

        {/* 세 번째 상품 그리드 - 선물하기 좋은 패키지 */}
        <h3 className="text-xl font-bold text-gray-800 mb-6">🎁 선물하기 좋은 패키지</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {giftProducts.length > 0 ? (
            giftProducts.map((product) => (
              <ExclusiveProductCard key={product.id} product={product} tag="선물추천" />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              선물용 상품이 없습니다.
            </div>
          )}
        </div>
      </div>
    );
  }

  // 특가(연말특가) 페이지 레이아웃
  if (isSpecialPage) {
    console.log("🔥 [retailer-products-page] 특가 페이지 렌더링", {
      productCount: products.length,
    });

    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
        {/* 상단 이벤트 배너 */}
        <SpecialEventBanner />

        {/* 타임세일 타이머 섹션 */}
        <SpecialTimerSection />

        {/* 실시간 특가 제목 */}
        <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
          <Zap size={24} />
          실시간 랭킹 특가
        </h2>

        {/* 특가 상품 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => <SpecialProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              특가 상품이 없습니다.
            </div>
          )}
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
      </div>
    );
  }

  // 베스트 페이지 레이아웃
  if (isBestPage) {
    const topThree = bestProducts.slice(0, 3);
    const restProducts = bestProducts.slice(3, 10);

    return (
      <div className="relative overflow-hidden min-h-screen bg-[#F8F9FA]">
        {/* 배경 장식 요소 */}
        <div className="absolute -top-20 left-0 w-96 h-96 bg-gradient-to-br from-purple-100/40 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-100/30 to-transparent rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-10 pb-20 relative z-10">
          {/* 이벤트 배너 */}
          <BestEventBanner />

          {/* 실시간 베스트 랭킹 섹션 */}
          <div className="mt-8 md:mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center flex items-center justify-center gap-2">
              <span className="text-2xl md:text-3xl">👑</span>
              <span>실시간 베스트 랭킹</span>
            </h2>

            {/* 1~3위 Top Rank */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16">
                {topThree.map((product, index) => (
                  <BestTopThreeCard
                    key={product.id}
                    product={product}
                    rank={(index + 1) as 1 | 2 | 3}
                  />
                ))}
              </div>
            )}

            {/* 4~10위 List */}
            {restProducts.length > 0 && (
              <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
                {restProducts.map((product, index) => (
                  <BestListItem
                    key={product.id}
                    product={product}
                    rank={index + 4}
                  />
                ))}
              </div>
            )}

            {/* 상품이 없을 때 */}
            {bestProducts.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center py-[4.5rem]">
                <p className="text-gray-500 text-xl md:text-2xl">베스트 상품이 없습니다.</p>
                <p className="text-gray-400 text-sm md:text-base mt-3">
                  곧 인기 상품을 만나보실 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 일반 상품 목록 페이지 레이아웃 (사이드바 제거, 전체 너비 사용)
  return (
    <div className="relative overflow-hidden min-h-screen bg-[#F8F9FA]">
      {/* 배경 장식 요소 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 to-emerald-100/0 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/30 to-indigo-50/0 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-10 pb-20 relative z-10">
        {/* 검색 결과 헤더 (검색어가 있을 때만 표시) */}
        {search && (
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2 flex-wrap">
              <SearchIcon className="text-green-600 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              <span className="text-green-600">&apos;{search}&apos;</span>
              <span className="text-gray-800">검색 결과</span>
              <span className="text-gray-500 text-base md:text-lg font-normal">({total}건)</span>
            </h1>
          </div>
        )}

        {/* 카테고리 헤더 (카테고리가 선택되고 검색어가 없을 때만 표시) */}
        {category && !search && <CategoryHeader category={category} />}

        {/* 카테고리도 검색어도 없을 때 기본 헤더 */}
        {!category && !search && (
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              상품 목록
            </h1>
            <p className="text-base text-gray-600">
              AI가 표준화한 상품명으로 투명한 가격 비교
            </p>
          </div>
        )}

        {/* 베스트 상품 섹션 (카테고리가 선택되고 검색어가 없을 때만 표시) */}
        {category && !search && <BestProductsSection category={category} />}

        {/* 전체 상품 리스트 */}
        <section>
          {/* 정렬 헤더 (검색어가 없을 때만 표시) */}
          {!search && (
            <ProductListHeader
              total={total}
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
            />
          )}

          {products.length > 0 ? (
            <>
              {/* 상품 그리드 - 모바일 2열, 태블릿 3열, 데스크톱 4열 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8 md:mt-12">
                  {page > 1 && (
                    <Link
                      href={getPaginationLink(page - 1)}
                      className="px-4 md:px-6 py-2 md:py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
                    >
                      이전
                    </Link>
                  )}
                  <span className="px-4 md:px-6 py-2 md:py-3 text-gray-600 text-sm md:text-base">
                    {page} / {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={getPaginationLink(page + 1)}
                      className="px-4 md:px-6 py-2 md:py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
                    >
                      다음
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            // 검색 결과 없음 UI (디자인 정확히 반영 + 모바일 반응형)
            <div className="max-w-7xl mx-auto mt-4 md:mt-8">
              <div className="bg-white rounded-xl md:rounded-2xl p-8 md:p-16 lg:p-20 text-center shadow-sm">
                {/* 아이콘 - 모바일/데스크톱 반응형 */}
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                </div>
                
                {/* 제목 - 모바일/데스크톱 반응형 */}
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                  검색 결과가 없습니다
                </h3>
                
                {/* 설명 - 모바일/데스크톱 반응형 */}
                <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-6 md:mb-8">
                  다른 검색어로 다시 시도해보세요.
                </p>
                
                {/* 버튼 - 모바일/데스크톱 반응형 */}
                <Link href="/retailer/dashboard">
                  <Button 
                    variant="outline" 
                    className="px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-medium border-gray-300 hover:bg-gray-50"
                  >
                    홈으로 돌아가기
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

