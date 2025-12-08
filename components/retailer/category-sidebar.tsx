/**
 * @file components/retailer/category-sidebar.tsx
 * @description 카테고리 사이드바 컴포넌트
 *
 * 좌측에 카테고리 목록과 필터 옵션을 표시하는 사이드바입니다.
 * 데스크톱에서만 표시되며, 현재 선택된 카테고리를 하이라이트합니다.
 *
 * 주요 기능:
 * 1. 카테고리 목록 표시 (채소, 과일, 수산물, 곡물/견과, 기타)
 * 2. 현재 선택된 카테고리 하이라이트
 * 3. 필터 옵션 (혜택상품, 신상품, 무료배송)
 *
 * @dependencies
 * - next/navigation (Link, useSearchParams)
 * - lucide-react (ChevronRight)
 */

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface CategorySidebarProps {
  /** 현재 선택된 카테고리 */
  currentCategory?: string;
}

/**
 * 카테고리 사이드바 컴포넌트
 */
export default function CategorySidebar({
  currentCategory,
}: CategorySidebarProps) {
  const searchParams = useSearchParams();
  
  // 필터 상태 관리
  const [benefitFilter, setBenefitFilter] = useState(false);
  const [newProductFilter, setNewProductFilter] = useState(false);
  const [freeShippingFilter, setFreeShippingFilter] = useState(false);

  // 카테고리 목록
  const categories = [
    { value: "채소", label: "채소" },
    { value: "과일", label: "과일" },
    { value: "수산물", label: "수산물" },
    { value: "곡물/견과", label: "곡물/견과" },
    { value: "기타", label: "기타" },
  ];

  // 카테고리 링크 생성
  const getCategoryLink = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    // 페이지는 1로 리셋
    params.delete("page");
    return `/retailer/products?${params.toString()}`;
  };

  return (
    <aside className="w-full md:w-48 lg:w-56 flex-shrink-0 hidden md:block">
      <div className="sticky top-24">
        {/* 카테고리 섹션 */}
        <div>
          <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-200">
            카테고리
          </h2>
          <ul className="space-y-2">
            {categories.map((category) => {
              const isActive = currentCategory === category.value;
              return (
                <li key={category.value}>
                  <Link
                    href={getCategoryLink(category.value)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium flex justify-between items-center transition-colors ${
                      isActive
                        ? "bg-green-50 text-green-600 shadow-sm translate-x-1 font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{category.label}</span>
                    {isActive && <ChevronRight size={16} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 필터 섹션 */}
        <div className="mt-10">
          <h3 className="text-sm font-bold mb-4 text-gray-800">필터</h3>
          <div className="space-y-3">
            {/* 혜택상품 필터 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={benefitFilter}
                onChange={(e) => {
                  console.log("🎁 [카테고리 사이드바] 혜택상품 필터:", e.target.checked);
                  setBenefitFilter(e.target.checked);
                  // TODO: 필터 적용 로직 추가
                }}
                className="w-5 h-5 rounded border border-gray-300 bg-white text-green-600 focus:ring-green-500 focus:ring-2"
              />
              <span className="text-sm text-gray-600">혜택상품</span>
            </label>

            {/* 신상품 필터 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newProductFilter}
                onChange={(e) => {
                  console.log("🆕 [카테고리 사이드바] 신상품 필터:", e.target.checked);
                  setNewProductFilter(e.target.checked);
                  // TODO: 필터 적용 로직 추가
                }}
                className="w-5 h-5 rounded border border-gray-300 bg-white text-green-600 focus:ring-green-500 focus:ring-2"
              />
              <span className="text-sm text-gray-600">신상품</span>
            </label>

            {/* 무료배송 필터 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={freeShippingFilter}
                onChange={(e) => {
                  console.log("🚚 [카테고리 사이드바] 무료배송 필터:", e.target.checked);
                  setFreeShippingFilter(e.target.checked);
                  // TODO: 필터 적용 로직 추가
                }}
                className="w-5 h-5 rounded border border-gray-300 bg-white text-green-600 focus:ring-green-500 focus:ring-2"
              />
              <span className="text-sm text-gray-600">무료배송</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}


