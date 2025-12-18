import { create } from "zustand";
import type {
  CartItem,
  CartSummary,
  AddToCartInput,
  UpdateCartItemInput,
} from "@/types/cart";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 장바구니 스토어 상태 타입
 */
interface CartStore {
  /** 장바구니 아이템 배열 (메모리에만 유지) */
  items: CartItem[];
  /** DB에서 불러온 데이터를 스토어에 설정 */
  setItems: (items: CartItem[]) => void;
  /** 장바구니 요약 정보 계산 */
  getSummary: () => CartSummary;
  /** 장바구니에 상품 추가 */
  addToCart: (
    input: AddToCartInput,
    options?: {
      retailerId?: string;
      supabaseClient?: SupabaseClient;
    }
  ) => Promise<void>;
  /** 장바구니 아이템 수정 */
  updateCartItem: (
    input: UpdateCartItemInput,
    options?: {
      retailerId?: string;
      supabaseClient?: SupabaseClient;
    }
  ) => Promise<void>;
  /** 장바구니에서 아이템 삭제 */
  removeFromCart: (
    itemId: string,
    options?: {
      retailerId?: string;
      supabaseClient?: SupabaseClient;
    }
  ) => Promise<void>;
  /** 장바구니 전체 비우기 */
  clearCart: (
    options?: {
      retailerId?: string;
      supabaseClient?: SupabaseClient;
    }
  ) => Promise<void>;
}

/**
 * 고유 ID 생성 함수 (클라이언트 사이드 임시 ID)
 */
function generateCartItemId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 장바구니 스토어 (로컬 스토리지 미사용 버전)
 */
export const useCartStore = create<CartStore>()((set, get) => ({
  /** 초기 상태: 빈 배열 */
  items: [],

  /** 외부(DB)에서 데이터를 가져와 스토어 업데이트 */
  setItems: (items: CartItem[]) => set({ items }),

  /**
   * 장바구니 요약 정보 계산
   */
  getSummary: (): CartSummary => {
    const { items } = get();

    const totalProductPrice = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    const totalShippingFee = items.reduce(
      (sum, item) => sum + (item.shipping_fee_total || 0),
      0
    );

    const totalPrice = totalProductPrice + totalShippingFee;
    const itemCount = items.length;

    return {
      totalProductPrice,
      totalShippingFee,
      totalPrice,
      itemCount,
    };
  },

  /**
   * 장바구니에 상품 추가
   */
  addToCart: async (input, options) => {
    const inputQuantity = Number(input.quantity);
    
    if (isNaN(inputQuantity) || inputQuantity <= 0) {
      console.error("❌ [cart-store] 잘못된 수량:", inputQuantity);
      return;
    }

    const { items } = get();

    // 상품 중복 확인
    const existingItemIndex = items.findIndex(
      (item) =>
        item.product_id === input.product_id &&
        item.variant_id === input.variant_id
    );

    if (existingItemIndex !== -1) {
      // 1. 기존 상품 수량 증가 (메모리 업데이트)
      const existingItem = items[existingItemIndex];
      const newQuantity = Number(existingItem.quantity) + inputQuantity;
      
      const updatedItems = [...items];
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        unit_price: input.unit_price,
        delivery_method: input.delivery_method,
        shipping_fee: input.shipping_fee,
        shipping_fee_total: input.shipping_fee * newQuantity,
        moq: input.moq,
        stock_quantity: input.stock_quantity,
      };

      set({ items: updatedItems });

      // 2. DB 업데이트
      if (options?.retailerId && options?.supabaseClient) {
        try {
          const { error } = await options.supabaseClient
            .from("cart_items")
            .update({
              quantity: newQuantity,
              updated_at: new Date().toISOString(),
            })
            .eq("retailer_id", options.retailerId)
            .eq("product_id", input.product_id)
            .eq("variant_id", input.variant_id || null);

          if (error) console.error("❌ DB 업데이트 실패:", error);
        } catch (error) {
          console.error("❌ DB 업데이트 예외:", error);
        }
      }
    } else {
      // 1. 새 상품 추가 (메모리 업데이트)
      const newItem: CartItem = {
        id: generateCartItemId(),
        ...input,
        quantity: inputQuantity,
        shipping_fee_total: input.shipping_fee * inputQuantity,
      };

      set({ items: [...items, newItem] });

      // 2. DB 저장
      if (options?.retailerId && options?.supabaseClient) {
        try {
          const { error } = await options.supabaseClient
            .from("cart_items")
            .insert({
              retailer_id: options.retailerId,
              product_id: input.product_id,
              variant_id: input.variant_id || null,
              quantity: inputQuantity,
            });

          if (error) console.error("❌ DB 저장 실패:", error);
        } catch (error) {
          console.error("❌ DB 저장 예외:", error);
        }
      }
    }
  },

  /**
   * 장바구니 아이템 수정
   */
  updateCartItem: async (input, options) => {
    const { items } = get();
    const itemIndex = items.findIndex((item) => item.id === input.id);

    if (itemIndex === -1) return;

    const existingItem = items[itemIndex];
    const updatedItems = [...items];
    updatedItems[itemIndex] = {
      ...existingItem,
      ...(input.quantity !== undefined && { quantity: input.quantity }),
      ...(input.unit_price !== undefined && { unit_price: input.unit_price }),
      ...(input.delivery_method !== undefined && { delivery_method: input.delivery_method }),
    };

    set({ items: updatedItems });

    if (options?.retailerId && options?.supabaseClient && input.quantity !== undefined) {
      try {
        await options.supabaseClient
          .from("cart_items")
          .update({
            quantity: input.quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("retailer_id", options.retailerId)
          .eq("product_id", existingItem.product_id)
          .eq("variant_id", existingItem.variant_id || null);
      } catch (error) {
        console.error("❌ DB 수정 예외:", error);
      }
    }
  },

  /**
   * 장바구니에서 아이템 삭제
   */
  removeFromCart: async (itemId, options) => {
    const { items } = get();
    const itemToRemove = items.find((item) => item.id === itemId);
    const filteredItems = items.filter((item) => item.id !== itemId);
  
    set({ items: filteredItems });
  
    if (options?.retailerId && options?.supabaseClient && itemToRemove) {
      try {
        // 1. 기본 쿼리 생성
        let query = options.supabaseClient
          .from("cart_items")
          .delete()
          .eq("retailer_id", options.retailerId)
          .eq("product_id", itemToRemove.product_id);
  
        // 2. variant_id 조건 처리 (중요!)
        if (itemToRemove.variant_id) {
          query = query.eq("variant_id", itemToRemove.variant_id);
        } else {
          // variant_id가 없으면 .is("variant_id", null)을 사용해야 함
          query = query.is("variant_id", null);
        }
  
        const { error } = await query;
  
        if (error) {
          console.error("❌ [cart-store] DB 삭제 실패:", error.message);
        } else {
          console.log("✅ [cart-store] DB 삭제 성공");
        }
      } catch (error) {
        console.error("❌ [cart-store] DB 삭제 예외:", error);
      }
    }
  },

  /**
   * 장바구니 전체 비우기
   */
  clearCart: async (options) => {
    set({ items: [] });

    if (options?.retailerId && options?.supabaseClient) {
      try {
        await options.supabaseClient
          .from("cart_items")
          .delete()
          .eq("retailer_id", options.retailerId);
      } catch (error) {
        console.error("❌ DB 전체 삭제 예외:", error);
      }
    }
  },
}));