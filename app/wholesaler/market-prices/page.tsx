/**
 * @file app/wholesaler/market-prices/page.tsx
 * @description 시세 조회 페이지
 *
 * 실시간 농수산물 경매가격을 조회하는 페이지입니다.
 * 공공데이터포털 API를 사용하여 온라인 도매시장 거래정보를 조회합니다.
 *
 * 주요 기능:
 * 1. 실시간 시세 조회
 * 2. 상품별 시세 검색 (대분류/중분류/소분류 코드 기반)
 * 3. 시세 차트 표시
 * 4. 시세 테이블 표시
 *
 * @dependencies
 * - components/common/PageHeader.tsx
 * - components/wholesaler/MarketPrices/PriceFilter.tsx
 * - components/wholesaler/MarketPrices/PriceTable.tsx
 * - components/wholesaler/MarketPrices/PriceTrendChart.tsx
 * - hooks/use-market-prices.ts
 */

"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import PriceFilter, { type PriceFilterParams } from "@/components/wholesaler/MarketPrices/PriceFilter";
import PriceTable from "@/components/wholesaler/MarketPrices/PriceTable";
import PriceTrendChart from "@/components/wholesaler/MarketPrices/PriceTrendChart";
import { useMarketPrices, usePriceTrend } from "@/hooks/use-market-prices";
import { AlertCircle } from "lucide-react";

export default function MarketPricesPage() {
  const [searchParams, setSearchParams] = useState<PriceFilterParams>({});
  const [isSearching, setIsSearching] = useState(false);

  // 시세 조회
  const {
    data: prices,
    isLoading: isLoadingPrices,
    error: pricesError,
    refetch: refetchPrices,
  } = useMarketPrices(searchParams);

  // 시세 추이 조회 (대분류 코드가 있을 때만)
  const {
    data: trendData,
    isLoading: isLoadingTrend,
    error: trendError,
  } = usePriceTrend(
    searchParams.lclsfCd || "",
    searchParams.mclsfCd,
    searchParams.sclsfCd,
    7
  );

  const handleSearch = (params: PriceFilterParams) => {
    setIsSearching(true);
    setSearchParams(params);
    // refetch는 useMarketPrices 훅에서 자동으로 처리됨
    setTimeout(() => setIsSearching(false), 500);
  };

  const isLoading = isLoadingPrices || isLoadingTrend || isSearching;
  const hasError = pricesError || trendError;

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <PageHeader
        title="시세 조회"
        description="실시간 농수산물 경매가격을 확인하세요."
      />

      {/* 에러 표시 */}
      {hasError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <div className="flex gap-2">
            <AlertCircle className="size-5 text-destructive" />
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-destructive">시세 조회 오류</h3>
              <p className="text-sm text-destructive/80">
                {pricesError
                  ? pricesError.message
                  : trendError
                    ? trendError.message
                    : "시세를 조회하는 중 오류가 발생했습니다."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 검색 필터 (왼쪽) */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card">
            <PriceFilter onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* 시세 테이블 및 차트 (오른쪽) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 시세 테이블 */}
          <div className="rounded-lg border bg-card">
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-semibold mb-4">시세 목록</h2>
              <PriceTable data={prices || []} isLoading={isLoading} />
            </div>
          </div>

          {/* 시세 추이 차트 */}
          {searchParams.lclsfCd && (
            <div className="rounded-lg border bg-card">
              <PriceTrendChart data={trendData || []} isLoading={isLoadingTrend} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
