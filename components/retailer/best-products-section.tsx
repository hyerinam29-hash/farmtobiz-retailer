/**
 * @file components/retailer/best-products-section.tsx
 * @description 베스트 상품 섹션 컴포넌트
 *
 * 카테고리별 베스트 상품을 표시하는 섹션입니다.
 * 랭킹 1, 2, 3위 상품을 그리드 레이아웃으로 표시합니다.
 *
 * 주요 기능:
 * 1. 카테고리별 베스트 상품 조회
 * 2. 랭킹 1, 2, 3위 상품 표시
 * 3. 반응형 그리드 레이아웃
 *
 * @dependencies
 * - lib/supabase/queries/retailer-products.ts (getBestRetailerProducts)
 * - components/retailer/best-product-card.tsx
 */

import { getBestRetailerProducts } from "@/lib/supabase/queries/retailer-products";
import BestProductCard from "./best-product-card";

interface BestProductsSectionProps {
  /** 카테고리명 */
  category: string;
}

/**
 * 베스트 상품 섹션 컴포넌트
 */
export default async function BestProductsSection({
  category,
}: BestProductsSectionProps) {
  console.log("🏆 [베스트 상품 섹션] 베스트 상품 조회 시작", { category });

  let bestProducts;
  try {
    bestProducts = await getBestRetailerProducts(category, 3);
  } catch (error) {
    console.error("❌ [베스트 상품 섹션] 베스트 상품 조회 실패:", error);
    // 에러 발생 시 빈 배열 반환
    bestProducts = [];
  }

  // 베스트 상품이 없으면 섹션을 표시하지 않음
  if (bestProducts.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-green-600">BEST</span> {category} 랭킹 🏆
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bestProducts.map((product, index) => (
          <BestProductCard
            key={product.id}
            product={product}
            rank={index + 1}
          />
        ))}
      </div>
    </section>
  );
}


