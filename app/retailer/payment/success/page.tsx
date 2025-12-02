/**
 * @file app/retailer/payment/success/page.tsx
 * @description 결제 성공 페이지
 *
 * 토스 페이먼츠 결제 성공 후 리다이렉트되는 페이지입니다.
 */

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    console.log("✅ [결제 성공] 결제 완료:", { paymentKey, orderId });
    
    // TODO: 나중에 주문 생성 로직 추가
    // 결제 승인 확인 및 주문 생성은 서버에서 처리
  }, [paymentKey, orderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          결제가 완료되었습니다!
        </h1>
        
        {orderId && (
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            주문번호: <span className="font-semibold text-gray-900 dark:text-gray-100">{orderId}</span>
          </p>
        )}
        
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          주문 내역은 마이페이지에서 확인하실 수 있습니다.
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

