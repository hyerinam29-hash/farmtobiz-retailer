/**
 * @file actions/retailer/cart.ts
 * @description 장바구니 Server Actions
 *
 * Supabase cart_items 테이블에 장바구니를 저장/조회/수정/삭제합니다.
 *
 * 주요 기능:
 * 1. 장바구니에 상품 추가 (같은 상품이 있으면 수량 증가)
 * 2. 장바구니 조회 (표시용 정보 포함)
 * 3. 장바구니 아이템 수정 (수량 등)
 * 4. 장바구니 아이템 삭제
 * 5. 장바구니 전체 비우기
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 * - lib/supabase/server.ts (createClerkSupabaseClient)
 * - types/cart.ts
 *
 * @see {@link docs/retailer/RE_PRD.md} - R.CART.01 요구사항
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { calculateTotals } from "@/lib/utils/shipping";
import type {
  AddToCartInput,
  UpdateCartItemInput,
  CartItem,
} from "@/types/cart";

/**
 * 장바구니에 상품 추가
 *
 * 같은 상품(product_id + variant_id 조합)이 이미 있으면 수량을 증가시키고,
 * 없으면 새 아이템으로 추가합니다.
 *
 * @param input 추가할 상품 정보
 * @returns 성공 여부 및 장바구니 아이템 ID
 */
export async function addToCartDB(
  input: AddToCartInput
): Promise<{ success: boolean; error?: string; cartItemId?: string }> {
  try {
    console.group("🛒 [cart] 장바구니 추가 (DB)");
    console.log("입력 정보:", {
      productId: input.product_id,
      variantId: input.variant_id,
      quantity: input.quantity,
    });

    // 1. 인증 확인
    const profile = await getUserProfile();
    if (!profile) {
      console.error("❌ 인증 실패: 로그인 필요");
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }

    const retailers = profile.retailers as Array<{ id: string }> | null;
    if (!retailers || retailers.length === 0) {
      console.error("❌ 소매점 정보 없음");
      console.groupEnd();
      return { success: false, error: "소매점 정보가 없습니다." };
    }

    const retailerId = retailers[0].id;
    const supabase = createClerkSupabaseClient();

    console.log("✅ 인증 확인:", { retailerId });

    // 2. 수량 검증
    const quantity = Number(input.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      console.error("❌ 잘못된 수량:", quantity);
      console.groupEnd();
      return { success: false, error: "수량은 1 이상이어야 합니다." };
    }

    // 3. 같은 상품이 이미 있는지 확인
    const { data: existingItem, error: findError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("retailer_id", retailerId)
      .eq("product_id", input.product_id)
      .eq("variant_id", input.variant_id ?? null)
      .maybeSingle();

    if (findError && findError.code !== "PGRST116") {
      // PGRST116은 "no rows returned" 에러 (정상)
      console.error("❌ 기존 아이템 조회 실패:", findError);
      console.groupEnd();
      return { success: false, error: findError.message };
    }

    if (existingItem) {
      // 기존 아이템 수량 증가
      const newQuantity = existingItem.quantity + quantity;
      console.log("🔄 기존 상품 수량 증가:", {
        existingQuantity: existingItem.quantity,
        addQuantity: quantity,
        newQuantity,
      });

      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id)
        .select("id")
        .single();

      if (error) {
        console.error("❌ 장바구니 수량 업데이트 실패:", error);
        console.groupEnd();
        return { success: false, error: error.message };
      }

      console.log("✅ 장바구니 수량 증가 완료");
      console.groupEnd();
      return { success: true, cartItemId: data.id };
    } else {
      // 새 아이템 추가
      console.log("➕ 새 상품 추가");

      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          retailer_id: retailerId,
          product_id: input.product_id,
          variant_id: input.variant_id,
          quantity: quantity,
        })
        .select("id")
        .single();

      if (error) {
        console.error("❌ 장바구니 추가 실패:", error);
        console.groupEnd();
        return { success: false, error: error.message };
      }

      console.log("✅ 장바구니 추가 완료");
      console.groupEnd();
      return { success: true, cartItemId: data.id };
    }
  } catch (error) {
    console.error("❌ 장바구니 추가 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "장바구니 추가에 실패했습니다.",
    };
  }
}

/**
 * 장바구니 조회 (표시용 정보 포함)
 *
 * cart_items와 products, product_variants, wholesalers를 JOIN하여
 * 프론트엔드에서 필요한 모든 표시 정보를 가져옵니다.
 *
 * @returns 장바구니 아이템 배열
 */
