/**
 * @file components/retailer/sub-category-tabs.tsx
 * @description 서브 카테고리 탭 컴포넌트
 *
 * 카테고리별 서브 카테고리 필터링을 위한 탭 컴포넌트입니다.
 * 예: 과일 카테고리의 경우 "전체보기", "제철과일", "국산과일", "수입과일", "냉동/건과일"
 *
 * 주요 기능:
 * 1. 서브 카테고리 탭 표시
 * 2. 선택된 탭 하이라이트
 * 3. 탭 클릭 시 URL 쿼리 파라미터 업데이트
 *
 * @dependencies
 * - next/navigation (useRouter, useSearchParams)
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface SubCategoryTabsProps {
  /** 현재 카테고리 (예: "과일") */
  category: string;
}

/**
 * 카테고리별 서브 카테고리 목록
 */
const subCategoriesByCategory: Record<string, Array<{ value: string; label: string }>> = {
  과일: [
    { value: "all", label: "전체보기" },
    { value: "seasonal", label: "제철과일" },
    { value: "domestic", label: "국산과일" },
    { value: "imported", label: "수입과일" },
    { value: "frozen-dried", label: "냉동/건과일" },
  ],
  채소: [
    { value: "all", label: "전체보기" },
    { value: "leafy", label: "잎채소" },
    { value: "root", label: "뿌리채소" },
    { value: "fruit-vegetable", label: "과채류" },
  ],
  수산물: [
    { value: "all", label: "전체보기" },
    { value: "fish", label: "생선" },
    { value: "shellfish", label: "조개류" },
    { value: "crustacean", label: "갑각류" },
  ],
  "곡물/견과류": [
    { value: "all", label: "전체보기" },
    { value: "grain", label: "곡물" },
    { value: "nut", label: "견과류" },
  ],
};

/**
 * 서브 카테고리 탭 컴포넌트
 */
export default function SubCategoryTabs({ category }: SubCategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 현재 선택된 서브 카테고리
  const currentSubCategory = searchParams.get("subCategory") || "all";

  // 현재 카테고리에 해당하는 서브 카테고리 목록 가져오기
  const subCategories = subCategoriesByCategory[category] || [
    { value: "all", label: "전체보기" },
  ];

  // 서브 카테고리 변경 핸들러
  const handleSubCategoryChange = (subCategory: string) => {
    console.log("📑 [서브 카테고리 탭] 서브 카테고리 변경:", {
      category,
      subCategory,
    });

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (subCategory === "all") {
        params.delete("subCategory");
      } else {
        params.set("subCategory", subCategory);
      }

      // 페이지는 1로 리셋
      params.delete("page");

      router.push(`/retailer/products?${params.toString()}`);
    });
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
      {subCategories.map((subCategory) => {
        const isActive = currentSubCategory === subCategory.value;
        return (
          <button
            key={subCategory.value}
            onClick={() => handleSubCategoryChange(subCategory.value)}
            disabled={isPending}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white border-gray-900 font-bold"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {subCategory.label}
          </button>
        );
      })}
    </div>
  );
}


