/**
 * @file app/retailer/payment/fail/page.tsx
 * @description 결제 실패 페이지
 *
 * 토스 페이먼츠 결제 실패 후 리다이렉트되는 페이지입니다.
 */

"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  useEffect(() => {
    console.error("❌ [결제 실패] 결제 오류:", { errorCode, errorMessage });
  }, [errorCode, errorMessage]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
          결제에 실패했습니다
        </h1>
        
        {errorMessage && (
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {errorMessage}
          </p>
        )}
        
        {errorCode && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            오류 코드: {errorCode}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/retailer/cart")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            장바구니로 돌아가기
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}

