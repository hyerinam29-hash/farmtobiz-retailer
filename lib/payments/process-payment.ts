/**
 * @file lib/payments/process-payment.ts
 * @description 결제 승인 후 DB 저장 공통 함수
 *
 * 토스페이먼츠 결제 승인 후 orders, payments, settlements 테이블에 데이터를 저장합니다.
 * 웹훅 콜백과 결제 승인 API에서 재사용됩니다.
 *
 * 주요 기능:
 * 1. 주문 조회 및 검증
 * 2. 주문 상태 업데이트 (payment_key, paid_at)
 * 3. 정산 데이터 생성 (settlements 테이블)
 * 4. 결제 데이터 저장 (payments 테이블)
 *
 * @dependencies
 * - lib/supabase/service-role.ts
 * - types/settlement.ts (calculateSettlement)
 */

import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { calculateSettlement } from "@/types/settlement";

export interface ProcessPaymentAfterApprovalParams {
  orderId: string; // 주문 ID (order_number)
  paymentKey: string;
  approvedAt: string; // ISO 8601 형식 (예: "2025-12-16T05:06:35.687Z")
  totalAmount: number;
  method?: string; // 결제 수단 (예: "카드", "계좌이체")
}

export interface ProcessPaymentAfterApprovalResult {
  success: boolean;
  orderId?: string;
  settlementId?: string;
  paymentId?: string;
  error?: string;
}

/**
 * 결제 승인 후 DB 저장 처리
 *
 * @param params 결제 승인 정보
 * @returns 처리 결과
 */
export async function processPaymentAfterApproval(
  params: ProcessPaymentAfterApprovalParams
): Promise<ProcessPaymentAfterApprovalResult> {
  try {
    console.group("💳 [결제 처리] 결제 승인 후 DB 저장 시작");
    console.log("결제 정보:", {
      orderId: params.orderId,
      paymentKey: params.paymentKey,
      totalAmount: params.totalAmount,
      method: params.method,
    });

    const supabase = getServiceRoleClient();

    // 1. 주문 조회 (order_number로 조회)
    const { data: orders, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, wholesaler_id, total_amount, payment_key")
      .eq("order_number", params.orderId)
      .limit(1);

    if (orderError) {
      console.error("❌ 주문 조회 실패:", orderError);
      console.groupEnd();
      return {
        success: false,
        error: `주문을 찾을 수 없습니다: ${orderError.message}`,
      };
    }

    if (!orders || orders.length === 0) {
      console.error("❌ 주문 없음:", params.orderId);
      console.groupEnd();
      return {
        success: false,
        error: `주문을 찾을 수 없습니다: ${params.orderId}`,
      };
    }

    const order = orders[0];

    // 중복 처리 방지: 이미 payment_key가 설정되어 있으면 스킵
    if (order.payment_key && order.payment_key === params.paymentKey) {
      console.log("⚠️ 이미 처리된 결제입니다:", order.payment_key);
      console.groupEnd();
      
      // 기존 payments와 settlements 조회
      const { data: existingPayments } = await supabase
        .from("payments")
        .select("id, settlement_id")
        .eq("order_id", order.id)
        .limit(1);

      if (existingPayments && existingPayments.length > 0) {
        return {
          success: true,
          orderId: order.id,
          settlementId: existingPayments[0].settlement_id,
          paymentId: existingPayments[0].id,
        };
      }
    }

    console.log("✅ 주문 조회 성공:", {
      orderId: order.id,
      orderNumber: order.order_number,
      wholesalerId: order.wholesaler_id,
      totalAmount: order.total_amount,
    });

    // 2. 주문 상태 업데이트 (payment_key, paid_at)
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_key: params.paymentKey,
        paid_at: params.approvedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("❌ 주문 업데이트 실패:", updateError);
      console.groupEnd();
      return {
        success: false,
        error: `주문 업데이트에 실패했습니다: ${updateError.message}`,
      };
    }

    console.log("✅ 주문 업데이트 완료");

    // 3. 정산 데이터 생성
    const platformFeeRate = 0.05; // 5% 플랫폼 수수료
    const settlementCalc = calculateSettlement(
      order.total_amount,
      platformFeeRate,
      7 // D+7
    );

    const { data: settlement, error: settlementError } = await supabase
      .from("settlements")
      .insert({
        order_id: order.id,
        wholesaler_id: order.wholesaler_id,
        order_amount: settlementCalc.order_amount,
        platform_fee_rate: settlementCalc.platform_fee_rate,
        platform_fee: settlementCalc.platform_fee,
        wholesaler_amount: settlementCalc.wholesaler_amount,
        status: "pending",
        scheduled_payout_at: settlementCalc.scheduled_payout_at,
      })
      .select("id")
      .single();

    if (settlementError) {
      console.error("❌ 정산 생성 실패:", settlementError);
      console.groupEnd();
      return {
        success: false,
        error: `정산 생성에 실패했습니다: ${settlementError.message}`,
      };
    }

    console.log("✅ 정산 생성 완료:", {
      settlementId: settlement.id,
      orderAmount: settlementCalc.order_amount,
      platformFee: settlementCalc.platform_fee,
      wholesalerAmount: settlementCalc.wholesaler_amount,
    });

    // 4. 결제 데이터 저장 (payments 테이블)
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        order_id: order.id,
        settlement_id: settlement.id,
        method: params.method || "카드",
        amount: params.totalAmount,
        payment_key: params.paymentKey,
        status: "paid",
        paid_at: params.approvedAt,
      })
      .select("id")
      .single();

    if (paymentError) {
      console.error("❌ 결제 데이터 저장 실패:", paymentError);
      console.groupEnd();
      return {
        success: false,
        error: `결제 데이터 저장에 실패했습니다: ${paymentError.message}`,
      };
    }

    console.log("✅ 결제 데이터 저장 완료:", {
      paymentId: payment.id,
      method: params.method || "카드",
      amount: params.totalAmount,
    });

    console.log("✅ [결제 처리] 모든 DB 저장 완료");
    console.groupEnd();

    return {
      success: true,
      orderId: order.id,
      settlementId: settlement.id,
      paymentId: payment.id,
    };
  } catch (error) {
    console.error("❌ [결제 처리] 예외 발생:", error);
    console.groupEnd();
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "결제 처리 중 예상치 못한 오류가 발생했습니다.",
    };
  }
}