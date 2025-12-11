/**
 * @file checkout-client.tsx
 * @description 소매점 주문/결제 페이지 클라이언트 컴포넌트 (V2 - 실시간 계좌이체 500 에러 수정 적용)
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/stores/cart-store";
import { calculateTotals } from "@/lib/utils/shipping";
import { useTossPayment } from "@/hooks/use-toss-payment";
import { createPayment } from "@/actions/retailer/create-payment";
import type { RetailerInfo } from "@/actions/retailer/get-retailer-info";

interface CheckoutPageClientProps {
  retailerInfo: RetailerInfo | null;
}

export default function CheckoutPageClient({
  retailerInfo,
}: CheckoutPageClientProps) {
  const router = useRouter();
  
  // 1. Clerk 유저 정보 가져오기 (실시간 계좌이체 필수 정보)
  const { user } = useUser();
  
  const items = useCartStore((state) => state.items);

  // items를 직접 사용하여 summary 계산 (배송비 포함)
  const summary = useMemo(() => {
    const totals = items.reduce(
      (sum, item) => {
        const { productTotal, shippingFee, total } = calculateTotals({
          unitPrice: item.unit_price,
          shippingUnitFee: item.shipping_fee ?? 0,
          quantity: item.quantity,
        });

        return {
          product: sum.product + productTotal,
          shipping: sum.shipping + shippingFee,
          total: sum.total + total,
        };
      },
      { product: 0, shipping: 0, total: 0 }
    );

    return {
      totalProductPrice: totals.product,
      totalShippingFee: totals.shipping,
      totalPrice: totals.total,
      itemCount: items.length,
    };
  }, [items]);

  // 배송 옵션
  const deliveryOption: "dawn" | "normal" = "dawn";
  const deliveryTime = "06:00-07:00";
  const [deliveryNote, setDeliveryNote] = useState("");

  // 배송지 정보 상태
  const [deliveryInfo] = useState(() =>
    retailerInfo
      ? {
          businessName: retailerInfo.business_name,
          phone: retailerInfo.phone,
          address: retailerInfo.address,
        }
      : { businessName: "", phone: "", address: "" }
  );

  // 결제 요청 상태
  const [paymentOrderId, setPaymentOrderId] = useState("");
  const [paymentOrderName, setPaymentOrderName] = useState("");

  // 위젯(모달) 열림 상태 관리
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // 위젯이 이미 렌더링되었는지 추적하는 Ref (중복 렌더링 방지)
  const isWidgetRendered = useRef(false);

  const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  const TOSS_CUSTOMER_KEY = user?.id || "test-customer-key";

  // 결제 수단 위젯 렌더링용 ref
  const paymentMethodsRef = useRef<HTMLDivElement>(null);

  // useTossPayment 훅 호출 (V2)
  const {
    isReady: isPaymentReady,
    isLoading: isPaymentLoading,
    renderPaymentMethods,
    renderAgreements,
    requestPayment,
    updateAmount,
  } = useTossPayment({
    clientKey: TOSS_CLIENT_KEY,
    customerKey: TOSS_CUSTOMER_KEY,
    amount: summary.totalPrice,
    orderId: paymentOrderId,
    orderName: paymentOrderName,
    onSuccess: async (paymentKey, orderId, amount) => {
      console.log("✅ [결제] 결제 성공 로직 진입");
    },
    onFail: (error) => {
      console.error("❌ [결제] 결제 실패:", error);
      alert(`결제에 실패했습니다: ${error.message}`);
    },
  });

  // 위젯 렌더링 로직 (중복 방지 가드 추가)
  useEffect(() => {
    if (isPaymentModalOpen && isPaymentReady && paymentMethodsRef.current) {
      if (isWidgetRendered.current) {
        return;
      }

      console.log("🎨 [UI] 결제 위젯 렌더링 실행");
      renderPaymentMethods("#payment-methods-widget");
      renderAgreements("#payment-agreements-widget");

      isWidgetRendered.current = true;
    }

    if (!isPaymentModalOpen) {
      isWidgetRendered.current = false;
    }
  }, [isPaymentModalOpen, isPaymentReady, renderPaymentMethods, renderAgreements]);

  // 금액 변경 시 업데이트
  useEffect(() => {
    if (isPaymentReady) {
      updateAmount(summary.totalPrice).catch((err) => 
        console.error("금액 업데이트 실패", err)
      );
    }
  }, [summary.totalPrice, isPaymentReady, updateAmount]);

  // 장바구니 리다이렉트
  useEffect(() => {
    if (items.length === 0) {
      router.push("/retailer/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) return null;

  const totalProductPrice = summary.totalProductPrice;
  const totalPrice = summary.totalPrice;
  const totalShippingFee = summary.totalShippingFee;

  const getDeliveryAddressString = () => {
    if (!retailerInfo) return "";
    return `${retailerInfo.business_name} | ${retailerInfo.phone} | ${retailerInfo.address}`;
  };

  // "결제하기" 버튼 클릭 시 모달 열기
  const handleOpenPaymentModal = () => {
    if (!retailerInfo) {
      alert("배송지 정보를 먼저 확인해주세요.");
      return;
    }
    setIsPaymentModalOpen(true);
  };

  // ✨ [핵심 수정] 실제 결제 요청 로직
  const handleProcessPayment = async () => {
    try {
      // 1. 주문 생성 (서버 API)
      const paymentResult = await createPayment({
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        deliveryOption,
        deliveryTime,
        deliveryNote,
        deliveryAddress: getDeliveryAddressString(),
        totalAmount: summary.totalPrice,
      });

      if (!paymentResult.success || !paymentResult.orderId) {
        throw new Error(paymentResult.error || "결제 요청 생성에 실패했습니다.");
      }

      console.log("✅ [결제] 결제 요청 생성 완료:", paymentResult);

      setPaymentOrderId(paymentResult.orderId);
      setPaymentOrderName(paymentResult.orderName || "주문");

      // localStorage 저장 로직
      // 배송비를 사용하지 않는 정책에 맞춰 shipping_fee를 0으로 보정
      const itemsForOrder = (paymentResult.validatedItems ?? items).map((item) => ({
        ...item,
        shipping_fee: item.shipping_fee ?? 0,
      }));

      const pendingOrderData = {
        orderId: paymentResult.orderId,
        items: itemsForOrder,
        deliveryOption,
        deliveryTime,
        deliveryNote,
        deliveryAddress: getDeliveryAddressString(),
        totalAmount: paymentResult.amount || summary.totalPrice,
      };
      localStorage.setItem("pendingOrder", JSON.stringify(pendingOrderData));

      // 5. 결제 요청 진행 (SDK)
      if (!isPaymentReady) {
        alert("결제 위젯이 준비되지 않았습니다.");
        return;
      }

      // ✨ [수정 1] 금액이 실제 변경되었을 때만 업데이트 (안정성 확보)
      // 무조건 호출하면 계좌이체 세션이 초기화되어 500 에러 유발 가능성 있음
      const serverAmount = paymentResult.amount || summary.totalPrice;
      if (serverAmount !== summary.totalPrice) {
          await updateAmount(serverAmount);
      }

      // ✨ [수정 2] 실시간 계좌이체 500 에러 방지를 위해 고객 정보 명시적 전달
      // useTossPayment 훅이 객체를 받을 수 있도록 수정되어 있어야 합니다.
      await requestPayment({
          orderId: paymentResult.orderId,
          orderName: paymentResult.orderName,
          customerName: user?.fullName || user?.firstName || "구매자",
          customerEmail: user?.primaryEmailAddress?.emailAddress || "test@test.com"
      } as any); // any 캐스팅: hook 타입이 아직 업데이트 안 되었을 경우 대비
      
    } catch (error) {
      console.error("❌ [결제] 결제 실패:", error);
      alert(error instanceof Error ? error.message : "결제 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* 주문 정보 UI */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            주문/결제
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 주문 정보 */}
            <div className="lg:col-span-2 space-y-8">
                {/* 배송지 정보 표시 */}
                {retailerInfo && (
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                         <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">배송지 정보</h2>
                         <div className="text-sm text-gray-500 space-y-1">
                            <p><span className="font-semibold">상호명:</span> {retailerInfo.business_name}</p>
                            <p><span className="font-semibold">연락처:</span> {retailerInfo.phone}</p>
                            <p><span className="font-semibold">주소:</span> {retailerInfo.address}</p>
                         </div>
                    </div>
                )}
                 {/* 배송 요청사항 */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">배송 요청사항</h2>
                    <textarea
                        value={deliveryNote}
                        onChange={(e) => setDeliveryNote(e.target.value)}
                        placeholder="요청사항 입력"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                </div>
                {/* 주문 상품 목록 */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">주문 상품</h2>
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 mb-4">
                             <div className="relative w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                {item.product_image && <Image src={item.product_image} alt="" fill className="object-cover" />}
                             </div>
                             <div>
                                <p className="font-bold text-gray-900 dark:text-gray-100">{item.product_name}</p>
                                <p className="text-sm text-gray-500">{item.quantity}개 / {(item.unit_price * item.quantity).toLocaleString()}원</p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 오른쪽: 최종 결제 금액 및 버튼 */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                            최종 결제 금액
                        </h2>
                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">총 상품 금액</span>
                                <span className="text-gray-900 dark:text-gray-100">{totalProductPrice.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">배송비</span>
                                <span className="text-gray-900 dark:text-gray-100">{totalShippingFee.toLocaleString()}원</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold">
                                <span className="text-gray-900 dark:text-gray-100">총 결제 예정 금액</span>
                                <span className="text-green-600 dark:text-green-400">{totalPrice.toLocaleString()}원</span>
                            </div>
                        </div>

                        {/* 메인 버튼: 모달 열기 */}
                        <button
                            onClick={handleOpenPaymentModal}
                            disabled={!retailerInfo}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors"
                        >
                            {retailerInfo ? `${totalPrice.toLocaleString()}원 결제하기` : "소매점 정보를 확인해주세요"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 결제 위젯 모달 팝업 */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* 모달 헤더 */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                결제 수단 선택
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕ 닫기
              </button>
            </div>

            {/* 모달 본문 (위젯 영역) */}
            <div className="p-6 overflow-y-auto flex-1">
              <div
                id="payment-methods-widget"
                ref={paymentMethodsRef}
                className="mb-4 min-h-[200px]"
              >
                 {!isPaymentReady && <div className="text-center py-10 text-gray-500">결제창 로딩 중...</div>}
              </div>

              <div id="payment-agreements-widget" className="mb-4" />
            </div>

            {/* 모달 푸터 */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <button
                onClick={handleProcessPayment}
                disabled={!isPaymentReady || isPaymentLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors text-lg"
              >
                {isPaymentLoading ? "결제 처리 중..." : `${totalPrice.toLocaleString()}원 결제하기`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}