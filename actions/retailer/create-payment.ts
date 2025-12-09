/**
 * @file actions/retailer/create-payment.ts
 * @description 결제 요청 생성 Server Action
 *
 * 주요 기능:
 * 1. 주문 데이터 검증 (R.ORDER.05 데이터 무결성)
 * 2. 서버 측 가격/재고 검증
 * 3. 결제 요청 정보 생성
 * 4. 주문 ID 생성
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 * - lib/supabase/service-role.ts (getServiceRoleClient)
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface PaymentItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface CreatePaymentRequest {
  items: PaymentItem[];
  deliveryOption: "dawn" | "normal";
  deliveryTime?: string;
  deliveryNote?: string;
  deliveryAddress: string;
  totalAmount: number;
}

export interface ValidatedItem extends PaymentItem {
  product_name: string;
  wholesaler_id: string;
  shipping_fee: number;
  server_unit_price: number;
  stock_quantity: number;
}

export interface CreatePaymentResult {
  success: boolean;
  orderId?: string;
  orderName?: string;
  amount?: number;
  validatedItems?: ValidatedItem[];
  error?: string;
}

/**
 * 결제 요청 생성 (R.ORDER.05 데이터 무결성 검증 포함)
 * 
 * @param request 결제 요청 정보
 * @returns 결제 요청 결과 (검증된 상품 정보 포함)
 */
