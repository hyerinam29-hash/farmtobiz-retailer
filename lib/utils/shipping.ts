/**
 * @file shipping.ts
 * @description 배송비 및 총 결제 금액 계산 유틸 (프런트/백 공용)
 *
 * - 배송비는 박스/수량당 부과: shippingFee = shippingUnitFee * quantity
 * - 총 결제액 = unitPrice * quantity + shippingFee
 * - 입력 검증: quantity는 1 이상이어야 하며, 음수/0은 예외 처리
 * - 로깅: 입력값, 중간 계산값, 최종 합계를 console.info로 기록
 */

export interface CalculateTotalsInput {
  unitPrice: number;
  shippingUnitFee: number;
  quantity: number;
}

export interface CalculateTotalsResult {
  /** 상품 금액 합계 (단가 * 수량) */
  productTotal: number;
  /** 배송비 합계 (배송 단가 * 수량) */
  shippingFee: number;
  /** 총 결제 금액 (상품 금액 + 배송비) */
  total: number;
}

/**
 * 배송비/총액 계산 함수
 */
export function calculateTotals({
  unitPrice,
  shippingUnitFee,
  quantity,
}: CalculateTotalsInput): CalculateTotalsResult {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    console.error("[shipping-calc] 잘못된 수량", { quantity });
    throw new Error("수량은 1개 이상이어야 합니다.");
  }

  const safeQuantity = Math.floor(quantity);
  const productTotal = unitPrice * safeQuantity;
  const shippingFee = shippingUnitFee * safeQuantity;
  const total = productTotal + shippingFee;

  console.info("[shipping-calc]", {
    unitPrice,
    shippingUnitFee,
    quantity: safeQuantity,
    productTotal,
    shippingFee,
    total,
  });

  return { productTotal, shippingFee, total };
}

