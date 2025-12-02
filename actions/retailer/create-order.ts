/**
 * @file actions/retailer/create-order.ts
 * @description 결제 성공 후 주문 생성 Server Action
 *
 * 주요 기능:
 * 1. 결제 성공 후 주문 데이터 DB 저장
 * 2. 각 상품별로 별도 주문(order) 생성
 * 3. 재고 차감
 * 4. 장바구니 비우기 (클라이언트에서 처리)
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 * - lib/supabase/service-role.ts (getServiceRoleClient)
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name: string;
  wholesaler_id: string;
  shipping_fee: number;
}

export interface CreateOrderRequest {
  paymentKey: string;
  orderId: string; // 결제 요청 시 생성된 주문 ID (주문 그룹 식별용)
  items: OrderItem[];
  deliveryOption: "dawn" | "normal";
  deliveryTime?: string;
  deliveryNote?: string;
  deliveryAddress: string;
  totalAmount: number;
}

export interface CreateOrderResult {
  success: boolean;
  orderNumbers?: string[];
  error?: string;
}

/**
 * 결제 성공 후 주문 생성
 * 
 * 각 상품별로 별도 주문(order)을 생성합니다.
 * 
 * @param request 주문 생성 요청
 * @returns 주문 생성 결과
 */
export async function createOrder(
  request: CreateOrderRequest
): Promise<CreateOrderResult> {
  try {
    console.group("📦 [주문] 주문 생성 시작");
    console.log("요청 정보:", {
      paymentKey: request.paymentKey,
      orderId: request.orderId,
      itemsCount: request.items.length,
      totalAmount: request.totalAmount,
    });

    // 1. 인증 확인
    const profile = await getUserProfile();
    if (!profile) {
      console.error("❌ 인증 실패: 로그인 필요");
      console.groupEnd();
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    // 소매점 정보 확인
    const retailers = profile.retailers as Array<{ id: string }> | null;
    if (!retailers || retailers.length === 0) {
      console.error("❌ 소매점 정보 없음");
      console.groupEnd();
      return {
        success: false,
        error: "소매점 정보가 없습니다.",
      };
    }

    const retailerId = retailers[0].id;
    console.log("✅ 인증 확인:", { retailerId });

    // 2. 기본 검증
    if (!request.paymentKey || !request.orderId) {
      console.error("❌ 결제 정보 누락");
      console.groupEnd();
      return {
        success: false,
        error: "결제 정보가 누락되었습니다.",
      };
    }

    if (!request.items || request.items.length === 0) {
      console.error("❌ 주문 상품 없음");
      console.groupEnd();
      return {
        success: false,
        error: "주문할 상품이 없습니다.",
      };
    }

    const supabase = getServiceRoleClient();

    // 3. 중복 주문 확인 (동일 paymentKey로 이미 주문이 있는지)
    const { data: existingOrders, error: checkError } = await supabase
      .from("orders")
      .select("id, order_number")
      .eq("payment_key", request.paymentKey)
      .limit(1);

    if (checkError) {
      console.error("❌ 중복 주문 확인 실패:", checkError);
      // 에러가 있어도 계속 진행 (중복 체크 실패가 주문 생성을 막지 않도록)
    }

    if (existingOrders && existingOrders.length > 0) {
      console.log("⚠️ 이미 생성된 주문이 있음:", existingOrders[0].order_number);
      console.groupEnd();
      return {
        success: true,
        orderNumbers: [existingOrders[0].order_number],
      };
    }

    // 4. 각 상품별로 주문 생성
    const orderNumbers: string[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < request.items.length; i++) {
      const item = request.items[i];
      
      // 주문 번호 생성 (형식: ORD-YYYYMMDD-XXX-N)
      // 같은 결제에서 여러 상품이면 -1, -2 등 붙임
      const orderNumber = request.items.length === 1
        ? request.orderId
        : `${request.orderId}-${i + 1}`;

      const itemTotalAmount = item.unit_price * item.quantity + item.shipping_fee;

      // 주문 데이터 생성
      const orderData = {
        retailer_id: retailerId,
        product_id: item.product_id,
        wholesaler_id: item.wholesaler_id,
        order_number: orderNumber,
        quantity: item.quantity,
        unit_price: item.unit_price,
        shipping_fee: item.shipping_fee,
        total_amount: itemTotalAmount,
        delivery_address: request.deliveryAddress,
        request_note: request.deliveryNote || null,
        delivery_option: request.deliveryOption,
        delivery_time: request.deliveryTime || null,
        payment_key: request.paymentKey,
        paid_at: now,
        status: "pending",
      };

      console.log(`📝 주문 ${i + 1}/${request.items.length} 생성:`, {
        orderNumber,
        productName: item.product_name,
        quantity: item.quantity,
        totalAmount: itemTotalAmount,
      });

      // 주문 삽입
      const { error: insertError } = await supabase
        .from("orders")
        .insert(orderData);

      if (insertError) {
        console.error(`❌ 주문 ${orderNumber} 생성 실패:`, insertError);
        console.groupEnd();
        return {
          success: false,
          error: `주문 생성에 실패했습니다: ${insertError.message}`,
        };
      }

      orderNumbers.push(orderNumber);

      // 5. 재고 차감
      const { error: stockError } = await supabase.rpc("decrement_stock", {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      });

      // RPC 함수가 없을 경우 직접 업데이트
      if (stockError) {
        console.warn("⚠️ RPC 함수 없음, 직접 재고 차감:", stockError.message);
        
        // 현재 재고 조회
        const { data: product, error: fetchError } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", item.product_id)
          .single();

        if (!fetchError && product) {
          const newStock = Math.max(0, product.stock_quantity - item.quantity);
          await supabase
            .from("products")
            .update({ stock_quantity: newStock })
            .eq("id", item.product_id);
          
          console.log(`✅ 재고 차감 완료: ${product.stock_quantity} → ${newStock}`);
        }
      }
    }

    console.log("✅ 모든 주문 생성 완료:", orderNumbers);
    console.groupEnd();

    return {
      success: true,
      orderNumbers,
    };
  } catch (error) {
    console.error("❌ [주문] 주문 생성 실패:", error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : "주문 생성에 실패했습니다.",
    };
  }
}

