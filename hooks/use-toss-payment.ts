/**
 * @file hooks/use-toss-payment.ts
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { loadTossPayments, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";

interface UseTossPaymentOptions {
  clientKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  onSuccess?: (paymentKey: string, orderId: string, amount: number) => void;
  onFail?: (error: { code: string; message: string }) => void;
}

// ✨ [추가] 결제 요청 시 받을 파라미터 타입 정의
interface RequestPaymentParams {
    orderId?: string;
    orderName?: string;
    customerName?: string;
    customerEmail?: string;
}

export function useTossPayment({
  clientKey,
  customerKey,
  amount,
  orderId,
  orderName,
  onFail,
}: UseTossPaymentOptions) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const agreementWidgetRenderedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    async function initWidget() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey });

        if (!mounted) return;

        await widgets.setAmount({
          currency: "KRW",
          value: amount,
        });

        widgetsRef.current = widgets;
        setIsReady(true);
      } catch (error) {
        console.error("❌ [V2] 위젯 초기화 실패:", error);
      }
    }
    initWidget();
    return () => { mounted = false; };
  }, [clientKey, customerKey]); // amount 제외 (updateAmount로 처리)

  const renderPaymentMethods = async (selector: string) => {
    if (!widgetsRef.current || !isReady) return;
    try {
      await widgetsRef.current.renderPaymentMethods({
        selector,
        variantKey: "DEFAULT",
      });
    } catch (error) {
      console.error("❌ [V2] 결제 수단 렌더링 실패:", error);
    }
  };

  const renderAgreements = async (selector: string) => {
    if (!widgetsRef.current || !isReady) return;
    try {
      if (agreementWidgetRenderedRef.current) return;
      await widgetsRef.current.renderAgreement({
        selector,
        variantKey: "AGREEMENT",
      });
      agreementWidgetRenderedRef.current = true;
    } catch (error) {
      console.error("❌ [V2] 약관 위젯 렌더링 실패:", error);
    }
  };

  // ✨ [수정] 파라미터를 객체 형태로 받고, 사용자 정보를 동적으로 처리
  const requestPayment = async (params?: RequestPaymentParams) => {
    if (!widgetsRef.current || !isReady) return;

    const finalOrderId = params?.orderId || orderId;
    const finalOrderName = params?.orderName || orderName;
    // ✨ 실제 유저 정보가 없으면 기본값 사용
    const finalCustomerName = params?.customerName || "구매자"; 
    const finalCustomerEmail = params?.customerEmail || "customer@example.com";

    setIsLoading(true);

    try {
      await widgetsRef.current.requestPayment({
        orderId: finalOrderId,
        orderName: finalOrderName,
        successUrl: `${window.location.origin}/retailer/payment/success`,
        failUrl: `${window.location.origin}/retailer/payment/fail`,
        customerEmail: finalCustomerEmail, // ✨ 동적 할당
        customerName: finalCustomerName,   // ✨ 동적 할당
      });
    } catch (error: any) {
      console.error("❌ [V2] 결제 요청 실패:", error);
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

  const updateAmount = async (newAmount: number) => {
    if (!widgetsRef.current) return;
    try {
      await widgetsRef.current.setAmount({
        currency: "KRW",
        value: newAmount,
      });
    } catch (error) {
      console.error("❌ [V2] 금액 업데이트 실패:", error);
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