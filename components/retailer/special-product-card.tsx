/**
 * @file components/retailer/special-product-card.tsx
 * @description 연말 특가 전용 상품 카드
 *
 * 기능은 동일하게 장바구니 담기/상품 상세 이동을 제공하며,
 * 시안에 맞춰 이미지와 스타일만 변경합니다.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";

interface SpecialProductCardProps {
  product: RetailerProduct;
}

export default function SpecialProductCard({ product }: SpecialProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const displayName = product.standardized_name || product.name;

  const discountRate = 50;
  const originalPrice = Math.round(product.price / (1 - discountRate / 100));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🛒 [special-product-card] 장바구니 담기 시도", {
      productId: product.id,
      productName: displayName,
    });

    addToCart({
      product_id: product.id,
      variant_id: null,
      quantity: product.moq || 1,
      unit_price: product.price,
      delivery_method: "normal",
      wholesaler_id: product.wholesaler_id,
      product_name: displayName,
      anonymous_seller_id: product.wholesaler_anonymous_code,
      seller_region: product.wholesaler_region,
      product_image: product.image_url,
      specification: product.specification,
      moq: product.moq || 1,
      stock_quantity: product.stock_quantity,
    });

    console.log("✅ [special-product-card] 장바구니 담기 완료");
  };

  return (
    <Link href={`/retailer/products/${product.id}`}>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
        {/* 상품 이미지 */}
        <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={displayName}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-red-50 flex items-center justify-center text-gray-400">
              <span className="text-4xl">🔥</span>
            </div>
          )}
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 animate-pulse">
            {discountRate}% OFF
          </span>
        </div>

        {/* 상품 정보 */}
        <div className="p-5 space-y-3 flex-1 flex flex-col bg-white">
          <div className="flex-1">
            <h3 className="font-bold text-base text-gray-900 line-clamp-2">
              {displayName}
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              한정수량 특가
            </p>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-end gap-2 mb-1">
              <span className="text-xl font-black text-red-600">
                {product.price.toLocaleString()}원
              </span>
              <span className="text-sm text-gray-400 line-through mb-1">
                {originalPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full py-2 text-sm h-10 border-2 border-red-500/20 rounded-xl text-red-600 font-bold hover:bg-red-50 flex items-center justify-center gap-2 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            <span>담기</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

