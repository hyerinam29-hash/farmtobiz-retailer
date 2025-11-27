/**
 * @file actions/retailer/confirm-purchase.ts
 * @description 구매 확정 Server Action
 *
 * 배송 완료된 주문에 대해 구매 확정을 처리하고 정산을 트리거합니다.
 *
 * 주요 기능:
 * 1. 주문 상태 확인 (배송 완료 상태만 가능)
 * 2. 중복 구매 확정 방지 (이미 정산이 생성된 경우)
 * 3. 정산 데이터 생성 (settlements 테이블)
 * 4. 정산 계산 (플랫폼 수수료, 도매 정산액)
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 * - lib/supabase/server.ts (createClerkSupabaseClient)
 * - lib/supabase/service-role.ts (getServiceRoleClient)
 * - types/settlement.ts (calculateSettlement)
 *
 * @see {@link PRD.md} - R.MY.03 요구사항
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { calculateSettlement } from "@/types/settlement";

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
 * 배송 완료된 주문에 대해 구매 확정을 처리하고 정산을 생성합니다.
 *
 * @param orderId 주문 ID
 * @returns 구매 확정 결과
 *
 * @throws {Error} 인증 실패, 주문 없음, 상태 오류 등
 */
export async function confirmPurchase(
  orderId: string,
): Promise<ConfirmPurchaseResult> {
  try {
    console.group("✅ [confirm-purchase] 구매 확정 시작");
    console.log("orderId:", orderId);

    // 1. Clerk 인증 확인 및 소매점 권한 확인
    const profile = await getUserProfile();

    if (!profile) {
      console.error("❌ [confirm-purchase] 인증되지 않은 사용자");
      return {
        success: false,
        error: "인증이 필요합니다. 다시 로그인해주세요.",
      };
    }

    if (profile.role !== "retailer") {
      console.error("❌ [confirm-purchase] 소매점 권한 없음", {
        role: profile.role,
      });
      return {
        success: false,
        error: "소매점 권한이 없습니다.",
      };
    }

    const retailers = profile.retailers as Array<{ id: string }> | null;
    if (!retailers || retailers.length === 0) {
      console.error("❌ [confirm-purchase] 소매점 정보 없음");
      return {
        success: false,
        error: "소매점 정보를 찾을 수 없습니다.",
      };
    }

    const currentRetailerId = retailers[0].id;
    console.log("✅ [confirm-purchase] 인증 확인 완료, retailerId:", currentRetailerId);

    // 2. 주문 조회 및 상태 확인
    const supabase = createClerkSupabaseClient();

    console.log("🔍 [confirm-purchase] 주문 조회 시작", {
      orderId,
      retailerId: currentRetailerId,
    });

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, total_amount, wholesaler_id, retailer_id")
      .eq("id", orderId)
      .eq("retailer_id", currentRetailerId)
      .single();

    if (orderError) {
      if (orderError.code === "PGRST116") {
        console.error("❌ [confirm-purchase] 주문 없음", {
          orderId,
          retailerId: currentRetailerId,
          errorCode: orderError.code,
          errorMessage: orderError.message,
        });
        return {
          success: false,
          error: "주문을 찾을 수 없습니다. 주문 ID와 소매점 정보를 확인해주세요.",
        };
      }

      // 🔧 개선: 더 상세한 에러 정보 로깅
      console.error("❌ [confirm-purchase] 주문 조회 오류:", {
        orderId,
        retailerId: currentRetailerId,
        error: orderError,
        errorCode: orderError.code,
        errorMessage: orderError.message,
        errorDetails: orderError.details,
        errorHint: orderError.hint,
      });

      // 사용자에게 더 구체적인 에러 메시지 제공
      const errorMessage =
        orderError.message || orderError.code || "알 수 없는 오류";
      return {
        success: false,
        error: `주문 조회 중 오류가 발생했습니다: ${errorMessage}`,
      };
    }

    console.log("✅ [confirm-purchase] 주문 조회 완료", {
      orderId: order.id,
      status: order.status,
      totalAmount: order.total_amount,
    });

    // 3. 주문 상태 확인 (배송 완료 상태만 가능)
    if (order.status !== "completed") {
      console.error("❌ [confirm-purchase] 배송 완료 상태가 아님", {
        currentStatus: order.status,
      });
      return {
        success: false,
        error: "배송 완료된 주문만 구매 확정할 수 있습니다.",
      };
    }

    // 4. 이미 정산이 생성되었는지 확인 (중복 방지)
    const serviceRoleClient = getServiceRoleClient();

    const { data: existingSettlement, error: settlementCheckError } =
      await serviceRoleClient
        .from("settlements")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle();

    if (settlementCheckError && settlementCheckError.code !== "PGRST116") {
      console.error("❌ [confirm-purchase] 정산 조회 오류:", settlementCheckError);
      return {
        success: false,
        error: "정산 조회 중 오류가 발생했습니다.",
      };
    }

    if (existingSettlement) {
      console.log("⚠️ [confirm-purchase] 이미 정산이 생성됨", {
        settlementId: existingSettlement.id,
      });
      return {
        success: false,
        error: "이미 구매 확정된 주문입니다.",
      };
    }

    // 5. 정산 계산
    const platformFeeRate = 0.05; // 5% 플랫폼 수수료
    const daysToPayout = 7; // D+7 정산 예정일

    const settlementCalculation = calculateSettlement(
      order.total_amount,
      platformFeeRate,
      daysToPayout,
    );

    console.log("✅ [confirm-purchase] 정산 계산 완료", {
      orderAmount: settlementCalculation.order_amount,
      platformFee: settlementCalculation.platform_fee,
      wholesalerAmount: settlementCalculation.wholesaler_amount,
      scheduledPayoutAt: settlementCalculation.scheduled_payout_at,
    });

    // 6. 정산 데이터 생성 (settlements 테이블)
    const { data: newSettlement, error: settlementError } =
      await serviceRoleClient
        .from("settlements")
        .insert({
          order_id: order.id,
          wholesaler_id: order.wholesaler_id,
          order_amount: settlementCalculation.order_amount,
          platform_fee_rate: settlementCalculation.platform_fee_rate,
          platform_fee: settlementCalculation.platform_fee,
          wholesaler_amount: settlementCalculation.wholesaler_amount,
          status: "pending",
          scheduled_payout_at: settlementCalculation.scheduled_payout_at,
        })
        .select("id")
        .single();

    if (settlementError) {
      console.error("❌ [confirm-purchase] 정산 생성 오류:", settlementError);
      return {
        success: false,
        error: "정산 생성 중 오류가 발생했습니다.",
      };
    }

    console.log("✅ [confirm-purchase] 정산 생성 완료", {
      settlementId: newSettlement.id,
    });

    console.groupEnd();

    return {
      success: true,
      settlementId: newSettlement.id,
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

