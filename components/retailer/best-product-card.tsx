/**
 * @file components/retailer/best-product-card.tsx
 * @description 베스트 상품 카드 컴포넌트
 *
 * 베스트 상품 섹션에서 사용되는 특별한 스타일의 상품 카드입니다.
 * 랭킹 번호 배지와 함께 표시됩니다.
 *
 * 주요 기능:
 * 1. 랭킹 번호 배지 표시
 * 2. 상품 이미지, 이름, 설명, 가격 표시
 * 3. 할인율 표시 (있는 경우)
 * 4. 장바구니 담기 버튼
 * 5. 반응형 레이아웃 (모바일: 가로, 데스크톱: 세로)
 *
 * @dependencies
 * - next/navigation (useRouter)
 * - lucide-react (ShoppingCart)
 * - types/product.ts
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/product";

interface BestProductCardProps {
  /** 상품 정보 */
  product: Product & {
    wholesaler_anonymous_code: string;
    wholesaler_region: string;
    original_price?: number; // 원가 (할인율 계산용)
  };
  /** 랭킹 번호 (1, 2, 3) */
  rank: number;
}

/**
 * 베스트 상품 카드 컴포넌트
 */
export default function BestProductCard({
  product,
  rank,
}: BestProductCardProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    const displayName = product.standardized_name || product.name;
    const quantityToAdd = product.moq || 1;

    console.log("🛒 [베스트 상품] 장바구니 담기 시도:", {
      product_id: product.id,
      product_name: displayName,
      rank,
      quantity: quantityToAdd,
    });

    addToCart({
      product_id: product.id,
      variant_id: null,
      quantity: quantityToAdd,
      unit_price: product.price,
      shipping_fee: product.shipping_fee,
      delivery_method: product.delivery_method,
      wholesaler_id: product.wholesaler_id,
      product_name: displayName,
      anonymous_seller_id: product.wholesaler_anonymous_code,
      seller_region: product.wholesaler_region,
      product_image: product.image_url,
      specification: product.specification,
      moq: product.moq || 1,
      stock_quantity: product.stock_quantity,
    });

    console.log("✅ [베스트 상품] 장바구니 담기 완료, 장바구니 페이지로 이동");
    router.push("/retailer/cart");
  };

  // 할인율 계산 (원가가 있는 경우)
  const discountRate =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
        )
      : null;

  return (
    <Link
      href={`/retailer/products/${product.id}`}
      className="block group"
      aria-label={`${product.standardized_name || product.name} 상세보기`}
    >
      <div className="flex md:flex-col gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
        {/* 이미지 영역 */}
        <div className="relative w-32 md:w-full aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.standardized_name || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-4xl">🍎</span>
          )}
          {/* 랭킹 번호 배지 */}
          <div className="absolute top-0 left-0 bg-gray-900 text-white w-8 h-8 flex items-center justify-center font-bold text-lg shadow-md z-10">
            {rank}
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 flex flex-col justify-center">
          <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
            {product.standardized_name || product.name}
          </h4>
          {product.specification && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-1">
              {product.specification}
            </p>
          )}
          <div className="flex items-center gap-2 mb-3">
            {discountRate && (
              <span className="text-red-500 font-bold">{discountRate}%</span>
            )}
            <span className="font-bold text-lg">
              {product.price.toLocaleString()}원
            </span>
          </div>
          <button
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleAddToCart();
            }}
            disabled={product.stock_quantity === 0}
            className="w-full py-2 border border-gray-200 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            <span>담기</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

