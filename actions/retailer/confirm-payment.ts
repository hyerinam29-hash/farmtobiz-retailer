/**
 * @file actions/retailer/confirm-payment.ts
 * @description 결제 승인 Server Action
 *
 * 주요 기능:
 * 1. 토스페이먼츠 결제 승인 API 호출
 * 2. 결제 승인 후 DB 저장 (orders, settlements, payments)
 *
 * @dependencies
 * - /api/payments/confirm (결제 승인 API)
 */

"use server";

export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface ConfirmPaymentResult {
  success: boolean;
  orderId?: string;
  settlementId?: string;
  paymentId?: string;
  message?: string;
  error?: string;
  details?: string;
}

/**
 * 결제 승인 처리
 * 
 * 토스페이먼츠 결제 승인 API를 호출하고 DB에 저장합니다.
 * 
 * @param request 결제 승인 요청 정보
 * @returns 결제 승인 결과
 */
export async function confirmPayment(
  request: ConfirmPaymentRequest
): Promise<ConfirmPaymentResult> {
  try {
    console.group("💳 [결제 승인] 결제 승인 요청 시작");
    console.log("📋 [결제 승인] 요청 정보:", {
      paymentKey: request.paymentKey.substring(0, 20) + "...",
      orderId: request.orderId,
      amount: request.amount,
    });

    // 필수 파라미터 검증
    if (!request.paymentKey || !request.orderId || !request.amount) {
      console.error("❌ [결제 승인] 필수 파라미터 누락:", {
        hasPaymentKey: !!request.paymentKey,
        hasOrderId: !!request.orderId,
        hasAmount: !!request.amount,
      });
      return {
        success: false,
        error: "필수 파라미터가 누락되었습니다.",
        details: "paymentKey, orderId, amount는 필수입니다.",
      };
    }

    // 결제 승인 API 호출
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/confirm`;
    
    console.log("🌐 [결제 승인] API 호출:", {
      url: apiUrl,
      method: "POST",
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey: request.paymentKey,
        orderId: request.orderId,
        amount: request.amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ [결제 승인] API 호출 실패:", {
        status: response.status,
        statusText: response.statusText,
        error: data.error,
        details: data.details,
      });
      return {
        success: false,
        error: data.error || "결제 승인에 실패했습니다.",
        details: data.details,
      };
    }

    console.log("✅ [결제 승인] 결제 승인 성공:", {
      orderId: data.orderId,
      settlementId: data.settlementId,
      paymentId: data.paymentId,
      message: data.message,
    });
    console.groupEnd();

    return {
      success: true,
      orderId: data.orderId,
      settlementId: data.settlementId,
      paymentId: data.paymentId,
      message: data.message || "결제 완료 및 정산 생성 완료",
    };
  } catch (error) {
    console.error("❌ [결제 승인] 예외 발생:", error);
    console.groupEnd();
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "결제 승인 처리 중 오류가 발생했습니다.",
      details: process.env.NODE_ENV === "development" 
        ? (error instanceof Error ? error.stack : String(error))
        : undefined,
    };
  }
}

