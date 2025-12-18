/**
 * @file app/retailer/products/[id]/product-actions.tsx
 * @description 상품 상세 페이지의 장바구니 담기 및 바로구매 버튼 컴포넌트
 *
 * 주요 기능:
 * 1. 수량 선택 (1부터 재고까지)
 * 2. 장바구니 담기
 * 3. 바로구매 (결제 페이지로 이동)
 */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useCartOptions } from "@/hooks/use-cart-options";
import { toast } from "sonner";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";
import { calculateTotals } from "@/lib/utils/shipping";

interface ProductActionsProps {
  product: RetailerProduct;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { retailerId, supabaseClient, isLoading } = useCartOptions();

  // 수량 상태 (1부터 시작)
  const [quantity, setQuantity] = useState(product.moq);

  // 수량 감소
  const handleDecreaseQuantity = () => {
    if (quantity > product.moq) {
      setQuantity(quantity - 1);
      console.log("➖ [상품상세] 수량 감소:", quantity - 1);
    }
  };

  // 수량 증가
  const handleIncreaseQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
      console.log("➕ [상품상세] 수량 증가:", quantity + 1);
    }
  };

  // 장바구니 담기 (장바구니 페이지로 이동)
  const handleAddToCart = async () => {
    // quantity를 명시적으로 Number로 변환하여 타입 보장
    const quantityToAdd = Number(quantity);

    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      console.error("❌ [상품상세] 잘못된 수량:", quantityToAdd);
      toast.error("올바른 수량을 선택해주세요");
      return;
    }

    // 로딩 중이거나 retailerId가 없으면 중단
    if (isLoading || !retailerId || !supabaseClient) {
      console.warn("⚠️ [상품상세] 장바구니 담기 실패: 아직 준비되지 않음", {
        isLoading,
        hasRetailerId: !!retailerId,
        hasSupabaseClient: !!supabaseClient,
      });
      toast.error("잠시 후 다시 시도해주세요");
      return;
    }

    console.log("🛒 [상품상세] 장바구니 담기 시도:", {
      productId: product.id,
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

      console.log("✅ [상품상세] 장바구니 담기 완료, quantity:", quantityToAdd);

      // 장바구니 페이지로 이동
      router.push("/retailer/cart");
    } catch (error) {
      console.error("❌ [상품상세] 장바구니 담기 실패:", error);
      toast.error("장바구니 담기에 실패했습니다");
    }
  };

  // 바로구매 (결제 페이지로 이동)
  const handleBuyNow = async () => {
    // quantity를 명시적으로 Number로 변환하여 타입 보장
    const quantityToAdd = Number(quantity);

    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      console.error("❌ [상품상세] 잘못된 수량:", quantityToAdd);
      toast.error("올바른 수량을 선택해주세요");
      return;
    }

    // 로딩 중이거나 retailerId가 없으면 중단
    if (isLoading || !retailerId || !supabaseClient) {
      console.warn("⚠️ [상품상세] 바로구매 실패: 아직 준비되지 않음", {
        isLoading,
        hasRetailerId: !!retailerId,
        hasSupabaseClient: !!supabaseClient,
      });
      toast.error("잠시 후 다시 시도해주세요");
      return;
    }

    console.log("💳 [상품상세] 바로구매 시도:", {
      productId: product.id,
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

      console.log("✅ [상품상세] 바로구매, quantity:", quantityToAdd);

      // 결제 페이지로 이동 (상품 ID와 수량을 쿼리 파라미터로 전달)
      const checkoutUrl = `/retailer/checkout?productId=${product.id}&quantity=${quantityToAdd}`;
      console.log("🔗 [상품상세] 결제 페이지 이동:", checkoutUrl);
      router.push(checkoutUrl);
    } catch (error) {
      console.error("❌ [상품상세] 바로구매 실패:", error);
      toast.error("바로구매에 실패했습니다");
    }
  };

  const isOutOfStock = product.stock_quantity === 0;
  const maxQuantity = product.stock_quantity;
  const totals = useMemo(
    () =>
      calculateTotals({
        unitPrice: product.price,
        shippingUnitFee: product.shipping_fee ?? 0,
        quantity,
      }),
    [product.price, product.shipping_fee, quantity]
  );

  return (
    <div className="flex flex-col gap-6">

      {/* 수량 선택 */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          수량
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1}
            className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Minus className="w-5 h-5" />
          </button>
          <input
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            readOnly
            className="w-20 h-10 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={handleIncreaseQuantity}
            disabled={quantity >= maxQuantity}
            className="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 space-y-2 transition-colors duration-200">
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
          <span>상품 금액</span>
          <span className="font-semibold">₩{totals.productTotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-200">
          <span>배송비 (₩{(product.shipping_fee ?? 0).toLocaleString()}/개)</span>
          <span className="font-semibold">₩{totals.shippingFee.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">총 예상 결제액</span>
          <span className="text-lg font-extrabold text-green-600 dark:text-green-400">
            ₩{totals.total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading || !retailerId || !supabaseClient}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{isLoading ? "로딩 중..." : "장바구니 담기"}</span>
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock || isLoading || !retailerId || !supabaseClient}
          className="flex-1 px-6 py-4 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
        >
          {isLoading ? "로딩 중..." : "바로 구매"}
        </button>
      </div>
    </div>
  );
}

