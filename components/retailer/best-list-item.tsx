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
import { useCartStore } from "@/stores/cart-store";
import { useCartOptions } from "@/hooks/use-cart-options";
import { toast } from "sonner";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";

interface BestListItemProps {
  product: RetailerProduct;
  rank: number;
}

export default function BestListItem({ product, rank }: BestListItemProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { retailerId, supabaseClient, isLoading } = useCartOptions();

  const handleAddToCart = async () => {
    // quantity를 명시적으로 Number로 변환하여 타입 보장
    const quantityToAdd = Number(product.moq || 1);

    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      console.error("❌ [베스트페이지] 잘못된 수량:", quantityToAdd);
      toast.error("올바른 수량을 선택해주세요");
      return;
    }

    // 로딩 중이거나 retailerId가 없으면 중단
    if (isLoading || !retailerId || !supabaseClient) {
      console.warn("⚠️ [베스트페이지] 장바구니 담기 실패: 아직 준비되지 않음", {
        isLoading,
        hasRetailerId: !!retailerId,
        hasSupabaseClient: !!supabaseClient,
      });
      toast.error("잠시 후 다시 시도해주세요");
      return;
    }

    console.log("🛒 [베스트페이지] 장바구니 담기 시도:", {
      product_id: product.id,
      product_name: product.standardized_name || product.name,
      rank,
      quantity: quantityToAdd,
    });

    try {
      await addToCart(
        {
          product_id: product.id,
          variant_id: null,
          quantity: quantityToAdd, // Number로 보장
          unit_price: product.price,
          shipping_fee: product.shipping_fee,
          delivery_method: product.delivery_method ?? "courier",
          wholesaler_id: product.wholesaler_id,
          product_name: product.standardized_name || product.name,
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

      console.log("✅ [베스트페이지] 장바구니 담기 완료, quantity:", quantityToAdd);

      // 장바구니 페이지로 이동
      router.push("/retailer/cart");
    } catch (error) {
      console.error("❌ [베스트페이지] 장바구니 담기 실패:", error);
      toast.error("장바구니 담기에 실패했습니다");
    }
  };

  const handleImageClick = () => {
    console.log("🖼️ [베스트페이지] 이미지 클릭 - 상세 페이지로 이동:", {
      product_id: product.id,
      product_name: product.standardized_name || product.name,
      rank,
    });

    // 상품 상세 페이지로 이동
    router.push(`/retailer/products/${product.id}`);
  };

  return (
    <div className="flex items-center gap-4 md:gap-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-purple-100/50 dark:border-purple-900/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group transition-colors duration-200">
      {/* 순위 번호 */}
      <div className="font-black text-xl md:text-2xl text-gray-300 dark:text-gray-600 w-6 md:w-8 text-center flex-shrink-0 transition-colors duration-200">
        {rank}
      </div>

      {/* 상품 이미지 */}
      <div 
        onClick={handleImageClick}
        className="w-20 h-28 md:w-24 md:h-32 lg:w-32 lg:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 relative cursor-pointer hover:opacity-90 transition-opacity transition-colors duration-200"
      >
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
        <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100 mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors line-clamp-1 duration-200">
          {product.standardized_name || product.name}
        </h3>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-3 line-clamp-2 transition-colors duration-200">
          {product.specification || "인기 상품"}
        </p>
        <div className="font-black text-lg md:text-xl text-gray-900 dark:text-gray-100 transition-colors duration-200">
          {product.price.toLocaleString()}원
        </div>
      </div>

      {/* 장바구니 버튼 */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock_quantity === 0 || isLoading || !retailerId || !supabaseClient}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:border-purple-600 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors bg-white dark:bg-gray-800 shadow-sm flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed duration-200"
        aria-label={isLoading ? "로딩 중..." : "장바구니 담기"}
      >
        <ShoppingCart size={18} className="md:w-5 md:h-5" />
      </button>
    </div>
  );
}