export async function createPayment(
  request: CreatePaymentRequest
): Promise<CreatePaymentResult> {
  try {
    console.group("💳 [결제] 결제 요청 생성 시작");
    console.log("요청 정보:", {
      itemsCount: request.items.length,
      totalAmount: request.totalAmount,
      deliveryOption: request.deliveryOption,
      deliveryTime: request.deliveryTime,
    });

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
        error: "소매점 정보가 없습니다. 소매점 등록이 필요합니다.",
      };
    }

    console.log("✅ 인증 확인 완료:", {
      profileId: profile.id,
      retailerId: retailers[0].id,
    });

    // 2. 기본 데이터 검증
    if (!request.items || request.items.length === 0) {
      console.error("❌ 주문 상품 없음");
      console.groupEnd();
      return {
        success: false,
        error: "주문할 상품이 없습니다.",
      };
    }

    if (request.totalAmount <= 0) {
      console.error("❌ 결제 금액 오류");
      console.groupEnd();
      return {
        success: false,
        error: "결제 금액이 올바르지 않습니다.",
      };
    }

    // 2-1. 상품 ID 유효성 검증 (빈 값/undefined 방지)
    const invalidItems = request.items.filter(
      (item) => !item.product_id || typeof item.product_id !== "string"
    );
    if (invalidItems.length > 0) {
      console.error("❌ 상품 ID 누락/유효하지 않음", {
        invalidItems,
      });
      console.groupEnd();
      return {
        success: false,
        error: "상품 정보가 올바르지 않습니다. 장바구니를 비우고 다시 담아주세요.",
      };
    }

    // 3. 서버 측 가격/재고 검증 (R.ORDER.05)
    console.log("🔍 서버 측 상품 검증 시작...");
    const supabase = getServiceRoleClient();
    
    const productIds = request.items.map(item => item.product_id);

    // UUID 형식 검증 (대시보드 임시 핫딜 목데이터 등 문자열 ID 방지)
    const isUuid = (value: string) =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        value
      );
    const invalidUuidIds = productIds.filter((id) => !isUuid(id));
    if (invalidUuidIds.length > 0) {
      console.error("❌ 상품 ID가 UUID 형식이 아님:", invalidUuidIds);
      console.groupEnd();
      return {
        success: false,
        error:
          "장바구니에 테스트 상품이 포함되어 있어 결제를 진행할 수 없습니다. 장바구니를 비우고 실제 상품을 다시 담아주세요.",
      };
    }

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, standardized_name, original_name, price, stock_quantity, wholesaler_id, shipping_fee, is_active")
      .in("id", productIds);

    if (productError) {
      console.error("❌ 상품 조회 실패:", {
        productError,
        productIds,
      });
      console.groupEnd();
      return {
        success: false,
        error: `상품 정보 조회에 실패했습니다. (${productError.message || "알 수 없는 오류"})`,
      };
    }

    if (!products || products.length !== request.items.length) {
      console.error("❌ 일부 상품을 찾을 수 없음");
      console.groupEnd();
      return {
        success: false,
        error: "일부 상품을 찾을 수 없습니다. 장바구니를 확인해주세요.",
      };
    }

    // 상품별 검증 및 서버 금액 계산
    const validatedItems: ValidatedItem[] = [];
    let serverTotalAmount = 0;

    for (const item of request.items) {
      const product = products.find(p => p.id === item.product_id);
      
      if (!product) {
        console.error(`❌ 상품 없음: ${item.product_id}`);
        console.groupEnd();
        return {
          success: false,
          error: `상품을 찾을 수 없습니다: ${item.product_id}`,
        };
      }

      // 상품 활성화 여부 확인
      if (!product.is_active) {
        console.error(`❌ 비활성화된 상품: ${product.standardized_name || product.original_name}`);
        console.groupEnd();
        return {
          success: false,
          error: `"${product.standardized_name || product.original_name}" 상품은 현재 판매 중이 아닙니다.`,
        };
      }

      // 재고 확인
      if (product.stock_quantity < item.quantity) {
        console.error(`❌ 재고 부족: ${product.standardized_name || product.original_name}`, {
          requested: item.quantity,
          available: product.stock_quantity,
        });
        console.groupEnd();
        return {
          success: false,
          error: `"${product.standardized_name || product.original_name}" 상품의 재고가 부족합니다. (요청: ${item.quantity}, 재고: ${product.stock_quantity})`,
        };
      }

      // 가격 검증 (클라이언트 가격과 서버 가격 비교)
      if (product.price !== item.unit_price) {
        console.warn(`⚠️ 가격 불일치: ${product.standardized_name || product.original_name}`, {
          clientPrice: item.unit_price,
          serverPrice: product.price,
        });
        // 가격 불일치 시 서버 가격으로 계산 (보안상 서버 가격 우선)
      }

      const itemTotal = product.price * item.quantity;
      serverTotalAmount += itemTotal;

      validatedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        product_name: product.standardized_name || product.original_name,
        wholesaler_id: product.wholesaler_id,
        shipping_fee: product.shipping_fee || 0,
        server_unit_price: product.price,
        stock_quantity: product.stock_quantity,
      });
    }

    // 총액 검증 (허용 오차: 100원)
    const amountDiff = Math.abs(serverTotalAmount - request.totalAmount);
    if (amountDiff > 100) {
      console.error("❌ 총액 불일치:", {
        clientTotal: request.totalAmount,
        serverTotal: serverTotalAmount,
        diff: amountDiff,
      });
      console.groupEnd();
      return {
        success: false,
        error: `결제 금액이 일치하지 않습니다. 장바구니를 새로고침 해주세요. (차이: ${amountDiff}원)`,
      };
    }

    console.log("✅ 상품 검증 완료:", {
      validatedCount: validatedItems.length,
      serverTotalAmount,
    });

    // 4. 주문 ID 생성 (형식: ORD-YYYYMMDD-HHMMSS-XXX)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "");
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    const orderId = `ORD-${dateStr}-${timeStr}-${randomStr}`;

    // 5. 주문명 생성 (첫 번째 상품명 + 외 N건)
    const firstProductName = validatedItems[0]?.product_name || "상품";
    const orderName =
      validatedItems.length === 1
        ? firstProductName
        : `${firstProductName} 외 ${validatedItems.length - 1}건`;

    console.log("✅ 결제 요청 생성 완료:", {
      orderId,
      orderName,
      amount: serverTotalAmount,
    });
    console.groupEnd();

    return {
      success: true,
      orderId,
      orderName,
      amount: serverTotalAmount,
      validatedItems,
    };
  } catch (error) {
    console.error("❌ [결제] 결제 요청 생성 실패:", error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : "결제 요청 생성에 실패했습니다.",
    };
  }
}
