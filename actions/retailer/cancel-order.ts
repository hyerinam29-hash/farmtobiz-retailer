/**
 * @file actions/retailer/cancel-order.ts
 * @description 주문 취소 Server Action
 *
 * 주요 기능:
 * 1. 준비 중(pending, confirmed) 상태의 주문을 취소 상태로 변경
 * 2. 재고 복구 (주문 수량만큼 다시 증가)
 * 3. 취소 가능 상태 검증
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 * - lib/supabase/service-role.ts (getServiceRoleClient)
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface CancelOrderRequest {
  orderId: string;
}

export interface CancelOrderResult {
  success: boolean;
  error?: string;
}

/**
 * 주문 취소
 * 
 * 준비 중(pending, confirmed) 상태의 주문만 취소 가능합니다.
 * 
 * @param request 주문 취소 요청
 * @returns 주문 취소 결과
 */
export async function cancelOrder(
  request: CancelOrderRequest
): Promise<CancelOrderResult> {
  try {
    console.group("🚫 [주문 취소] 주문 취소 시작");
    console.log("요청 정보:", { orderId: request.orderId });

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

    const supabase = getServiceRoleClient();

    // 2. 주문 정보 조회
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, order_number, status, retailer_id, product_id, quantity")
      .eq("id", request.orderId)
      .single();

    if (fetchError || !order) {
      console.error("❌ 주문 조회 실패:", fetchError);
      console.groupEnd();
      return {
        success: false,
        error: "주문을 찾을 수 없습니다.",
      };
    }

    console.log("📦 주문 정보:", {
      orderNumber: order.order_number,
      status: order.status,
      quantity: order.quantity,
    });

    // 3. 권한 확인 (본인 주문인지)
    if (order.retailer_id !== retailerId) {
      console.error("❌ 권한 없음: 다른 소매점의 주문");
      console.groupEnd();
      return {
        success: false,
        error: "주문을 취소할 권한이 없습니다.",
      };
    }

    // 4. 취소 가능 상태 확인 (pending, confirmed만 취소 가능)
    if (!["pending", "confirmed"].includes(order.status)) {
      console.error("❌ 취소 불가 상태:", order.status);
      console.groupEnd();
      return {
        success: false,
        error: "이미 배송이 시작되었거나 완료된 주문은 취소할 수 없습니다.",
      };
    }

    // 5. 주문 상태를 cancelled로 변경
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", request.orderId);

    if (updateError) {
      console.error("❌ 주문 상태 업데이트 실패:", updateError);
      console.groupEnd();
      return {
        success: false,
        error: `주문 취소에 실패했습니다: ${updateError.message}`,
      };
    }

    console.log("✅ 주문 상태 cancelled로 변경 완료");

    // 6. 재고 복구
    const { error: stockError } = await supabase.rpc("increment_stock", {
      p_product_id: order.product_id,
      p_quantity: order.quantity,
    });

    // RPC 함수가 없을 경우 직접 업데이트
    if (stockError) {
      console.warn("⚠️ RPC 함수 없음, 직접 재고 복구:", stockError.message);
      
      // 현재 재고 조회
      const { data: product, error: fetchProductError } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", order.product_id)
        .single();

      if (!fetchProductError && product) {
        const newStock = product.stock_quantity + order.quantity;
        await supabase
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("id", order.product_id);
        
        console.log(`✅ 재고 복구 완료: ${product.stock_quantity} → ${newStock}`);
      }
    } else {
      console.log("✅ 재고 복구 완료 (RPC)");
    }

    console.log("✅ 주문 취소 완료:", order.order_number);
    console.groupEnd();

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ [주문 취소] 주문 취소 실패:", error);
    console.groupEnd();
    return {
      success: false,
      error: "주문 취소 중 오류가 발생했습니다.",
    };
  }
}

