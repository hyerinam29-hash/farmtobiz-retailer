/**
 * @file components/retailer/product-recommendation-card.tsx
 * @description 추천 상품 카드 컴포넌트
 *
 * "이 상품 어때요?" 섹션에서 사용하는 상품 카드 컴포넌트입니다.
 * 디자인 명세에 맞춰 상태 라벨, 상품 이미지, 정보, 장바구니 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 상태 라벨 표시 (인기/신상품/할인/추천)
 * 2. 상품 이미지 및 정보 표시
 * 3. 원산지 정보 표시
 * 4. 판매가 및 단가 정보 표시
 * 5. 장바구니 담기 기능
 *
 * @dependencies
 * - next/image (Image)
 * - stores/cart-store (useCartStore)
 * - lucide-react (ShoppingCart, MapPin)
 *
 * @see {@link docs/design-handoff/01-HomePage/specs.md}
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, MapPin } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCartOptions } from "@/hooks/use-cart-options";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";

interface ProductRecommendationCardProps {
  product: RetailerProduct;
  /** 상태 라벨 텍스트 (인기/신상품/할인/추천) */
  statusLabel?: "인기" | "신상품" | "할인" | "추천";
}

/**
 * specification에서 무게(kg) 추출
 * 예: "5kg", "7.5kg", "10kg" 등
 */
function extractWeight(specification: string | null): number | null {
  if (!specification) return null;
  
  // "5kg", "7.5kg", "10kg" 등의 패턴 매칭
  const match = specification.match(/(\d+\.?\d*)\s*kg/i);
  if (match) {
    return parseFloat(match[1]);
  }
  
  return null;
}

/**
 * 단가 계산 (1kg 당 가격)
 */
function calculateUnitPrice(price: number, weight: number | null): number | null {
  if (!weight || weight <= 0) return null;
  return Math.round(price / weight);
}

export default function ProductRecommendationCard({
  product,
  statusLabel = "인기",
}: ProductRecommendationCardProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { retailerId, supabaseClient } = useCartOptions();
  
  const displayName = product.standardized_name || product.name;
  const weight = extractWeight(product.specification);
  const unitPrice = calculateUnitPrice(product.price, weight);
  
  // 장바구니 담기 핸들러
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("🛒 [추천상품카드] 장바구니 담기 시도:", {
      productId: product.id,
      productName: displayName,
    });

    addToCart(
      {
        product_id: product.id,
        variant_id: null,
        quantity: product.moq || 1,
        unit_price: product.price,
        shipping_fee: product.shipping_fee,
        delivery_method: product.delivery_method ?? "courier",
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
        retailerId: retailerId ?? undefined,
        supabaseClient: supabaseClient ?? undefined,
      }
    );

    console.log("✅ [추천상품카드] 장바구니 담기 완료, 장바구니 페이지로 이동");
    router.push("/retailer/cart");
  };

  return (
    <Link
      href={`/retailer/products/${product.id}`}
      className="group bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col border border-gray-100 dark:border-gray-800 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
    >
      {/* 상품 이미지 영역 */}
      <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800 group-hover:bg-green-50 dark:group-hover:bg-green-900/30 transition-colors duration-200">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={displayName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <span className="text-6xl drop-shadow-sm">🍎</span>
          </div>
        )}
        
        {/* 상태 라벨 (좌측 상단) */}
        <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
          {statusLabel}
        </span>
      </div>

      {/* 상품 정보 영역 */}
      <div className="p-5 space-y-3 flex-1 flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="flex-1">
          {/* 상품명 */}
          <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 line-clamp-2 mb-1 transition-colors duration-200">
            {displayName}
          </h3>
          
          {/* 원산지/지역 */}
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 transition-colors duration-200">
            <MapPin size={12} className="text-gray-400 dark:text-gray-500 transition-colors duration-200" />
            {product.wholesaler_region ? (
              <span>국산 ({product.wholesaler_region})</span>
            ) : (
              <span>국산</span>
            )}
          </p>
        </div>

        {/* 가격 정보 */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 transition-colors duration-200">
          {/* 판매가 (굵게, 초록색) */}
          <div className="font-black text-xl text-green-600 dark:text-green-400 tracking-tight transition-colors duration-200">
            ₩{product.price.toLocaleString()}
          </div>
          
          {/* 단가 문구 */}
          {unitPrice && (
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 transition-colors duration-200">
              1kg 당 ₩{unitPrice.toLocaleString()} (예상)
            </div>
          )}
        </div>

        {/* 담기 버튼 */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2 text-sm h-10 border-2 border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 font-bold text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 active:translate-y-0.5"
        >
          <ShoppingCart size={16} className="transition-colors duration-200" />
          <span>담기</span>
        </button>
      </div>
    </Link>
  );
}