export async function getCartItemsDB(): Promise<{
  success: boolean;
  error?: string;
  items: CartItem[];
}> {
  try {
    console.group("🛒 [cart] 장바구니 조회 (DB)");

    // 1. 인증 확인
    const profile = await getUserProfile();
    if (!profile) {
      console.error("❌ 인증 실패: 로그인 필요");
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다.", items: [] };
    }

    const retailers = profile.retailers as Array<{ id: string }> | null;
    if (!retailers || retailers.length === 0) {
      console.error("❌ 소매점 정보 없음");
      console.groupEnd();
      return { success: false, error: "소매점 정보가 없습니다.", items: [] };
    }

    const retailerId = retailers[0].id;
    const supabase = createClerkSupabaseClient();

    console.log("✅ 인증 확인:", { retailerId });

    // 2. cart_items와 관련 테이블 JOIN하여 조회
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        id,
        product_id,
        variant_id,
        quantity,
        created_at,
        updated_at,
        products (
          id,
          name,
          unit_price,
          shipping_fee,
          delivery_method,
          wholesaler_id,
          image_url,
          specification,
          moq,
          stock_quantity,
          wholesalers (
            id,
            anonymous_code,
            address
          )
        ),
        product_variants (
          id,
          name,
          price
        )
      `
      )
      .eq("retailer_id", retailerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ 장바구니 조회 실패:", error);
      console.groupEnd();
      return { success: false, error: error.message, items: [] };
    }

    // 3. 데이터 변환 (DB 형식 → 프론트엔드 CartItem 형식)
    const items: CartItem[] = (data || []).map((item) => {
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;
      const variant = Array.isArray(item.product_variants)
        ? item.product_variants[0]
        : item.product_variants;
      const wholesaler = Array.isArray(product?.wholesalers)
        ? product.wholesalers[0]
        : product?.wholesalers;

      // 주소에서 지역 추출 (시/구 단위)
      const addressParts = wholesaler?.address?.split(" ") || [];
      const sellerRegion =
        addressParts.length >= 2
          ? `${addressParts[0]} ${addressParts[1]}`
          : wholesaler?.address || "";

      // 가격 결정: variant가 있으면 variant 가격, 없으면 product 기본 가격
      const unitPrice = variant?.price ?? product?.unit_price ?? 0;

      // 배송비 계산
      const shippingFee = product?.shipping_fee ?? 0;
      const { shippingFee: shippingFeeTotal } = calculateTotals({
        unitPrice,
        shippingUnitFee: shippingFee,
        quantity: item.quantity,
      });

      // 규격 결정: variant가 있으면 variant name, 없으면 product specification
      const specification = variant?.name ?? product?.specification ?? null;

      return {
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        delivery_method: (product?.delivery_method as any) ?? "courier",
        wholesaler_id: product?.wholesaler_id ?? "",
        product_name: product?.name ?? "",
        anonymous_seller_id: wholesaler?.anonymous_code ?? "",
        seller_region: sellerRegion,
        product_image: product?.image_url ?? null,
        specification,
        moq: product?.moq ?? 1,
        stock_quantity: product?.stock_quantity ?? 0,
        shipping_fee: shippingFee,
        shipping_fee_total: shippingFeeTotal,
      };
    });

    console.log("✅ 장바구니 조회 완료:", { itemCount: items.length });
    console.groupEnd();

    return { success: true, items };
  } catch (error) {
    console.error("❌ 장바구니 조회 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "장바구니 조회에 실패했습니다.",
      items: [],
    };
  }
}

/**
 * 장바구니 아이템 수정
 *
 * @param input 수정할 아이템 정보 (id 필수, 나머지는 선택)
 * @returns 성공 여부
 */
export async function updateCartItemDB(
  input: UpdateCartItemInput
): Promise<{ success: boolean; error?: string }> {
  try {
    console.group("🛒 [cart] 장바구니 아이템 수정 (DB)");
    console.log("수정 정보:", input);

    const supabase = createClerkSupabaseClient();

    // 수정할 데이터 준비
    const updateData: {
      quantity?: number;
    } = {};

    if (input.quantity !== undefined) {
      const quantity = Number(input.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        console.error("❌ 잘못된 수량:", quantity);
        console.groupEnd();
        return { success: false, error: "수량은 1 이상이어야 합니다." };
      }
      updateData.quantity = quantity;
    }

    const { error } = await supabase
      .from("cart_items")
      .update(updateData)
      .eq("id", input.id);

    if (error) {
      console.error("❌ 장바구니 수정 실패:", error);
      console.groupEnd();
      return { success: false, error: error.message };
    }

    console.log("✅ 장바구니 수정 완료");
    console.groupEnd();
    return { success: true };
  } catch (error) {
    console.error("❌ 장바구니 수정 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "수정에 실패했습니다.",
    };
  }
}

/**
 * 장바구니 아이템 삭제
 *
 * @param itemId 삭제할 아이템 ID
 * @returns 성공 여부
 */
export async function removeFromCartDB(
  itemId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.group("🛒 [cart] 장바구니 아이템 삭제 (DB)");
    console.log("삭제할 아이템 ID:", itemId);

    const supabase = createClerkSupabaseClient();

    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

    if (error) {
      console.error("❌ 장바구니 삭제 실패:", error);
      console.groupEnd();
      return { success: false, error: error.message };
    }

    console.log("✅ 장바구니 삭제 완료");
    console.groupEnd();
    return { success: true };
  } catch (error) {
    console.error("❌ 장바구니 삭제 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "삭제에 실패했습니다.",
    };
  }
}

/**
 * 장바구니 전체 비우기
 *
 * @returns 성공 여부
 */
export async function clearCartDB(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.group("🛒 [cart] 장바구니 전체 비우기 (DB)");

    // 1. 인증 확인
    const profile = await getUserProfile();
    if (!profile) {
      console.error("❌ 인증 실패: 로그인 필요");
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }

    const retailers = profile.retailers as Array<{ id: string }> | null;
    if (!retailers || retailers.length === 0) {
      console.error("❌ 소매점 정보 없음");
      console.groupEnd();
      return { success: false, error: "소매점 정보가 없습니다." };
    }

    const retailerId = retailers[0].id;
    const supabase = createClerkSupabaseClient();

    console.log("✅ 인증 확인:", { retailerId });

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("retailer_id", retailerId);

    if (error) {
      console.error("❌ 장바구니 비우기 실패:", error);
      console.groupEnd();
      return { success: false, error: error.message };
    }

    console.log("✅ 장바구니 비우기 완료");
    console.groupEnd();
    return { success: true };
  } catch (error) {
    console.error("❌ 장바구니 비우기 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "장바구니 비우기에 실패했습니다.",
    };
  }
}

