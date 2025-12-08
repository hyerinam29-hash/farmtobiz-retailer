/**
 * @file components/retailer/best-list-item.tsx
 * @description 베스트 4-10위 상품 리스트 아이템 컴포넌트
 *
 * 베스트 페이지에서 4위부터 10위까지의 상품을 가로형 리스트로 표시합니다.
 * 장바구니 버튼이 포함됩니다.
 */

"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";

interface BestListItemProps {
  product: RetailerProduct;
  rank: number;
}

export default function BestListItem({ product, rank }: BestListItemProps) {
  const router = useRouter();

  const handleAddToCart = () => {
    console.log("🛒 [베스트페이지] 상세 페이지로 이동:", {
      product_id: product.id,
      product_name: product.standardized_name || product.name,
      rank,
    });

    // 상품 상세 페이지로 이동
    router.push(`/retailer/products/${product.id}`);
  };

  return (
    <div className="flex items-center gap-4 md:gap-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
      {/* 순위 번호 */}
      <div className="font-black text-xl md:text-2xl text-gray-300 w-6 md:w-8 text-center flex-shrink-0">
        {rank}
      </div>

      {/* 상품 이미지 */}
      <div className="w-20 h-28 md:w-24 md:h-32 lg:w-32 lg:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.standardized_name || product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl">
            🥬
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1 group-hover:text-purple-700 transition-colors line-clamp-1">
          {product.standardized_name || product.name}
        </h3>
        <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3 line-clamp-2">
          {product.specification || "인기 상품"}
        </p>
        <div className="font-black text-lg md:text-xl text-gray-900">
          {product.price.toLocaleString()}원
        </div>
      </div>

      {/* 장바구니 버튼 */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock_quantity === 0}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-purple-600 hover:text-purple-600 transition-colors bg-white shadow-sm flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="장바구니 담기"
      >
        <ShoppingCart size={18} className="md:w-5 md:h-5" />
      </button>
    </div>
  );
}

