/**
 * @file components/retailer/product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 상품 목록에서 사용되는 상품 카드 컴포넌트입니다.
 * 장바구니 담기 버튼 클릭 시 상품 상세 페이지로 이동합니다.
 * 실제 장바구니 추가는 상세 페이지에서 수량 선택 후 진행됩니다.
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product & {
    wholesaler_anonymous_code: string;
    wholesaler_region: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleAddToCart = () => {
    console.log("🛒 [상품목록] 상세 페이지로 이동:", {
      product_id: product.id,
      product_name: product.standardized_name || product.name,
    });

    // 상품 상세 페이지로 이동 (장바구니 추가는 상세 페이지에서 수량 선택 후 진행)
    router.push(`/retailer/products/${product.id}`);
  };

  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      {/* 이미지 영역 */}
      <Link href={`/retailer/products/${product.id}`}>
        <div className="relative aspect-square w-full overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.standardized_name || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-base">이미지 없음</span>
            </div>
          )}
        </div>
      </Link>

      {/* 상품 정보 */}
      <div className="flex flex-col flex-1 p-4 md:p-6 gap-3 md:gap-[1.125rem]">
        {/* 판매자 정보 (익명화) */}
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {product.wholesaler_anonymous_code} · {product.wholesaler_region}
        </p>

        {/* 상품명 (AI 표준화된 이름 우선 표시) */}
        <Link href={`/retailer/products/${product.id}`}>
          <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-primary transition-colors">
            {product.standardized_name || product.name}
          </h3>
        </Link>

        {/* 규격 */}
        {product.specification && (
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {product.specification}
          </p>
        )}

        {/* 가격 및 재고 */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">
              {product.price.toLocaleString()}원
            </p>
            {product.stock_quantity > 0 && (
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                재고: {product.stock_quantity}개
              </p>
            )}
            {product.stock_quantity === 0 && (
              <p className="text-xs md:text-sm text-red-600 dark:text-red-400">
                품절
              </p>
            )}
          </div>
          {product.moq > 1 && (
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              최소 {product.moq}개
            </p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
          className="flex w-full items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-green-600 dark:bg-green-600 text-white rounded-lg text-sm md:text-base font-medium hover:bg-green-700 dark:hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          <span>장바구니 담기</span>
        </button>
      </div>
    </div>
  );
}
