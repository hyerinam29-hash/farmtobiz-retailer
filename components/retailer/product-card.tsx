/**
 * @file components/retailer/product-card.tsx
 * @description 상품 카드 컴포넌트 (장바구니 추가 기능 포함)
 *
 * 상품 목록에서 사용되는 상품 카드 컴포넌트입니다.
 * 장바구니 추가 기능을 포함합니다.
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product & {
    wholesaler_anonymous_code: string;
    wholesaler_region: string;
    original_name?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    console.log("🛒 [장바구니] 상품 추가 시도:", {
      product_id: product.id,
      product_name: product.standardized_name || product.original_name || product.name,
      quantity: product.moq,
      price: product.price,
    });

    // 장바구니에 추가
    addToCart({
      product_id: product.id,
      variant_id: null, // 옵션이 없으면 null
      quantity: product.moq, // 최소 주문 수량으로 기본 설정
      unit_price: product.price,
      delivery_method: product.delivery_method,
      wholesaler_id: product.wholesaler_id,
      product_name: product.standardized_name || product.original_name || product.name,
      anonymous_seller_id: product.wholesaler_anonymous_code,
      seller_region: product.wholesaler_region,
      product_image: product.image_url,
      specification: product.specification,
      moq: product.moq,
      stock_quantity: product.stock_quantity,
    });

    console.log("✅ [장바구니] 상품 추가 완료");

    // 장바구니 페이지로 이동
    router.push("/retailer/cart");
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      {/* 이미지 영역 */}
      <Link href={`/retailer/products/${product.id}`}>
        <div className="relative aspect-square w-full overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.standardized_name || product.original_name || product.name}
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
      <div className="flex flex-col p-6 gap-[1.125rem]">
        {/* 판매자 정보 (익명화) */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {product.wholesaler_anonymous_code} · {product.wholesaler_region}
        </p>

        {/* 상품명 (AI 표준화된 이름 우선 표시) */}
        <Link href={`/retailer/products/${product.id}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-primary transition-colors">
            {product.standardized_name || product.original_name || product.name}
          </h3>
        </Link>

        {/* 규격 */}
        {product.specification && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {product.specification}
          </p>
        )}

        {/* 가격 및 재고 */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {product.price.toLocaleString()}원
            </p>
            {product.stock_quantity > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                재고: {product.stock_quantity}개
              </p>
            )}
            {product.stock_quantity === 0 && (
              <p className="text-sm text-red-600 dark:text-red-400">
                품절
              </p>
            )}
          </div>
          {product.moq > 1 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              최소 {product.moq}개
            </p>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
          className="flex w-full items-center justify-center gap-3 px-6 py-3 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-6 h-6" />
          <span>장바구니 담기</span>
        </button>
      </div>
    </div>
  );
}

