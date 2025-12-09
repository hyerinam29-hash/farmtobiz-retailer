/**
 * @file hooks/use-toss-payment.ts
 * @description 토스 페이먼츠 결제 위젯 관리 훅
 *
 * 주요 기능:
 * 1. 토스 페이먼츠 위젯 초기화
 * 2. 결제 요청 처리
 * 3. 결제 성공/실패 처리
 *
 * @dependencies
 * - @tosspayments/payment-widget-sdk
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

interface UseTossPaymentOptions {
  clientKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  onSuccess?: (paymentKey: string, orderId: string, amount: number) => void;
  onFail?: (error: { code: string; message: string }) => void;
}

export function useTossPayment({
  clientKey,
  customerKey,
  amount,
  orderId,
  orderName,
  onSuccess,
  onFail,
}: UseTossPaymentOptions) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance["renderPaymentMethods"]> | null>(null);
  const agreementWidgetRenderedRef = useRef(false);

  // 위젯 초기화
  useEffect(() => {
    let mounted = true;

    async function initWidget() {
      try {
        console.log("🔧 [토스페이먼츠] 위젯 초기화 시작:", { clientKey, customerKey });
        
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
        
        if (!mounted) return;
        
        paymentWidgetRef.current = paymentWidget;
        setIsReady(true);
        
        console.log("✅ [토스페이먼츠] 위젯 초기화 완료");
      } catch (error) {
        console.error("❌ [토스페이먼츠] 위젯 초기화 실패:", error);
        if (onFail) {
          onFail({
            code: "INIT_FAILED",
            message: "결제 위젯 초기화에 실패했습니다.",
          });
        }
      }
    }

    initWidget();

    return () => {
      mounted = false;
    };
  }, [clientKey, customerKey, onFail]);

  // 결제 위젯 렌더링
  const renderPaymentMethods = (selector: string) => {
    if (!paymentWidgetRef.current || !isReady) {
      console.warn("⚠️ [토스페이먼츠] 위젯이 준비되지 않았습니다.");
      return;
    }

    try {
      console.log("🎨 [토스페이먼츠] 결제 수단 위젯 렌더링:", selector);
      
      const paymentMethodsWidget = paymentWidgetRef.current.renderPaymentMethods(
        selector,
        { value: amount },
        { variantKey: "DEFAULT" }
      );
      
      paymentMethodsWidgetRef.current = paymentMethodsWidget;
      
      console.log("✅ [토스페이먼츠] 결제 수단 위젯 렌더링 완료");
    } catch (error) {
      console.error("❌ [토스페이먼츠] 결제 수단 위젯 렌더링 실패:", error);
    }
  };

  // 약관 위젯 렌더링 (V2 필수)
  const renderAgreements = (selector: string) => {
    if (!paymentWidgetRef.current || !isReady) {
      console.warn("⚠️ [토스페이먼츠] 약관 위젯이 준비되지 않았습니다.");
      return;
    }

    try {
      if (agreementWidgetRenderedRef.current) {
        console.log("ℹ️ [토스페이먼츠] 약관 위젯은 이미 렌더링되었습니다.");
        return;
      }

      paymentWidgetRef.current.renderAgreement(selector, { variantKey: "AGREEMENT" });
      agreementWidgetRenderedRef.current = true;
      console.log("✅ [토스페이먼츠] 약관 위젯 렌더링 완료");
    } catch (error) {
      console.error("❌ [토스페이먼츠] 약관 위젯 렌더링 실패:", error);
    }
  };

  // 결제 요청
  const requestPayment = async (customOrderId?: string, customOrderName?: string) => {
    if (!paymentWidgetRef.current || !isReady) {
      console.error("❌ [토스페이먼츠] 위젯이 준비되지 않았습니다.");
      if (onFail) {
        onFail({
          code: "WIDGET_NOT_READY",
          message: "결제 위젯이 준비되지 않았습니다.",
        });
      }
      return;
    }

    const finalOrderId = customOrderId || orderId;
    const finalOrderName = customOrderName || orderName;

    if (!finalOrderId || !finalOrderName) {
      console.error("❌ [토스페이먼츠] 주문 정보가 없습니다.");
      if (onFail) {
        onFail({
          code: "ORDER_INFO_MISSING",
          message: "주문 정보가 없습니다.",
        });
      }
      return;
    }

    setIsLoading(true);

    try {
      console.log("💳 [토스페이먼츠] 결제 요청 시작:", {
        orderId: finalOrderId,
        orderName: finalOrderName,
        amount,
      });

      // 결제 승인 요청
      await paymentWidgetRef.current.requestPayment({
        orderId: finalOrderId,
        orderName: finalOrderName,
        successUrl: `${window.location.origin}/retailer/payment/success`,
        failUrl: `${window.location.origin}/retailer/payment/fail`,
        customerEmail: "", // 나중에 실제 사용자 이메일로 교체
        customerName: "", // 나중에 실제 사용자 이름으로 교체
      });

      console.log("✅ [토스페이먼츠] 결제 요청 완료");
    } catch (error: any) {
      console.error("❌ [토스페이먼츠] 결제 요청 실패:", error);
      
      if (onFail) {
        onFail({
          code: error.code || "PAYMENT_FAILED",
          message: error.message || "결제 요청에 실패했습니다.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 위젯 업데이트 (금액 변경 시)
  const updateAmount = (newAmount: number) => {
    if (paymentMethodsWidgetRef.current) {
      try {
        console.log("💰 [토스페이먼츠] 결제 금액 업데이트:", newAmount);
        paymentMethodsWidgetRef.current.updateAmount(newAmount);
      } catch (error) {
        console.error("❌ [토스페이먼츠] 금액 업데이트 실패:", error);
      }
    }
  };

  return {
    isReady,
    isLoading,
    renderPaymentMethods,
    renderAgreements,
    requestPayment,
    updateAmount,
  };
}

