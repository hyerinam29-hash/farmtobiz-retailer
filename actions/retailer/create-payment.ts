/**
 * @file actions/retailer/create-payment.ts
 * @description 결제 요청 생성 Server Action
 *
 * 주요 기능:
 * 1. 주문 데이터 검증
 * 2. 결제 요청 정보 생성
 * 3. 주문 ID 생성
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";

export interface CreatePaymentRequest {
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
  }>;
  deliveryOption: "dawn" | "normal";
  deliveryTime?: string;
  deliveryNote?: string;
  totalAmount: number;
}

export interface CreatePaymentResult {
  success: boolean;
  orderId?: string;
  orderName?: string;
  amount?: number;
  error?: string;
}

/**
 * 결제 요청 생성
 * 
 * @param request 결제 요청 정보
 * @returns 결제 요청 결과
 */
export async function createPayment(
  request: CreatePaymentRequest
): Promise<CreatePaymentResult> {
  try {
    console.log("💳 [결제] 결제 요청 생성 시작:", {
      itemsCount: request.items.length,
      totalAmount: request.totalAmount,
    });

    // 1. 인증 확인
    const user = await getUserProfile();
    if (!user) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    // 2. 데이터 검증
    if (!request.items || request.items.length === 0) {
      return {
        success: false,
        error: "주문할 상품이 없습니다.",
      };
    }

    if (request.totalAmount <= 0) {
      return {
        success: false,
        error: "결제 금액이 올바르지 않습니다.",
      };
    }

    // 3. 주문 ID 생성 (형식: ORD-YYYYMMDD-HHMMSS-XXX)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "");
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    const orderId = `ORD-${dateStr}-${timeStr}-${randomStr}`;

    // 4. 주문명 생성 (첫 번째 상품명 + 외 N건)
    // TODO: 나중에 실제 상품명으로 교체
    const firstProductName = "상품";
    const orderName =
      request.items.length === 1
        ? firstProductName
        : `${firstProductName} 외 ${request.items.length - 1}건`;

    console.log("✅ [결제] 결제 요청 생성 완료:", {
      orderId,
      orderName,
      amount: request.totalAmount,
    });

    return {
      success: true,
      orderId,
      orderName,
      amount: request.totalAmount,
    };
  } catch (error) {
    console.error("❌ [결제] 결제 요청 생성 실패:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "결제 요청 생성에 실패했습니다.",
    };
  }
}

