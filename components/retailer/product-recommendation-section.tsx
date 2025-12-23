/**
 * @file components/retailer/product-recommendation-section.tsx
 * @description 추천 상품 섹션 컴포넌트 (서버 컴포넌트)
 *
 * "이 상품 어때요?" 섹션을 렌더링하는 서버 컴포넌트입니다.
 * 서버에서 페칭된 상품 데이터를 props로 받아 표시합니다.
 *
 * @dependencies
 * - components/retailer/product-recommendation-card
 */

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

interface ProductRecommendationSectionProps {
  products: RetailerProduct[];
}

export default function ProductRecommendationSection({
  products,
}: ProductRecommendationSectionProps) {
  console.log("🔍 [추천상품섹션-서버] 상품 렌더링:", {
    count: products.length,
  });

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
        <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-200">
          가장 인기 있는 상품만 모아봤어요
        </p>
      </div>

      {/* 상품 카드 그리드 */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductRecommendationCard
              key={product.id}
              product={product}
              statusLabel={STATUS_LABELS[index % STATUS_LABELS.length]}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md p-8 text-center transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
            현재 추천할 상품이 없습니다.
          </p>
        </div>
      )}
    </section>
  );
}
