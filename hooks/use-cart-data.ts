/**
 * @file hooks/use-cart-data.ts
 * @description 장바구니 데이터를 DB에서 로드하는 훅
 *
 * 페이지 로드 시 Supabase에서 장바구니 데이터를 조회하여
 * Zustand store에 자동으로 설정합니다.
 */

"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useCartOptions } from "./use-cart-options";
import type { CartItem } from "@/types/cart";

/**
 * 장바구니 데이터를 DB에서 로드하는 훅
 *
 * retailerId와 supabaseClient가 준비되면 자동으로 DB에서 데이터를 조회하여
 * cart store에 setItems()를 호출합니다.
 */
export function useCartData() {
  const { retailerId, supabaseClient, isLoading } = useCartOptions();
  const setItems = useCartStore((state) => state.setItems);

  useEffect(() => {
    // 로딩 중이거나 필요한 값이 없으면 실행하지 않음
    if (isLoading || !retailerId || !supabaseClient) {
      return;
    }

    async function loadCartItems() {
      try {
        console.log("🔄 [useCartData] 장바구니 데이터 로딩 시작...");

        const { data, error } = await supabaseClient
          .from("cart_items")
          .select(
            `
            id,
            product_id,
            variant_id,
            quantity,
            products (
              name,
              standardized_name,
              price,
              shipping_fee,
              delivery_method,
              stock_quantity,
              image_url,
              specification,
              moq,
              wholesaler_id,
              wholesalers (
                anonymous_code,
                address
              )
            )
          `
          )
          .eq("retailer_id", retailerId);

        if (error) {
          console.error("❌ [useCartData] DB 조회 실패:", error);
          return;
        }

        if (!data || data.length === 0) {
          console.log("ℹ️ [useCartData] 장바구니가 비어있습니다.");
          setItems([]);
          return;
        }

        // DB 데이터를 CartItem 타입으로 변환
        const cartItems: CartItem[] = data
          .filter((item) => item.products) // products가 null인 경우 제외
          .map((item) => {
            const product = item.products as any;
            const wholesaler = product.wholesalers;

            // 주소에서 시/구 추출 (예: "서울특별시 강남구 테헤란로 123" -> "서울 강남구")
            const extractRegion = (address: string | null): string => {
              if (!address) return "정보 없음";
              const match = address.match(/^(.+?[시도])\s*(.+?[시군구])/);
              if (match) {
                return `${match[1]} ${match[2]}`;
              }
              return address.split(" ").slice(0, 2).join(" ");
            };

            return {
              id: item.id,
              product_id: item.product_id,
              variant_id: item.variant_id,
              quantity: item.quantity,
              unit_price: product.price,
              delivery_method: product.delivery_method,
              wholesaler_id: product.wholesaler_id,
              product_name: product.standardized_name || product.name,
              anonymous_seller_id: wholesaler?.anonymous_code || "VENDOR-000",
              seller_region: extractRegion(wholesaler?.address),
              product_image: product.image_url,
              specification: product.specification,
              moq: product.moq,
              stock_quantity: product.stock_quantity,
              shipping_fee: product.shipping_fee,
              shipping_fee_total: product.shipping_fee * item.quantity,
            };
          });

        console.log("✅ [useCartData] 장바구니 데이터 로딩 완료:", cartItems.length, "개");
        setItems(cartItems);
      } catch (error) {
        console.error("❌ [useCartData] 예외 발생:", error);
      }
    }

    loadCartItems();
  }, [retailerId, supabaseClient, isLoading, setItems]);
}
