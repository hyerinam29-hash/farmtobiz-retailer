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
   * 장바구니에 상품 추가 (UPSERT 방식)
   */
  addToCart: async (input, options) => {
    const inputQuantity = Number(input.quantity);

    if (isNaN(inputQuantity) || inputQuantity <= 0) {
      console.error("❌ [cart-store] 잘못된 수량:", inputQuantity);
      return;
    }

    // DB에 UPSERT 먼저 수행 (단일 진실의 원천)
    if (options?.retailerId && options?.supabaseClient) {
      try {
        // 1. DB에서 기존 항목 조회
        let query = options.supabaseClient
          .from("cart_items")
          .select("id, quantity")
          .eq("retailer_id", options.retailerId)
          .eq("product_id", input.product_id);

        // variant_id 조건 처리 (중요: NULL은 .eq()가 아니라 .is() 사용)
        if (input.variant_id) {
          query = query.eq("variant_id", input.variant_id);
        } else {
          query = query.is("variant_id", null);
        }

        const { data: existingItem } = await query.maybeSingle();

        // 2. 수량 계산
        const newQuantity = existingItem
          ? existingItem.quantity + inputQuantity
          : inputQuantity;

        // 3. UPSERT 수행
        const { error } = await options.supabaseClient
          .from("cart_items")
          .upsert({
            retailer_id: options.retailerId,
            product_id: input.product_id,
            variant_id: input.variant_id || null,
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: "retailer_id,product_id,variant_id",
          });

        if (error) {
          console.error("❌ [cart-store] DB UPSERT 실패:", error);
          return;
        }

        console.log("✅ [cart-store] DB UPSERT 성공:", { product_id: input.product_id, quantity: newQuantity });

        // 4. 메모리 업데이트 (DB 결과 기반)
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) =>
            item.product_id === input.product_id &&
            item.variant_id === input.variant_id
        );

        if (existingItemIndex !== -1) {
          // 기존 항목 수량 업데이트
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: newQuantity,
            unit_price: input.unit_price,
            delivery_method: input.delivery_method,
            shipping_fee: input.shipping_fee,
            shipping_fee_total: input.shipping_fee * newQuantity,
            moq: input.moq,
            stock_quantity: input.stock_quantity,
          };
          set({ items: updatedItems });
        } else {
          // 새 항목 추가
          const newItem: CartItem = {
            id: generateCartItemId(),
            ...input,
            quantity: newQuantity,
            shipping_fee_total: input.shipping_fee * newQuantity,
          };
          set({ items: [...items, newItem] });
        }
      } catch (error) {
        console.error("❌ [cart-store] UPSERT 예외:", error);
      }
    } else {
      // DB 연결이 없는 경우 메모리만 업데이트 (폴백)
      console.warn("⚠️ [cart-store] DB 연결 없음, 메모리만 업데이트");
      const { items } = get();
      const existingItemIndex = items.findIndex(
        (item) =>
          item.product_id === input.product_id &&
          item.variant_id === input.variant_id
      );

      if (existingItemIndex !== -1) {
        const existingItem = items[existingItemIndex];
        const newQuantity = Number(existingItem.quantity) + inputQuantity;

        const updatedItems = [...items];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          shipping_fee_total: input.shipping_fee * newQuantity,
        };
        set({ items: updatedItems });
      } else {
        const newItem: CartItem = {
          id: generateCartItemId(),
          ...input,
          quantity: inputQuantity,
          shipping_fee_total: input.shipping_fee * inputQuantity,
        };
        set({ items: [...items, newItem] });
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
        let query = options.supabaseClient
          .from("cart_items")
          .update({
            quantity: input.quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("retailer_id", options.retailerId)
          .eq("product_id", existingItem.product_id);

        // variant_id 조건 처리 (중요: NULL은 .eq()가 아니라 .is() 사용)
        if (existingItem.variant_id) {
          query = query.eq("variant_id", existingItem.variant_id);
        } else {
          query = query.is("variant_id", null);
        }

        await query;
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