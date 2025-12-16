/**
 * @file app/retailer/payment/success/page.tsx
 * @description 결제 성공 페이지
 *
 * 토스 페이먼츠 결제 성공 후 리다이렉트되는 페이지입니다.
 * 결제 승인 API를 호출한 후 주문을 생성하고, 장바구니를 비웁니다.
 *
 * 주요 기능:
 * 1. 결제 성공 확인
 * 2. 결제 승인 API 호출 (/api/payments/confirm)
 * 3. 주문 생성 (Server Action 호출)
 * 4. 장바구니 비우기
 * 5. 주문 완료 UI 표시 및 주문/쇼핑 이동 버튼
 */

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { CheckCircle, Loader2, AlertCircle, FileText, ShoppingBag } from "lucide-react";
import { createOrder } from "@/actions/retailer/create-order";
import { useCartStore } from "@/stores/cart-store";

type OrderStatus = "loading" | "success" | "error";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount"); // ✨ 추가: amount 파라미터
  
  const [status, setStatus] = useState<OrderStatus>("loading");
  const [orderNumbers, setOrderNumbers] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // 중복 실행 방지
  const isProcessing = useRef(false);

  useEffect(() => {
    async function processOrder() {
      // 중복 실행 방지
      if (isProcessing.current) return;
      isProcessing.current = true;

      console.group("📦 [결제 성공] 주문 처리 시작");
      console.log("결제 정보:", { paymentKey, orderId, amount });

      if (!paymentKey || !orderId) {
        console.error("❌ 결제 정보 누락");
        setStatus("error");
        setErrorMessage("결제 정보가 누락되었습니다.");
        console.groupEnd();
        return;
      }

      try {
        // localStorage에서 주문 정보 가져오기
        const pendingOrderStr = localStorage.getItem("pendingOrder");
        if (!pendingOrderStr) {
          console.error("❌ 주문 정보 없음");
          setStatus("error");
          setErrorMessage("주문 정보를 찾을 수 없습니다. 장바구니에서 다시 결제해주세요.");
          console.groupEnd();
          return;
        }

        const pendingOrder = JSON.parse(pendingOrderStr);
        console.log("📋 주문 정보:", pendingOrder);

        // 주문 ID 확인
        if (pendingOrder.orderId !== orderId) {
          console.warn("⚠️ 주문 ID 불일치:", {
            expected: pendingOrder.orderId,
            received: orderId,
          });
        }

        // 금액 검증 (보안: 클라이언트에서 조작 방지)
        const confirmAmount = amount 
          ? Number(amount) 
          : pendingOrder.totalAmount; // amount가 없으면 localStorage 값 사용
        if (amount && Math.abs(Number(amount) - pendingOrder.totalAmount) > 100) {
          console.error("❌ 결제 금액 불일치:", {
            urlAmount: amount,
            expectedAmount: pendingOrder.totalAmount,
            diff: Math.abs(Number(amount) - pendingOrder.totalAmount),
          });
          setStatus("error");
          setErrorMessage("결제 금액이 일치하지 않습니다. 고객센터로 문의해주세요.");
          console.groupEnd();
          return;
        }

        // ✨ 1단계: 주문 생성 (먼저 실행 - orders 테이블에 저장)
        console.log("📦 [주문 생성] 주문 생성 시작");
        const result = await createOrder({
          paymentKey,
          orderId,
          // 배송비를 사용하지 않는 현재 정책에 맞춰 0으로 보정
          items: pendingOrder.items.map((item: any) => ({
            ...item,
            shipping_fee: item.shipping_fee ?? 0,
          })),
          deliveryOption: pendingOrder.deliveryOption,
          deliveryTime: pendingOrder.deliveryTime,
          deliveryNote: pendingOrder.deliveryNote,
          deliveryAddress: pendingOrder.deliveryAddress,
          totalAmount: pendingOrder.totalAmount,
        });

        if (!result.success) {
          console.error("❌ 주문 생성 실패:", result.error);
          setStatus("error");
          setErrorMessage(result.error || "주문 생성에 실패했습니다.");
          console.groupEnd();
          return;
        }

        console.log("✅ 주문 생성 성공:", result.orderNumbers);

        // ✨ 2단계: 결제 승인 API 호출 (주문 생성 후 실행)
        console.log("💳 [결제 승인] 결제 승인 API 호출 시작");
        const confirmResponse = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: confirmAmount,
          }),
        });

        if (!confirmResponse.ok) {
          const errorData = await confirmResponse.json().catch(() => ({}));
          console.error("❌ 결제 승인 실패:", errorData);
          // 주문은 생성되었지만 결제 승인 실패 - 사용자에게 알림
          setStatus("error");
          setErrorMessage(
            errorData.error || "주문은 생성되었으나 결제 승인에 실패했습니다. 고객센터로 문의해주세요."
          );
          console.groupEnd();
          return;
        }

        const confirmResult = await confirmResponse.json();
        console.log("✅ 결제 승인 성공:", confirmResult);

        // 성공 시 처리
        setOrderNumbers(result.orderNumbers || [orderId]);
        setStatus("success");

        // localStorage에서 주문 정보 삭제
        localStorage.removeItem("pendingOrder");

        // 장바구니 비우기
        clearCart();
        console.log("🛒 장바구니 비움");

        console.groupEnd();
      } catch (error) {
        console.error("❌ 주문 처리 오류:", error);
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "주문 처리 중 오류가 발생했습니다.");
        console.groupEnd();
      }
    }

    processOrder();
  }, [paymentKey, orderId, amount, clearCart]);

  // 로딩 상태
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 text-center space-y-4">
          <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-300 animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              주문을 처리하고 있습니다...
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              잠시만 기다려주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 text-center space-y-4">
          <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-300" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              주문 처리 중 문제가 발생했습니다
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              {errorMessage}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              결제는 완료되었으나 주문 생성에 실패했습니다. 고객센터로 문의해주세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/retailer/cs")}
              className="flex-1 px-6 py-3 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              고객센터 문의
            </button>
            <button
              onClick={() => router.push("/retailer/dashboard")}
              className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 성공 상태
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 md:py-16">
      <div className="w-full max-w-3xl">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-10 text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
              주문이 완료되었습니다!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              고객님의 주문이 성공적으로 접수되었습니다.<br className="hidden md:block" />
              빠르고 안전하게 배송해 드리겠습니다.
            </p>
          </div>

          <div className="w-full max-w-md mx-auto bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">주문번호</p>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-wider font-mono">
              {orderNumbers[0] || orderId}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/retailer/orders")}
              className="w-full sm:w-auto flex-1 sm:flex-initial px-6 py-3 md:px-8 md:py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-100 font-bold flex items-center justify-center gap-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FileText className="w-5 h-5" />
              주문 내역 확인
            </button>
            <button
              onClick={() => router.push("/retailer/dashboard")}
              className="w-full sm:w-auto flex-1 sm:flex-initial px-6 py-3 md:px-8 md:py-3.5 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              쇼핑 계속하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
