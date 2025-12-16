/**
 * @file components/retailer/product-recommendation-section.tsx
 * @description 추천 상품 섹션 컴포넌트 (클라이언트 컴포넌트)
 *
 * "이 상품 어때요?" 섹션을 렌더링하는 클라이언트 컴포넌트입니다.
 * 서버 액션을 통해 과일 카테고리에서 인기 상품 4개를 조회하여 표시합니다.
 *
 * @dependencies
 * - lib/supabase/queries/retailer-products (getRetailerProducts)
 * - components/retailer/product-recommendation-card
 */

"use client";

import { useEffect, useState } from "react";
import { getRecommendedProducts } from "@/actions/retailer/get-recommended-products";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";
import ProductRecommendationCard from "./product-recommendation-card";

/**
 * 상태 라벨 배열 (4개 상품에 순서대로 적용)
 */
const STATUS_LABELS: Array<"인기" | "신상품" | "할인" | "추천"> = [
  "인기",
  "신상품",
  "인기",
  "추천",
];

export default function ProductRecommendationSection() {
  const [products, setProducts] = useState<RetailerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      console.log("🔍 [추천상품섹션] 과일 상품 조회 시작");

      try {
        setLoading(true);
        setError(null);

        // 서버 액션을 통해 과일 카테고리에서 상품 4개 조회
        const result = await getRecommendedProducts();

        if (!result.success) {
          throw new Error(result.error || "상품을 불러오는 중 오류가 발생했습니다.");
        }

        console.log("✅ [추천상품섹션] 과일 상품 조회 완료:", {
          count: result.products?.length || 0,
        });

        setProducts(result.products || []);
      } catch (err) {
        console.error("❌ [추천상품섹션] 상품 조회 오류:", err);
        setError(err instanceof Error ? err.message : "상품을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section className="relative pt-8">
      <div className="text-center mb-10">
        <div className="inline-block mb-3 -translate-y-[0.5cm]">
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
            POPULAR
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-200">
          이 상품 어때요?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-200">가장 인기 있는 상품만 모아봤어요</p>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md p-8 text-center transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">상품을 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md p-8 text-center transition-colors duration-200">
          <p className="text-red-500 dark:text-red-400 transition-colors duration-200">{error}</p>
        </div>
      )}

      {/* 상품 카드 그리드 */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductRecommendationCard
              key={product.id}
              product={product}
              statusLabel={STATUS_LABELS[index % STATUS_LABELS.length]}
            />
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && !error && products.length === 0 && (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md p-8 text-center transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">현재 추천할 상품이 없습니다.</p>
        </div>
      )}
    </section>
  );
}
