/**
 * @file components/retailer/order-product-item.tsx
 * @description 주문 상세 페이지의 상품 항목 컴포넌트 (클라이언트 컴포넌트)
 *
 * 재구매 버튼의 onClick 핸들러를 처리하기 위한 클라이언트 컴포넌트입니다.
 */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useCartOptions } from "@/hooks/use-cart-options";
import { getReorderProducts } from "@/actions/retailer/reorder";

interface OrderProductItemProps {
  id: string;
  name: string;
  image_url: string | null;
  quantity: number;
  unit_price: number;
}

export default function OrderProductItem({
  id,
  name,
  image_url,
  quantity,
  unit_price,
}: OrderProductItemProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { retailerId, supabaseClient, isLoading } = useCartOptions();
  const [isRebuying, setIsRebuying] = useState(false);
  const isCartReady = !isLoading && !!retailerId && !!supabaseClient;

  const handleRebuy = async () => {
    console.log("🔄 [주문 상세] 재구매 클릭", {
      productId: id,
      productName: name,
      quantity,
      isLoading,
      hasRetailerId: !!retailerId,
      hasSupabaseClient: !!supabaseClient,
    });

    if (isLoading || !retailerId || !supabaseClient) {
      console.warn("⚠️ [주문 상세] 재구매 실패: 장바구니 옵션 준비되지 않음", {
        isLoading,
        hasRetailerId: !!retailerId,
        hasSupabaseClient: !!supabaseClient,
      });
      alert("잠시 후 다시 시도해주세요.");
      return;
    }

    setIsRebuying(true);

    try {
      const result = await getReorderProducts({ productIds: [id] });

      if (!result.success || !result.products || result.products.length === 0) {
        console.error("❌ [주문 상세] 상품 정보 조회 실패:", result.error);
        alert(result.error || "상품 정보를 조회할 수 없습니다.");
        return;
      }

      const productDetail = result.products[0];

      console.log("✅ [주문 상세] 상품 정보 조회 완료:", {
        productId: productDetail.id,
        productName: productDetail.name,
        price: productDetail.price,
      });

      await addToCart(
        {
          product_id: productDetail.id,
          variant_id: null,
          quantity,
          unit_price: productDetail.price,
          shipping_fee: productDetail.shipping_fee,
          delivery_method: productDetail.delivery_method ?? "courier",
          wholesaler_id: productDetail.wholesaler_id,
          product_name: productDetail.standardized_name || productDetail.name,
          anonymous_seller_id: productDetail.wholesaler_anonymous_code,
          seller_region: productDetail.wholesaler_region,
          product_image: productDetail.image_url,
          specification: productDetail.specification,
          moq: productDetail.moq || 1,
          stock_quantity: productDetail.stock_quantity,
        },
        {
          retailerId,
          supabaseClient,
        },
      );

      console.log("✅ [주문 상세] 재구매 장바구니 담기 완료, 장바구니 페이지로 이동", {
        productId: productDetail.id,
      });
      router.push("/retailer/cart");
    } catch (error) {
      console.error("❌ [주문 상세] 재구매 중 오류:", error);
      alert("재구매 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsRebuying(false);
    }
  };

  return (
    <div
      data-order-product-id={id}
      className="flex gap-4 py-4 border-b border-gray-100 last:border-0"
    >
      {/* 상품 이미지 */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={24} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 mb-1">{name}</h4>
        <div className="text-sm text-gray-500 mb-2">
          {unit_price.toLocaleString()}원 / {quantity}개
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRebuy}
            disabled={isRebuying || !isCartReady}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRebuying ? "처리 중..." : !isCartReady ? "준비 중..." : "재구매"}
          </button>
        </div>
      </div>

      {/* 상품 총액 */}
      <div className="font-bold text-gray-900">
        {(unit_price * quantity).toLocaleString()}원
      </div>
    </div>
  );
}

