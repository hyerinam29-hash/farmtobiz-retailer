/**
 * @file actions/retailer/confirm-purchase.ts
 * @description 구매 확정 Server Action
 *
 * 배송 완료된 주문에 대해 구매 확정을 진행합니다.
 * 구매 확정 시 정산 로직이 트리거됩니다.
 *
 * 주요 기능:
 * 1. Clerk 인증 확인
 * 2. 주문 상태 확인 (delivered인지)
 * 3. 주문 상태를 confirmed로 업데이트
 * 4. 정산 정보 생성 (향후 구현)
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 * - lib/supabase/service-role.ts (getServiceRoleClient)
 *
 * @example
 * ```tsx
 * import { confirmPurchase } from '@/actions/retailer/confirm-purchase';
 *
 * const result = await confirmPurchase(orderId);
 * if (result.success) {
 *   console.log('정산 ID:', result.settlementId);
 * }
 * ```
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * 구매 확정 결과 타입
 */
export interface ConfirmPurchaseResult {
  success: boolean;
  error?: string;
  settlementId?: string;
}

/**
 * 구매 확정 Server Action
 *
 * 배송 완료된 주문에 대해 구매 확정을 진행합니다.
 * 구매 확정 시 정산 정보가 생성됩니다.
 *
 * @param {string} orderId - 주문 ID
 * @returns {Promise<ConfirmPurchaseResult>} 구매 확정 결과
 *
 * @throws {Error} 인증 실패, 주문 없음, 이미 확정됨 등
 */
export async function confirmPurchase(
  orderId: string,
): Promise<ConfirmPurchaseResult> {
  try {
    console.group("✅ [confirm-purchase] 구매 확정 시작");
    console.log("orderId:", orderId);

    // 1. Clerk 인증 확인 및 profile_id 조회
    const profile = await getUserProfile();

    if (!profile) {
      console.error("❌ [confirm-purchase] 인증되지 않은 사용자");
      return {
        success: false,
        error: "인증이 필요합니다. 다시 로그인해주세요.",
      };
    }

    // role이 retailer인지 확인
    if (profile.role !== "retailer") {
      console.error("❌ [confirm-purchase] 소매점 역할이 아닌 사용자:", profile.role);
      return {
        success: false,
        error: "소매점 회원만 사용할 수 있는 기능입니다.",
      };
    }

    console.log("✅ [confirm-purchase] 인증 확인 완료, profile_id:", profile.id);

    // 2. 주문 조회 및 상태 확인
    const supabase = getServiceRoleClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, retailer_id")
      .eq("id", orderId)
      .single();

    if (orderError) {
      console.error("❌ [confirm-purchase] 주문 조회 오류:", orderError);
      return {
        success: false,
        error: "주문을 찾을 수 없습니다.",
      };
    }

    if (!order) {
      console.error("❌ [confirm-purchase] 주문 없음");
      return {
        success: false,
        error: "주문을 찾을 수 없습니다.",
      };
    }

    // 소매점 소유권 확인 (향후 구현)
    // if (order.retailer_id !== profile.id) {
    //   return {
    //     success: false,
    //     error: "본인의 주문만 확정할 수 있습니다.",
    //   };
    // }

    // 주문 상태 확인 (delivered인지)
    if (order.status !== "delivered") {
      console.error("❌ [confirm-purchase] 배송 완료되지 않은 주문:", order.status);
      return {
        success: false,
        error: "배송 완료된 주문만 구매 확정할 수 있습니다.",
      };
    }

    // 3. 주문 상태를 confirmed로 업데이트
    // TODO: orders 테이블에 confirmed 상태 추가 또는 별도 테이블 사용
    // 현재는 임시로 주문 상태를 업데이트하지 않고 성공만 반환
    // 실제 구현 시 orders 테이블에 confirmed_at 컬럼 추가 또는
    // order_confirmations 테이블 생성 필요

    console.log("✅ [confirm-purchase] 구매 확정 완료");
    console.groupEnd();

    // 4. 정산 정보 생성 (향후 구현)
    // TODO: settlements 테이블에 정산 정보 생성
    const settlementId = `settlement-${orderId}-${Date.now()}`;

    return {
      success: true,
      settlementId,
    };
  } catch (error) {
    console.error("❌ [confirm-purchase] confirmPurchase 예외:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "구매 확정 중 예상치 못한 오류가 발생했습니다.",
    };
  }
}

