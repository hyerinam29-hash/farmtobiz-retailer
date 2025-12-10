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

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";

interface ProductActionsProps {
  product: RetailerProduct;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  
  // 수량 상태 (1부터 시작)
  const [quantity, setQuantity] = useState(1);

  // 수량 감소
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
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
  const handleAddToCart = () => {
    // quantity를 명시적으로 Number로 변환하여 타입 보장
    const quantityToAdd = Number(quantity);
    
    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      console.error("❌ [상품상세] 잘못된 수량:", quantityToAdd);
      toast.error("올바른 수량을 선택해주세요");
      return;
    }

    console.log("🛒 [상품상세] 장바구니 담기 시도:", {
      productId: product.id,
      quantity: quantityToAdd,
    });

    addToCart({
      product_id: product.id,
      variant_id: null,
      quantity: quantityToAdd, // Number로 보장
      unit_price: product.price,
      delivery_method: "normal" as const,
      wholesaler_id: product.wholesaler_id,
      product_name: product.standardized_name || product.name,
      anonymous_seller_id: product.wholesaler_anonymous_code,
      seller_region: product.wholesaler_region,
      product_image: product.image_url,
      specification: product.specification,
      moq: product.moq || 1,
      stock_quantity: product.stock_quantity,
    });

    console.log("✅ [상품상세] 장바구니 담기 완료, quantity:", quantityToAdd);
    
    // 장바구니 페이지로 이동
    router.push("/retailer/cart");
  };

  // 바로구매 (결제 페이지로 이동)
  const handleBuyNow = () => {
    // quantity를 명시적으로 Number로 변환하여 타입 보장
    const quantityToAdd = Number(quantity);
    
    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      console.error("❌ [상품상세] 잘못된 수량:", quantityToAdd);
      toast.error("올바른 수량을 선택해주세요");
      return;
    }

    console.log("💳 [상품상세] 바로구매 시도:", {
      productId: product.id,
      quantity: quantityToAdd,
    });

    addToCart({
      product_id: product.id,
      variant_id: null,
      quantity: quantityToAdd, // Number로 보장
      unit_price: product.price,
      delivery_method: "normal" as const,
      wholesaler_id: product.wholesaler_id,
      product_name: product.standardized_name || product.name,
      anonymous_seller_id: product.wholesaler_anonymous_code,
      seller_region: product.wholesaler_region,
      product_image: product.image_url,
      specification: product.specification,
      moq: product.moq || 1,
      stock_quantity: product.stock_quantity,
    });

    console.log("✅ [상품상세] 바로구매, quantity:", quantityToAdd);
    
    // 결제 페이지로 이동
    router.push("/retailer/checkout");
  };

  const isOutOfStock = product.stock_quantity === 0;
  const maxQuantity = product.stock_quantity;

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

      {/* 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>장바구니 담기</span>
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 px-6 py-4 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
        >
          바로 구매
        </button>
      </div>
    </div>
  );
}

