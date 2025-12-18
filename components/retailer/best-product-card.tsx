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
import { useCartOptions } from "@/hooks/use-cart-options";
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
  const { retailerId, supabaseClient, isLoading } = useCartOptions();

  const handleAddToCart = async () => {
    const displayName = product.standardized_name || product.name;
    const quantityToAdd = product.moq || 1;

    console.log("🛒 [베스트 상품] 장바구니 담기 시도:", {
      product_id: product.id,
      product_name: displayName,
      rank,
      quantity: quantityToAdd,
      retailerId,
      isLoading,
    });

    // 로딩 중이거나 retailerId가 없으면 중단
    if (isLoading || !retailerId || !supabaseClient) {
      console.warn("⚠️ [베스트 상품] 장바구니 담기 실패: 아직 준비되지 않음", {
        isLoading,
        hasRetailerId: !!retailerId,
        hasSupabaseClient: !!supabaseClient,
      });
      return;
    }

    try {
      await addToCart(
        {
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
        },
        {
          retailerId,
          supabaseClient,
        }
      );

      console.log("✅ [베스트 상품] 장바구니 담기 완료, 장바구니 페이지로 이동");
      router.push("/retailer/cart");
    } catch (error) {
      console.error("❌ [베스트 상품] 장바구니 담기 실패:", error);
    }
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
      <div className="flex md:flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer">
        {/* 이미지 영역 */}
        <div className="relative w-32 md:w-full aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-colors duration-200">
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
          <div className="absolute top-0 left-0 bg-gray-900 dark:bg-gray-900 text-white w-8 h-8 flex items-center justify-center font-bold text-lg shadow-md z-10 transition-colors duration-200">
            {rank}
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 flex flex-col justify-center">
          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1 transition-colors duration-200">
            {product.standardized_name || product.name}
          </h4>
          {product.specification && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1 transition-colors duration-200">
              {product.specification}
            </p>
          )}
          <div className="flex items-center gap-2 mb-3">
            {discountRate && (
              <span className="text-red-500 dark:text-red-400 font-bold transition-colors duration-200">{discountRate}%</span>
            )}
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100 transition-colors duration-200">
              {product.price.toLocaleString()}원
            </span>
          </div>
          <button
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleAddToCart();
            }}
            disabled={product.stock_quantity === 0 || isLoading || !retailerId || !supabaseClient}
            className="w-full py-2 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            <span>{isLoading ? "로딩 중..." : "담기"}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

