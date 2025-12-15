/**
 * @file components/retailer/product-list-header.tsx
 * @description 상품 리스트 헤더 컴포넌트
 *
 * 전체 상품 리스트 상단에 표시되는 헤더입니다.
 * 총 상품 개수와 정렬 옵션을 제공합니다.
 *
 * 주요 기능:
 * 1. 총 상품 개수 표시
 * 2. 정렬 옵션 버튼 (추천순, 신상품순, 판매량순, 낮은가격순)
 * 3. 선택된 정렬 옵션 하이라이트
 *
 * @dependencies
 * - next/navigation (useRouter, useSearchParams)
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface ProductListHeaderProps {
  /** 총 상품 개수 */
  total: number;
  /** 현재 정렬 기준 */
  currentSortBy?: string;
  /** 현재 정렬 순서 */
  currentSortOrder?: string;
}

/**
 * 정렬 옵션 목록
 */
const sortOptions = [
  { value: "recommended", label: "추천순" },
  { value: "newest", label: "신상품순" },
  { value: "sales", label: "판매량순" },
  { value: "price-asc", label: "낮은가격순" },
] as const;

/**
 * 정렬 옵션을 데이터베이스 쿼리 파라미터로 변환
 */
function getSortParams(sortValue: string): {
  sortBy: "created_at" | "price" | "standardized_name" | "sales_count" | "recommended_score";
  sortOrder: "asc" | "desc";
} {
  switch (sortValue) {
    case "recommended":
      // 추천순: 판매량 기반 랭킹 (판매량 + 최근성 점수)
      return { sortBy: "recommended_score", sortOrder: "desc" };
    case "newest":
      // 신상품순: 최근 생성된 순서
      return { sortBy: "created_at", sortOrder: "desc" };
    case "sales":
      // 판매량순: 구매량에 따라 정렬
      return { sortBy: "sales_count", sortOrder: "desc" };
    case "benefit":
      // 혜택순: 가격 낮은 순 (할인율 높은 순으로 변경 예정)
      return { sortBy: "price", sortOrder: "asc" };
    case "price-asc":
      // 낮은가격순
      return { sortBy: "price", sortOrder: "asc" };
    default:
      return { sortBy: "recommended_score", sortOrder: "desc" };
  }
}

/**
 * 현재 정렬 옵션 값 계산
 */
function getCurrentSortValue(
  sortBy?: string,
  sortOrder?: string
): string {
  if (!sortBy) return "recommended";

  if (sortBy === "recommended_score" && sortOrder === "desc") {
    return "recommended";
  }
  if (sortBy === "created_at" && sortOrder === "desc") {
    return "newest";
  }
  if (sortBy === "sales_count" && sortOrder === "desc") {
    return "sales";
  }
  if (sortBy === "price" && sortOrder === "asc") {
    return "price-asc";
  }

  return "recommended";
}

/**
 * 상품 리스트 헤더 컴포넌트
 */
export default function ProductListHeader({
  total,
  currentSortBy,
  currentSortOrder,
}: ProductListHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSortValue = getCurrentSortValue(currentSortBy, currentSortOrder);

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (sortValue: string) => {
    console.log("📊 [상품 리스트 헤더] 정렬 옵션 변경:", sortValue);

    const { sortBy, sortOrder } = getSortParams(sortValue);

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      // 페이지는 1로 리셋
      params.delete("page");

      router.push(`/retailer/products?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      {/* 총 상품 개수 */}
      <div className="text-base font-bold text-gray-600 dark:text-gray-400">
        총 <span className="text-gray-900 dark:text-white">{total.toLocaleString()}</span>개
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-4 text-base font-bold text-gray-500 dark:text-gray-400">
        {sortOptions.map((option, index) => {
          const isActive = currentSortValue === option.value;
          return (
            <div key={option.value} className="flex items-center gap-4">
              {index > 0 && (
                <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
              )}
              <button
                onClick={() => handleSortChange(option.value)}
                disabled={isPending}
                className={`hover:text-gray-800 dark:hover:text-gray-200 transition-colors ${
                  isActive ? "text-gray-900 dark:text-white" : ""
                }`}
              >
                {option.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


