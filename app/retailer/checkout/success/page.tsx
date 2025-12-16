/**
 * @file app/retailer/checkout/success/page.tsx
 * @description 결제 성공 페이지
 *
 * 주요 기능:
 * 1. URL 쿼리 파라미터에서 결제 정보 추출 (paymentKey, orderId, amount)
 * 2. 결제 승인 API 호출 (서버 액션 사용)
 * 3. 성공 시: 성공 메시지 표시 및 주문 내역 페이지로 리다이렉트
 * 4. 실패 시: 에러 메시지 표시 및 재시도 버튼 제공
 *
 * @dependencies
 * - actions/retailer/confirm-payment.ts (결제 승인 서버 액션)
 * - /api/payments/confirm (결제 승인 API)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react";
import { confirmPayment } from "@/actions/retailer/confirm-payment";

type PaymentStatus = "loading" | "success" | "error";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    const processPayment = async () => {
      try {
        console.group("💳 [결제 성공 페이지] 결제 승인 처리 시작");

        // URL 쿼리 파라미터에서 결제 정보 추출
        const paymentKey = searchParams.get("paymentKey");
        const orderIdParam = searchParams.get("orderId");
        const amountParam = searchParams.get("amount");

        console.log("📋 [결제 성공 페이지] 쿼리 파라미터:", {
          hasPaymentKey: !!paymentKey,
          hasOrderId: !!orderIdParam,
          hasAmount: !!amountParam,
          paymentKey: paymentKey?.substring(0, 20) + "...",
          orderId: orderIdParam,
          amount: amountParam,
        });

        // 필수 파라미터 검증
        if (!paymentKey || !orderIdParam || !amountParam) {
          const missingParams = [];
          if (!paymentKey) missingParams.push("paymentKey");
          if (!orderIdParam) missingParams.push("orderId");
          if (!amountParam) missingParams.push("amount");

          console.error("❌ [결제 성공 페이지] 필수 파라미터 누락:", missingParams);
          setStatus("error");
          setErrorMessage(`필수 파라미터가 누락되었습니다: ${missingParams.join(", ")}`);
          console.groupEnd();
          return;
        }

        const amount = Number(amountParam);
        if (isNaN(amount) || amount <= 0) {
          console.error("❌ [결제 성공 페이지] 잘못된 금액:", amountParam);
          setStatus("error");
          setErrorMessage("결제 금액이 올바르지 않습니다.");
          console.groupEnd();
          return;
        }

        setOrderId(orderIdParam);

        // 결제 승인 API 호출
        console.log("🔄 [결제 성공 페이지] 결제 승인 API 호출 중...");
        const result = await confirmPayment({
          paymentKey,
          orderId: orderIdParam,
          amount,
        });

        if (result.success) {
          console.log("✅ [결제 성공 페이지] 결제 승인 성공:", {
            orderId: result.orderId,
            settlementId: result.settlementId,
            paymentId: result.paymentId,
            message: result.message,
          });
          setStatus("success");

          // 3초 후 주문 내역 페이지로 리다이렉트
          setTimeout(() => {
            console.log("🔄 [결제 성공 페이지] 주문 내역 페이지로 리다이렉트");
            router.push("/retailer/orders");
          }, 3000);
        } else {
          console.error("❌ [결제 성공 페이지] 결제 승인 실패:", {
            error: result.error,
            details: result.details,
          });
          setStatus("error");
          setErrorMessage(result.error || "결제 승인에 실패했습니다.");
          setErrorDetails(result.details || "");
        }

        console.groupEnd();
      } catch (error) {
        console.error("❌ [결제 성공 페이지] 예외 발생:", error);
        console.groupEnd();
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "결제 승인 처리 중 오류가 발생했습니다."
        );
      }
    };

    processPayment();
  }, [searchParams, router]);

  // 재시도 함수
  const handleRetry = () => {
    setStatus("loading");
    setErrorMessage("");
    setErrorDetails("");
    
    // 페이지 새로고침하여 다시 처리
    window.location.reload();
  };

  // 주문 내역 페이지로 이동
  const handleGoToOrders = () => {
    router.push("/retailer/orders");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          {/* 로딩 상태 */}
          {status === "loading" && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/40 animate-pulse">
                  <RefreshCw className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                결제 승인 처리 중...
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                잠시만 기다려주세요.
              </p>
            </>
          )}

          {/* 성공 상태 */}
          {status === "success" && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                결제가 완료되었습니다!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                주문이 정상적으로 처리되었습니다.
              </p>
              {orderId && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                  주문번호: {orderId}
                </p>
              )}
              <div className="space-y-3">
                <button
                  onClick={handleGoToOrders}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  주문 내역 보기
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  3초 후 자동으로 이동합니다...
                </p>
              </div>
            </>
          )}

          {/* 에러 상태 */}
          {status === "error" && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/40">
                  <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                결제 승인 실패
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {errorMessage}
              </p>
              {errorDetails && process.env.NODE_ENV === "development" && (
                <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                    {errorDetails}
                  </p>
                </div>
              )}
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  다시 시도
                </button>
                <button
                  onClick={handleGoToOrders}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors"
                >
                  주문 내역으로 이동
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

