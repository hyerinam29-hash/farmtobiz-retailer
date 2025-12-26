/**
 * @file components/retailer/order-list-item-actions.tsx
 * @description 주문 목록 아이템 액션 버튼 컴포넌트
 *
 * 주문 목록 페이지의 각 주문 아이템에 대한 액션 버튼들을 관리하는 클라이언트 컴포넌트입니다.
 * 구매 확정, 주문 취소, 재주문 기능을 제공합니다.
 *
 * @dependencies
 * - components/retailer/confirm-purchase-modal.tsx
 * - components/retailer/cancel-order-modal.tsx
 * - stores/cart-store.ts
 * - app/retailer/orders/page.tsx
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmPurchaseModal from "@/components/retailer/confirm-purchase-modal";
import CancelOrderModal from "@/components/retailer/cancel-order-modal";
import { useCartStore } from "@/stores/cart-store";
import { getReorderProducts } from "@/actions/retailer/reorder";
import type { SupabaseClient } from "@supabase/supabase-js";

interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
}

interface OrderListItemActionsProps {
  orderId: string;
  orderNumber: string;
  status: "preparing" | "shipping" | "delivered" | "cancelled";
  totalPrice: number;
  products: OrderProduct[];
  cartOptions: {
    retailerId: string | null;
    supabaseClient: SupabaseClient | null;
    isLoading: boolean;
  };
}

export default function OrderListItemActions({
  orderId,
  orderNumber,
  status,
  totalPrice,
  products,
  cartOptions,
}: OrderListItemActionsProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { retailerId, supabaseClient, isLoading } = cartOptions;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const isCartReady = !isLoading && !!retailerId && !!supabaseClient;

  // 재주문 핸들러
  const handleReorder = async () => {
    setIsReordering(true);
    console.log("🔄 [주문 목록] 재주문 시작", {
      orderId,
      orderNumber,
      productsCount: products.length,
      isLoading,
      hasRetailerId: !!retailerId,
      hasSupabaseClient: !!supabaseClient,
    });

    try {
      // 장바구니 단일 진실의 원천을 DB(cart_items)로 통일:
      // retailerId/supabaseClient가 준비되지 않으면 재주문 장바구니 담기를 진행하지 않음
      if (isLoading || !retailerId || !supabaseClient) {
        console.warn("⚠️ [주문 목록] 재주문 실패: 장바구니 옵션 준비되지 않음", {
          isLoading,
          hasRetailerId: !!retailerId,
          hasSupabaseClient: !!supabaseClient,
        });
        alert("잠시 후 다시 시도해주세요.");
        return;
      }

      // 상품 ID 배열 추출
      const productIds = products.map((p) => p.id);

      // Server Action으로 상품 정보 조회
      const result = await getReorderProducts({ productIds });

      if (!result.success || !result.products) {
        console.error("❌ [주문 목록] 상품 정보 조회 실패:", result.error);
        alert(result.error || "상품 정보를 조회할 수 없습니다.");
        setIsReordering(false);
        return;
      }

      // 각 상품을 장바구니에 추가
      for (let i = 0; i < result.products.length; i++) {
        const productDetail = result.products[i];
        const originalProduct = products.find((p) => p.id === productDetail.id);

        if (!originalProduct) {
          console.warn("⚠️ [주문 목록] 원본 상품 정보 없음:", productDetail.id);
          continue;
        }

        console.log("✅ [주문 목록] 상품 정보 조회 완료:", {
          productId: productDetail.id,
          productName: productDetail.name,
          price: productDetail.price,
        });

        // 장바구니에 추가
        await addToCart(
          {
            product_id: productDetail.id,
            variant_id: null,
            quantity: originalProduct.quantity,
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

        console.log("✅ [주문 목록] 장바구니 담기 완료:", originalProduct.name);
      }

      console.log("✅ [주문 목록] 재주문 완료, 장바구니 페이지로 이동");
      router.push("/retailer/cart");
    } catch (error) {
      console.error("❌ [주문 목록] 재주문 중 오류:", error);
      alert("재주문 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
        {status === "delivered" ? (
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base md:text-lg font-medium rounded-lg transition-colors"
          >
            구매 확정
          </button>
        ) : status === "preparing" ? (
          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm sm:text-base md:text-lg font-medium rounded-lg transition-colors"
          >
            주문 취소
          </button>
        ) : null}
        <button
          onClick={handleReorder}
          disabled={isReordering || !isCartReady}
          className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base md:text-lg font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isReordering ? "처리 중..." : !isCartReady ? "준비 중..." : "재주문"}
        </button>
      </div>

      {/* 구매 확정 모달 */}
      {status === "delivered" && (
        <ConfirmPurchaseModal
          open={isConfirmModalOpen}
          onOpenChange={setIsConfirmModalOpen}
          orderId={orderId}
          orderNumber={orderNumber}
          totalAmount={totalPrice}
        />
      )}

      {/* 주문 취소 모달 */}
      {status === "preparing" && (
        <CancelOrderModal
          open={isCancelModalOpen}
          onOpenChange={setIsCancelModalOpen}
          orderId={orderId}
          orderNumber={orderNumber}
        />
      )}
    </>
  );
}
