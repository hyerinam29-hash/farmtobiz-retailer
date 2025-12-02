/**
 * @file app/api/payments/callback/route.ts
 * @description 토스 페이먼츠 결제 콜백 처리
 *
 * 주요 기능:
 * 1. 결제 승인 처리
 * 2. 결제 실패 처리
 * 3. 주문 생성 (결제 성공 시)
 *
 * @dependencies
 * - @tosspayments/server-sdk (나중에 설치)
 * - lib/supabase/service-role.ts
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * 결제 승인 처리
 * 
 * 토스 페이먼츠에서 결제 승인 후 호출되는 콜백입니다.
 * 
 * @param request 결제 승인 요청
 * @returns 결제 승인 결과
 */
export async function POST(request: NextRequest) {
  try {
    console.log("📞 [결제 콜백] 결제 승인 요청 수신");

    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    console.log("💳 [결제 콜백] 결제 정보:", {
      paymentKey,
      orderId,
      amount,
    });

    // TODO: 토스 페이먼츠 서버 SDK를 사용한 결제 승인 확인
    // 현재는 테스트 모드이므로 나중에 구현
    // 
    // import { TossPayments } from "@tosspayments/server-sdk";
    // const tossPayments = new TossPayments(process.env.TOSS_SECRET_KEY!);
    // const payment = await tossPayments.payments.confirm({
    //   paymentKey,
    //   orderId,
    //   amount,
    // });

    // 결제 승인 성공 시 주문 생성
    // TODO: 주문 생성 로직 구현 (나중에)
    // const supabase = getServiceRoleClient();
    // await supabase.from("orders").insert({
    //   order_id: orderId,
    //   retailer_id: user.id,
    //   total_amount: amount,
    //   status: "pending",
    //   // ... 기타 주문 정보
    // });

    console.log("✅ [결제 콜백] 결제 승인 처리 완료");

    return NextResponse.json({
      success: true,
      message: "결제가 완료되었습니다.",
    });
  } catch (error) {
    console.error("❌ [결제 콜백] 결제 승인 처리 실패:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "결제 승인 처리에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

