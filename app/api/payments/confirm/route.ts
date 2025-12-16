/**
 * @file app/api/payments/confirm/route.ts
 * @description 토스페이먼츠 결제 승인 API 라우트
 *
 * 주요 기능:
 * 1. 토스페이먼츠 결제 승인 API 호출
 * 2. 주문 정보 조회 (order_number로 order_id 찾기)
 * 3. 정산 데이터 생성 및 저장
 *
 * @dependencies
 * - lib/supabase/service-role.ts
 * - lib/utils/business-days.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { addBusinessDays } from "@/lib/utils/business-days";

/**
 * 결제 승인 처리
 *
 * @param request 결제 승인 요청
 * @returns 결제 승인 결과
 */
export async function POST(request: NextRequest) {
  try {
    console.group("💳 [결제 승인 API] 결제 승인 요청 시작");

    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    console.log("📋 [결제 승인 API] 요청 정보:", {
      paymentKey: paymentKey?.substring(0, 20) + "...",
      orderId,
      amount,
    });

    // 1. 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      console.error("❌ [결제 승인 API] 필수 파라미터 누락:", {
        hasPaymentKey: !!paymentKey,
        hasOrderId: !!orderId,
        hasAmount: !!amount,
      });
      return NextResponse.json(
        {
          error: "필수 파라미터가 누락되었습니다.",
          details: "paymentKey, orderId, amount는 필수입니다.",
        },
        { status: 400 }
      );
    }

    // 2. 토스페이먼츠 결제 승인 API 호출
    const tossSecretKey = process.env.TOSS_SECRET_KEY;
    if (!tossSecretKey) {
      console.error("❌ [결제 승인 API] TOSS_SECRET_KEY 환경 변수 없음");
      return NextResponse.json(
        {
          error: "서버 설정 오류",
          details: "TOSS_SECRET_KEY가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    console.log("🌐 [결제 승인 API] 토스페이먼츠 결제 승인 API 호출 중...");
    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${tossSecretKey}:`).toString("base64")}`,
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
      console.error("❌ [결제 승인 API] 토스페이먼츠 API 호출 실패:", {
        status: tossResponse.status,
        error: tossData,
      });
      return NextResponse.json(
        {
          error: tossData.message || "결제 승인에 실패했습니다.",
          details: tossData.code || "TOSS_API_ERROR",
        },
        { status: tossResponse.status }
      );
    }

    console.log("✅ [결제 승인 API] 토스페이먼츠 결제 승인 성공");

    // 3. 주문 정보 조회 (order_number로 order_id 찾기)
    const supabase = getServiceRoleClient();
    console.log("🔍 [결제 승인 API] 주문 정보 조회 중...", { orderNumber: orderId });

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, wholesaler_id, total_amount, order_number")
      .eq("order_number", orderId)
      .single();

    if (orderError || !order) {
      console.error("❌ [결제 승인 API] 주문 조회 실패:", {
        orderNumber: orderId,
        error: orderError,
      });
      return NextResponse.json(
        {
          error: "주문을 찾을 수 없습니다.",
          details: `주문 번호 ${orderId}에 해당하는 주문이 없습니다.`,
        },
        { status: 404 }
      );
    }

    console.log("✅ [결제 승인 API] 주문 정보 조회 완료:", {
      orderId: order.id,
      orderNumber: order.order_number,
      wholesalerId: order.wholesaler_id,
      totalAmount: order.total_amount,
    });

    // 4. 주문 상태 업데이트 (payment_key, paid_at 추가)
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_key: paymentKey,
        paid_at: new Date().toISOString(),
        status: "confirmed", // 결제 완료 상태로 변경
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("❌ [결제 승인 API] 주문 업데이트 실패:", updateError);
      return NextResponse.json(
        {
          error: "주문 업데이트에 실패했습니다.",
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    console.log("✅ [결제 승인 API] 주문 상태 업데이트 완료");

    // 5. 정산 데이터 생성
    const platformFeeRate = parseFloat(
      process.env.PLATFORM_FEE_RATE || "0.05"
    );
    if (isNaN(platformFeeRate) || platformFeeRate < 0 || platformFeeRate > 1) {
      console.error("❌ [결제 승인 API] 잘못된 PLATFORM_FEE_RATE:", platformFeeRate);
      return NextResponse.json(
        {
          error: "서버 설정 오류",
          details: "PLATFORM_FEE_RATE가 올바르지 않습니다. (0~1 사이의 값이어야 합니다.)",
        },
        { status: 500 }
      );
    }

    const orderAmount = order.total_amount;
    const platformFee = Math.floor(orderAmount * platformFeeRate);
    const wholesalerAmount = orderAmount - platformFee;

    // 영업일 기준 +7일 계산
    const scheduledPayoutAt = addBusinessDays(new Date(), 7);

    console.log("💰 [결제 승인 API] 정산 데이터 계산:", {
      orderAmount,
      platformFeeRate,
      platformFee,
      wholesalerAmount,
      scheduledPayoutAt: scheduledPayoutAt.toISOString(),
    });

    // 6. 정산 데이터 저장
    const { data: settlement, error: settlementError } = await supabase
      .from("settlements")
      .insert({
        order_id: order.id,
        wholesaler_id: order.wholesaler_id,
        order_amount: orderAmount,
        platform_fee_rate: platformFeeRate,
        platform_fee: platformFee,
        wholesaler_amount: wholesalerAmount,
        status: "pending",
        scheduled_payout_at: scheduledPayoutAt.toISOString(),
        completed_at: null,
      })
      .select()
      .single();

    if (settlementError || !settlement) {
      console.error("❌ [결제 승인 API] 정산 데이터 저장 실패:", settlementError);
      return NextResponse.json(
        {
          error: "정산 데이터 저장에 실패했습니다.",
          details: settlementError?.message || "알 수 없는 오류",
        },
        { status: 500 }
      );
    }

    console.log("✅ [결제 승인 API] 정산 데이터 저장 완료:", {
      settlementId: settlement.id,
    });

    // 7. 결제 데이터 저장 (payments 테이블)
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        order_id: order.id,
        settlement_id: settlement.id,
        method: tossData.method || "CARD",
        amount: orderAmount,
        payment_key: paymentKey,
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError || !payment) {
      console.error("❌ [결제 승인 API] 결제 데이터 저장 실패:", paymentError);
      // 정산 데이터는 이미 저장되었으므로 경고만 출력
      console.warn("⚠️ [결제 승인 API] 결제 데이터 저장 실패했지만 정산은 완료됨");
    } else {
      console.log("✅ [결제 승인 API] 결제 데이터 저장 완료:", {
        paymentId: payment.id,
      });
    }

    console.log("✅ [결제 승인 API] 결제 승인 처리 완료:", {
      orderId: order.id,
      settlementId: settlement.id,
      paymentId: payment?.id,
    });
    console.groupEnd();

    return NextResponse.json({
      success: true,
      orderId: order.id,
      settlementId: settlement.id,
      paymentId: payment?.id,
      message: "결제 완료 및 정산 생성 완료",
    });
  } catch (error) {
    console.error("❌ [결제 승인 API] 예외 발생:", error);
    console.groupEnd();

    return NextResponse.json(
      {
        error: "결제 승인 처리 중 오류가 발생했습니다.",
        details:
          process.env.NODE_ENV === "development"
            ? (error instanceof Error ? error.stack : String(error))
            : undefined,
      },
      { status: 500 }
    );
  }
}

