/**
 * @file actions/retailer/confirm-payment.ts
 * @description 결제 승인 Server Action
 *
 * 주요 기능:
 * 1. 토스페이먼츠 결제 승인 API 직접 호출
 * 2. 결제 승인 후 DB 저장 (orders, settlements, payments)
 *
 * @dependencies
 * - lib/payments/process-payment.ts (DB 저장 로직)
 */

"use server";

import { processPaymentAfterApproval } from "@/lib/payments/process-payment";

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
 * 토스페이먼츠 결제 승인 API를 직접 호출하고 DB에 저장합니다.
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
      console.groupEnd();
      return {
        success: false,
        error: "필수 파라미터가 누락되었습니다.",
        details: "paymentKey, orderId, amount는 필수입니다.",
      };
    }

    // 토스페이먼츠 Secret Key 검증
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      console.error("❌ [결제 승인] TOSS_SECRET_KEY 환경 변수 없음");
      console.groupEnd();
      return {
        success: false,
        error: "서버 설정 오류: 결제 승인 키가 설정되지 않았습니다.",
      };
    }

    // 토스페이먼츠 결제 승인 API 직접 호출
    const authHeader = Buffer.from(`${secretKey}:`).toString("base64");

    console.log("🔐 [결제 승인] 토스페이먼츠 API 호출 시작");

    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey: request.paymentKey,
          orderId: request.orderId,
          amount: request.amount,
        }),
      }
    );

    const tossData = await tossResponse.json();

    if (!tossResponse.ok) {
      console.error("❌ [결제 승인] 토스페이먼츠 API 실패:", {
        status: tossResponse.status,
        error: tossData,
      });
      console.groupEnd();
      return {
        success: false,
        error: tossData.message || "결제 승인에 실패했습니다.",
        details:
          process.env.NODE_ENV === "development"
            ? JSON.stringify(tossData)
            : undefined,
      };
    }

    console.log("✅ [결제 승인] 토스페이먼츠 승인 성공:", {
      paymentKey: tossData.paymentKey,
      orderId: tossData.orderId,
      status: tossData.status,
      approvedAt: tossData.approvedAt,
      method: tossData.method,
    });

    // DB 저장 처리
    const dbResult = await processPaymentAfterApproval({
      orderId: tossData.orderId || request.orderId,
      paymentKey: tossData.paymentKey || request.paymentKey,
      approvedAt: tossData.approvedAt || new Date().toISOString(),
      totalAmount: tossData.totalAmount || request.amount,
      method: tossData.method || "카드",
    });

    if (!dbResult.success) {
      console.error("❌ [결제 승인] DB 저장 실패:", dbResult.error);
      console.groupEnd();
      return {
        success: false,
        error: dbResult.error || "DB 저장에 실패했습니다.",
      };
    }

    console.log("✅ [결제 승인] 결제 승인 및 DB 저장 완료:", {
      orderId: dbResult.orderId,
      settlementId: dbResult.settlementId,
      paymentId: dbResult.paymentId,
    });
    console.groupEnd();

    return {
      success: true,
      orderId: dbResult.orderId,
      settlementId: dbResult.settlementId,
      paymentId: dbResult.paymentId,
      message: "결제 완료 및 정산 생성 완료",
    };
  } catch (error) {
    console.error("❌ [결제 승인] 예외 발생:", error);
    console.groupEnd();

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "결제 승인 처리 중 오류가 발생했습니다.",
      details:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.stack
            : String(error)
          : undefined,
    };
  }
}

