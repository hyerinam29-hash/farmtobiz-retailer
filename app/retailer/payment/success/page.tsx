/**
 * @file app/retailer/payment/success/page.tsx
 * @description 결제 성공 페이지
 *
 * 토스 페이먼츠 결제 성공 후 리다이렉트되는 페이지입니다.
 * 결제 성공 시 주문을 생성하고, 장바구니를 비웁니다.
 *
 * 주요 기능:
 * 1. 결제 성공 확인
 * 2. 주문 생성 (Server Action 호출)
 * 3. 장바구니 비우기
 * 4. 주문 내역 페이지로 이동
 */

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { createOrder } from "@/actions/retailer/create-order";
import { useCartStore } from "@/stores/cart-store";

type OrderStatus = "loading" | "success" | "error";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  
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
      console.log("결제 정보:", { paymentKey, orderId });

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

        // 주문 생성 Server Action 호출
        const result = await createOrder({
          paymentKey,
          orderId,
          items: pendingOrder.items,
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
  }, [paymentKey, orderId, clearCart]);

  // 로딩 상태
  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            주문을 처리하고 있습니다...
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400">
            잠시만 기다려주세요.
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            주문 처리 중 문제가 발생했습니다
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {errorMessage}
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            결제는 완료되었으나 주문 생성에 실패했습니다.<br />
            고객센터로 문의해주세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/retailer/cs")}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              고객센터 문의
            </button>
            <button
              onClick={() => router.push("/retailer/dashboard")}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
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
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          주문이 완료되었습니다!
        </h1>
        
        {orderNumbers.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              주문번호
            </p>
            {orderNumbers.map((num) => (
              <p key={num} className="font-semibold text-gray-900 dark:text-gray-100">
                {num}
              </p>
            ))}
          </div>
        )}
        
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          주문 내역에서 배송 상태를 확인하실 수 있습니다.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/retailer/orders")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            주문 내역 보기
          </button>
          <button
            onClick={() => router.push("/retailer/products")}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  );
}
