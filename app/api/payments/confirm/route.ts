/**
 * @file app/api/payments/confirm/route.ts
 * @description 토스페이먼츠 결제 승인 API (외부 웹훅/콜백용)
 *
 * 주요 용도:
 * - 외부 서비스에서 호출하는 웹훅 엔드포인트
 * - 토스페이먼츠 콜백 처리
 *
 * 참고: 클라이언트 결제 승인은 Server Action을 사용합니다.
 * @see actions/retailer/confirm-payment.ts
 *
 * 주요 기능:
 * 1. 토스페이먼츠 결제 승인 API 호출
 * 2. 결제 승인 성공 시 DB 저장 (orders, payments, settlements)
 * 3. 에러 처리 및 로깅
 *
 * @dependencies
 * - lib/payments/process-payment.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { processPaymentAfterApproval } from "@/lib/payments/process-payment";

/**
 * 결제 승인 API
 *
 * 토스페이먼츠 결제 승인 API를 호출하고 DB에 저장합니다.
 *
 * @param request 결제 승인 요청
 * @returns 결제 승인 결과
 */
export async function POST(request: NextRequest) {
  try {
    console.group("💳 [결제 승인 API] 요청 수신");
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    // 1. 요청 본문 검증
    if (!paymentKey || !orderId || !amount) {
      console.error("❌ 필수 파라미터 누락:", { paymentKey, orderId, amount });
      console.groupEnd();
      return NextResponse.json(
        {
          success: false,
          error: "필수 파라미터가 누락되었습니다. (paymentKey, orderId, amount)",
        },
        { status: 400 }
      );
    }

    console.log("📋 결제 승인 요청:", {
      paymentKey,
      orderId,
      amount,
    });

    // 2. 토스페이먼츠 결제 승인 API 호출
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      console.error("❌ TOSS_SECRET_KEY 환경 변수 없음");
      console.groupEnd();
      return NextResponse.json(
        {
          success: false,
          error: "서버 설정 오류: 결제 승인 키가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    // Basic 인증 헤더 생성 (secretKey: 형식으로 base64 인코딩)
    const authHeader = Buffer.from(`${secretKey}:`).toString("base64");

    console.log("🔐 토스페이먼츠 결제 승인 API 호출 시작");

    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    const tossData = await tossResponse.json();

    if (!tossResponse.ok) {
      console.error("❌ 토스페이먼츠 결제 승인 실패:", {
        status: tossResponse.status,
        error: tossData,
      });
      console.groupEnd();
      return NextResponse.json(
        {
          success: false,
          error: tossData.message || "결제 승인에 실패했습니다.",
          details:
            process.env.NODE_ENV === "development"
              ? JSON.stringify(tossData)
              : undefined,
        },
        { status: tossResponse.status }
      );
    }

    console.log("✅ 토스페이먼츠 결제 승인 성공:", {
      paymentKey: tossData.paymentKey,
      orderId: tossData.orderId,
      status: tossData.status,
      approvedAt: tossData.approvedAt,
      method: tossData.method,
    });

    // 3. DB 저장 (processPaymentAfterApproval 호출)
    const dbResult = await processPaymentAfterApproval({
      orderId: tossData.orderId || orderId, // 토스페이먼츠 응답의 orderId 우선 사용
      paymentKey: tossData.paymentKey || paymentKey,
      approvedAt: tossData.approvedAt || new Date().toISOString(),
      totalAmount: tossData.totalAmount || amount,
      method: tossData.method || "카드",
    });

    if (!dbResult.success) {
      console.error("❌ DB 저장 실패:", dbResult.error);
      console.groupEnd();
      return NextResponse.json(
        {
          success: false,
          error: dbResult.error || "DB 저장에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    console.log("✅ 결제 승인 및 DB 저장 완료:", {
      orderId: dbResult.orderId,
      settlementId: dbResult.settlementId,
      paymentId: dbResult.paymentId,
    });

    console.groupEnd();

    return NextResponse.json({
      success: true,
      orderId: dbResult.orderId,
      settlementId: dbResult.settlementId,
      paymentId: dbResult.paymentId,
      message: "결제 승인 및 저장이 완료되었습니다.",
    });
  } catch (error) {
    console.error("❌ [결제 승인 API] 예외 발생:", error);
    console.groupEnd();
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "결제 승인 처리 중 예상치 못한 오류가 발생했습니다.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
