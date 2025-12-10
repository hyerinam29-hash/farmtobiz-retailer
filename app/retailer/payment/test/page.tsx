/**
 * @file app/retailer/payment/test/page.tsx
 * @description 임시 토스 결제 테스트 페이지
 * 
 * 이 페이지는 토스 결제 연동을 테스트하기 위한 임시 페이지입니다.
 * 나중에 실제 결제 플로우와 연결할 수 있도록 구조화되어 있습니다.
 * 
 * 주요 기능:
 * 1. 토스 결제 위젯 테스트
 * 2. 결제 요청 테스트
 * 3. 결제 성공/실패 처리 테스트
 * 
 * 확장 가능성:
 * - createPayment 액션과 연동 가능
 * - 실제 주문 데이터와 연동 가능
 * - 결제 승인 콜백과 연동 가능
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useTossPayment } from "@/hooks/use-toss-payment";

export default function TossPaymentTestPage() {
  const router = useRouter();
  const { user } = useUser();
  
  // 테스트 주문 정보
  const [testAmount, setTestAmount] = useState(10000);
  const [testOrderName, setTestOrderName] = useState("테스트 주문");
  
  // 결제 상태
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  // 토스 페이먼츠 설정
  const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";
  const TOSS_CUSTOMER_KEY = user?.id || "test-customer-key";
  
  // 결제 수단 위젯 렌더링용 ref
  const paymentMethodsRef = useRef<HTMLDivElement>(null);
  
  // 결제 위젯 훅
  const {
    isReady: isPaymentReady,
    isLoading: isPaymentLoading,
    renderPaymentMethods,
    requestPayment,
    updateAmount,
  } = useTossPayment({
    clientKey: TOSS_CLIENT_KEY,
    customerKey: TOSS_CUSTOMER_KEY,
    amount: testAmount,
    orderId: "", // 나중에 createPayment에서 받아옴
    orderName: testOrderName,
    onSuccess: async (paymentKey, orderId, amount) => {
      console.log("✅ [토스 결제 테스트] 결제 성공:", { paymentKey, orderId, amount });
      setPaymentStatus("success");
      
      // TODO: 나중에 실제 결제 승인 처리
      // - /api/payments/callback 호출
      // - 주문 생성 로직 실행
      // - 결제 정보 DB 저장
      
      // 3초 후 성공 페이지로 이동
      setTimeout(() => {
        router.push(`/retailer/payment/success?paymentKey=${paymentKey}&orderId=${orderId}`);
      }, 3000);
    },
    onFail: (error) => {
      console.error("❌ [토스 결제 테스트] 결제 실패:", error);
      setPaymentStatus("failed");
      setErrorMessage(error.message);
    },
  });
  
  // 결제 수단 위젯 렌더링
  useEffect(() => {
    if (isPaymentReady && paymentMethodsRef.current) {
      renderPaymentMethods("#payment-methods-widget");
    }
  }, [isPaymentReady, renderPaymentMethods]);
  
  // 금액 변경 시 위젯 업데이트
  useEffect(() => {
    if (isPaymentReady) {
      updateAmount(testAmount);
    }
  }, [testAmount, isPaymentReady, updateAmount]);
  
  // 결제 요청 처리
  const handleTestPayment = async () => {
    if (!isPaymentReady) {
      alert("결제 위젯이 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    
    if (!TOSS_CLIENT_KEY) {
      alert("토스 클라이언트 키가 설정되지 않았습니다. 환경변수를 확인해주세요.");
      return;
    }
    
    setPaymentStatus("processing");
    setErrorMessage("");
    
    try {
      console.log("💳 [토스 결제 테스트] 결제 요청 시작:", {
        amount: testAmount,
        orderName: testOrderName,
      });
      
      // TODO: 나중에 실제 createPayment 액션 사용
      // const paymentResult = await createPayment({
      //   items: [], // 실제 장바구니 아이템
      //   deliveryOption: "dawn",
      //   deliveryTime: "06:00-07:00",
      //   deliveryNote: "",
      //   totalAmount: testAmount,
      // });
      // 
      // if (!paymentResult.success || !paymentResult.orderId) {
      //   throw new Error(paymentResult.error || "결제 요청 생성에 실패했습니다.");
      // }
      // 
      // await requestPayment(paymentResult.orderId, paymentResult.orderName);
      
      // 임시 주문 정보 생성 (나중에 createPayment로 교체)
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "");
      const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
      const testOrderId = `TEST-${dateStr}-${timeStr}-${randomStr}`;
      
      // 결제 요청
      await requestPayment({
        orderId: testOrderId,
        orderName: testOrderName,
      });
      
      console.log("✅ [토스 결제 테스트] 결제 요청 완료");
    } catch (error) {
      console.error("❌ [토스 결제 테스트] 결제 요청 실패:", error);
      setPaymentStatus("failed");
      setErrorMessage(error instanceof Error ? error.message : "결제 요청에 실패했습니다.");
    }
  };
  
  // 환경변수 확인
  const hasClientKey = !!TOSS_CLIENT_KEY;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          토스 결제 테스트 페이지
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          토스 페이먼츠 결제 연동을 테스트하는 임시 페이지입니다.
        </p>
      </div>
      
      {/* 환경변수 확인 */}
      {!hasClientKey && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                환경변수 미설정
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <code className="bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded">
                  NEXT_PUBLIC_TOSS_CLIENT_KEY
                </code>{" "}
                환경변수가 설정되지 않았습니다. .env 파일에 추가해주세요.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 테스트 설정 */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          테스트 설정
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              결제 금액 (원)
            </label>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(Number(e.target.value))}
              min={1000}
              step={1000}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              주문명
            </label>
            <input
              type="text"
              value={testOrderName}
              onChange={(e) => setTestOrderName(e.target.value)}
              placeholder="테스트 주문"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
      
      {/* 결제 위젯 */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          결제 수단 선택
        </h2>
        
        <div
          id="payment-methods-widget"
          ref={paymentMethodsRef}
          className="mb-4 min-h-[200px]"
        >
          {!isPaymentReady && (
            <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                결제 위젯을 불러오는 중...
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* 결제 상태 */}
      {paymentStatus === "success" && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                결제 성공!
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                결제가 완료되었습니다. 잠시 후 성공 페이지로 이동합니다.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {paymentStatus === "failed" && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                결제 실패
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200">
                {errorMessage || "결제 처리 중 오류가 발생했습니다."}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 결제 버튼 */}
      <div className="flex gap-4">
        <button
          onClick={handleTestPayment}
          disabled={!isPaymentReady || isPaymentLoading || !hasClientKey || paymentStatus === "processing"}
          className="flex-1 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isPaymentLoading || paymentStatus === "processing" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              결제 진행 중...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              {testAmount.toLocaleString()}원 결제하기
            </>
          )}
        </button>
        
        <button
          onClick={() => router.back()}
          className="px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
        >
          돌아가기
        </button>
      </div>
      
      {/* 안내 메시지 */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          📝 안내사항
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
          <li>이 페이지는 토스 결제 연동 테스트용 임시 페이지입니다.</li>
          <li>나중에 실제 결제 플로우와 연결할 수 있도록 구조화되어 있습니다.</li>
          <li>테스트 모드에서는 실제 결제가 발생하지 않습니다.</li>
          <li>환경변수 <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">NEXT_PUBLIC_TOSS_CLIENT_KEY</code>가 필요합니다.</li>
        </ul>
      </div>
      
      {/* 확장 가능성 안내 */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          🔧 확장 가능성
        </h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
          <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">createPayment</code> 액션과 연동 가능</li>
          <li>실제 장바구니 데이터와 연동 가능</li>
          <li>결제 승인 콜백 (<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">/api/payments/callback</code>)과 연동 가능</li>
          <li>주문 생성 로직과 연동 가능</li>
        </ul>
      </div>
    </div>
  );
}

