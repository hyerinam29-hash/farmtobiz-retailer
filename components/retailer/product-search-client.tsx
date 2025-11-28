/**
 * @file components/retailer/product-search-client.tsx
 * @description 소매점 상품 검색 클라이언트 컴포넌트
 *
 * 검색 및 필터 기능을 제공하는 클라이언트 컴포넌트입니다.
 * R.SEARCH.01 (Smart Search), R.SEARCH.03 (배송 필터링) 구현
 *
 * @dependencies
 * - next/navigation
 * - lucide-react
 */

"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface ProductSearchClientProps {
  initialSearch?: string;
  initialCategory?: string;
  initialSortBy?: string;
  initialSortOrder?: string;
}

/**
 * 상품 검색 클라이언트 컴포넌트
 */
export function ProductSearchClient({
  initialSearch = "",
  initialCategory,
  initialSortBy = "created_at",
  initialSortOrder = "desc",
}: ProductSearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  // initialSearch prop이 변경될 때 동기화 (페이지 리로드 시)
  useEffect(() => {
    console.log("🔄 [검색창] initialSearch 동기화:", initialSearch);
    setSearch(initialSearch || "");
  }, [initialSearch]);

  // 검색어 입력 (로컬 상태만 업데이트)
  const handleSearchInput = (value: string) => {
    console.log("🔍 [검색창] 검색어 입력:", value);
    setSearch(value);
  };

  // 검색 실행 (URL 업데이트)
  const executeSearch = () => {
    // 클로저 문제 방지를 위해 현재 search 상태를 직접 참조
    const currentSearch = search;
    console.log("✅ [검색창] 검색 실행:", currentSearch);
    updateURL({ search: currentSearch });
  };

  // 검색어 초기화
  const clearSearch = () => {
    console.log("🗑️ [검색창] 검색어 초기화");
    setSearch("");
    updateURL({ search: "" });
  };

  // 필터 업데이트
  const updateURL = (updates: {
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      // 검색어
      if (updates.search !== undefined) {
        if (updates.search) {
          params.set("search", updates.search);
        } else {
          params.delete("search");
        }
      }

      // 카테고리
      if (updates.category !== undefined) {
        if (updates.category && updates.category !== "all") {
          params.set("category", updates.category);
        } else {
          params.delete("category");
        }
      }

      // 정렬
      if (updates.sortBy !== undefined) {
        params.set("sortBy", updates.sortBy);
      }
      if (updates.sortOrder !== undefined) {
        params.set("sortOrder", updates.sortOrder);
      }

      // 페이지는 항상 1로 리셋
      params.delete("page");

      router.push(`/retailer/products?${params.toString()}`);
    });
  };

  // 카테고리 목록
  const categories = [
    { value: "all", label: "전체" },
    { value: "과일", label: "과일" },
    { value: "채소", label: "채소" },
    { value: "곡물", label: "곡물" },
    { value: "견과류", label: "견과류" },
    { value: "수산물", label: "수산물" },
    { value: "기타", label: "기타" },
  ];

  return (
    <div className="space-y-6 mb-9">
      {/* 검색 및 필터 영역 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* 검색창 */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-[1.125rem] top-1/2 -translate-y-1/2 w-[1.875rem] h-[1.875rem] text-gray-400 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="상품명, 카테고리 검색 (Cmd+K)"
              value={search}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={(e) => {
                // Enter 키로 검색 실행
                if (e.key === "Enter") {
                  e.preventDefault();
                  executeSearch();
                }
                // Cmd+K 또는 Ctrl+K는 Command Palette에서 처리됨
              }}
              className="w-full min-w-0 pl-[3.75rem] pr-[3.75rem] py-[1.125rem] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-base"
            />
            {/* X 버튼: 항상 렌더링하여 레이아웃 시프트 방지 - 크기 완전 고정 */}
            <div className="absolute right-[1.125rem] top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
              <button
                type="button"
                onClick={clearSearch}
                className={`w-full h-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity duration-200 ${
                  search
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
                aria-label="검색어 지우기"
                tabIndex={search ? 0 : -1}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* 정렬 선택 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-");
              setSortBy(newSortBy);
              setSortOrder(newSortOrder as "asc" | "desc");
              updateURL({ sortBy: newSortBy, sortOrder: newSortOrder as "asc" | "desc" });
            }}
            className="px-6 py-[1.125rem] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary text-base whitespace-nowrap"
            disabled={isPending}
          >
            <option value="created_at-desc">최신순</option>
            <option value="price-asc">낮은 가격순</option>
            <option value="price-desc">높은 가격순</option>
            <option value="standardized_name-asc">이름순</option>
          </select>
        </div>
      </div>

      {/* 필터 칩 */}
      <div className="flex flex-wrap gap-3">
        {/* 카테고리 필터 */}
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => {
              setSelectedCategory(category.value);
              updateURL({
                category: category.value === "all" ? undefined : category.value,
              });
            }}
            className={`px-6 py-3 rounded-full text-base font-medium whitespace-nowrap transition-colors w-[5.5rem] text-center flex-shrink-0 ${
              selectedCategory === category.value
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            disabled={isPending}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

