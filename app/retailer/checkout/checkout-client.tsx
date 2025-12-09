/**
 * @file checkout-client.tsx
 * @description 소매점 주문/결제 페이지 클라이언트 컴포넌트
 *
 * 주요 기능:
 * 1. 장바구니 목록과 배송지 정보를 표시
 * 2. 배송 요청사항 입력 및 결제 금액 계산
 * 3. 토스페이먼츠 결제 위젯 연동 및 결제 요청 처리
 *
 * @prop defaultAddress 기본 배송지 정보 (나의상회)
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useTossPayment } from "@/hooks/use-toss-payment";
import { createPayment } from "@/actions/retailer/create-payment";
import type { DeliveryAddress } from "@/types/database";

interface CheckoutPageClientProps {
  defaultAddress: DeliveryAddress | null;
}

export default function CheckoutPageClient({
  defaultAddress,
}: CheckoutPageClientProps) {
  const router = useRouter();
  const { user } = useUser();
  const items = useCartStore((state) => state.items);

  // items를 직접 사용하여 summary 계산 (무한 루프 방지)
  const summary = useMemo(() => {
    const totalProductPrice = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    return {
      totalProductPrice,
      totalPrice: totalProductPrice,
      itemCount: items.length,
    };
  }, [items]);

  // 배송 옵션은 고정 (UI 제거)
  const deliveryOption: "dawn" | "normal" = "dawn";
  const deliveryTime = "06:00-07:00";
  const [deliveryNote, setDeliveryNote] = useState("");

  // 결제 수단 상태
  const [paymentMethod, setPaymentMethod] =
    useState<"toss" | "card" | "transfer">("toss");

  // 결제 요청 상태
  const [paymentOrderId, setPaymentOrderId] = useState("");
  const [paymentOrderName, setPaymentOrderName] = useState("");

  // 토스 페이먼츠 설정 (환경변수에서 가져오기)
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
    amount: summary.totalPrice,
    orderId: paymentOrderId,
    orderName: paymentOrderName,
    onSuccess: async (paymentKey, orderId, amount) => {
      console.log("✅ [결제] 결제 성공:", { paymentKey, orderId, amount });

      // 결제 성공 페이지로 이동
      router.push(
        `/retailer/payment/success?paymentKey=${paymentKey}&orderId=${orderId}`
      );
    },
    onFail: (error) => {
      console.error("❌ [결제] 결제 실패:", error);
      alert(`결제에 실패했습니다: ${error.message}`);
    },
  });

  // 결제 수단 위젯 렌더링
  useEffect(() => {
    if (isPaymentReady && paymentMethodsRef.current && paymentMethod === "toss") {
      renderPaymentMethods("#payment-methods-widget");
    }
  }, [isPaymentReady, paymentMethod, renderPaymentMethods]);

  // 금액 변경 시 위젯 업데이트
  useEffect(() => {
    if (isPaymentReady && paymentMethod === "toss") {
      updateAmount(summary.totalPrice);
    }
  }, [summary.totalPrice, isPaymentReady, paymentMethod, updateAmount]);

  // 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
  useEffect(() => {
    if (items.length === 0) {
      console.log(
        "⚠️ [결제] 장바구니가 비어있어 장바구니 페이지로 리다이렉트"
      );
      router.push("/retailer/cart");
    }
  }, [items.length, router]);

  // 장바구니가 비어있으면 아무것도 렌더링하지 않음
  if (items.length === 0) {
    return null;
  }

  const totalProductPrice = summary.totalProductPrice;
  const totalPrice = summary.totalPrice;

  const hasDefaultAddress = Boolean(defaultAddress);

  // 배송지 정보 문자열 생성
  const getDeliveryAddressString = () => {
    if (!defaultAddress) return "";
    const detail = defaultAddress.address_detail
      ? ` ${defaultAddress.address_detail}`
      : "";
    return `${defaultAddress.recipient_name} | ${defaultAddress.recipient_phone} | ${defaultAddress.address}${detail}`;
  };

  // 결제 처리 함수
  const handlePayment = async () => {
    console.log("💳 [결제] 결제 프로세스 시작:", {
      totalPrice: summary.totalPrice,
      paymentMethod,
      itemsCount: items.length,
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    });

    if (!defaultAddress) {
      alert("배송지를 등록하거나 선택해주세요.");
      return;
    }

    try {
      // 1. 결제 요청 생성 (서버 측 검증 포함)
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

      // 주문 정보 저장 (state)
      setPaymentOrderId(paymentResult.orderId);
      setPaymentOrderName(paymentResult.orderName || "주문");

      // 결제 성공 후 주문 생성에 필요한 정보를 localStorage에 저장
      const pendingOrderData = {
        orderId: paymentResult.orderId,
        items:
          paymentResult.validatedItems ||
          items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            product_name: item.product_name,
            wholesaler_id: item.wholesaler_id || "",
            shipping_fee: 0,
          })),
        deliveryOption,
        deliveryTime,
        deliveryNote,
        deliveryAddress: getDeliveryAddressString(),
        totalAmount: paymentResult.amount || summary.totalPrice,
      };
      localStorage.setItem("pendingOrder", JSON.stringify(pendingOrderData));
      console.log("💾 [결제] 주문 정보 임시 저장:", pendingOrderData);

      // 2. 토스 페이먼츠 결제 위젯 열기
      if (paymentMethod === "toss") {
        if (!isPaymentReady) {
          alert("결제 위젯이 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
          return;
        }

        // 위젯에 주문 정보 업데이트 후 결제 요청
        await requestPayment(paymentResult.orderId, paymentResult.orderName);
      } else {
        // 다른 결제 수단은 나중에 구현
        alert("토스페이먼츠만 현재 지원됩니다.");
      }
    } catch (error) {
      console.error("❌ [결제] 결제 실패:", error);
      alert(error instanceof Error ? error.message : "결제 중 오류가 발생했습니다.");
    }
  };

  const addressDetailText = defaultAddress?.address_detail
    ? defaultAddress.address_detail
    : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* 헤더 */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          주문/결제
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 주문 정보 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 배송 정보 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                배송 정보
              </h2>
              <button className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline">
                변경
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {hasDefaultAddress ? (
                <>
                  <div className="grid grid-cols-[100px_1fr] gap-4">
                    <span className="text-gray-600 dark:text-gray-400">
                      받는 분
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {defaultAddress?.recipient_name}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4">
                    <span className="text-gray-600 dark:text-gray-400">
                      연락처
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {defaultAddress?.recipient_phone}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-4">
                    <span className="text-gray-600 dark:text-gray-400">주소</span>
                    <div className="text-gray-900 dark:text-gray-100">
                      <p>{defaultAddress?.address}</p>
                      {addressDetailText && <p>{addressDetailText}</p>}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-4 text-gray-700 dark:text-gray-300">
                  등록된 배송지가 없습니다. 배송지를 추가하고 기본 배송지를 설정해 주세요.
                </div>
              )}
            </div>
          </div>

          {/* 배송 요청사항 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              배송 요청사항
            </h2>
            <textarea
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="배송 기사님께 전달할 요청사항을 입력해주세요."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 주문 상품 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              주문 상품
            </h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {item.product_image ? (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">이미지 없음</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      수량: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {(item.unit_price * item.quantity).toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 결제 정보 (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* 최종 결제 금액 */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                최종 결제 금액
              </h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    총 상품 금액
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {totalProductPrice.toLocaleString()}원
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-base font-bold">
                  <span className="text-gray-900 dark:text-gray-100">
                    총 결제 예정 금액
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 결제 수단 */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                  결제 수단
                </h3>

                {/* 토스 페이먼츠 위젯 */}
                <div
                  id="payment-methods-widget"
                  ref={paymentMethodsRef}
                  className="mb-4 min-h-[200px]"
                >
                  {paymentMethod === "toss" && (
                    <>
                      {!isPaymentReady && (
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center text-sm text-gray-500">
                          결제 위젯을 불러오는 중...
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 border-green-600 rounded-lg cursor-pointer bg-green-50 dark:bg-green-900/20">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "toss"}
                      onChange={() => setPaymentMethod("toss")}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      토스페이먼츠
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      신용/체크카드
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === "transfer"}
                      onChange={() => setPaymentMethod("transfer")}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      계좌이체
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={
                  !isPaymentReady ||
                  isPaymentLoading ||
                  (paymentMethod === "toss" && !TOSS_CLIENT_KEY) ||
                  !hasDefaultAddress
                }
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
              >
                {hasDefaultAddress
                  ? isPaymentLoading
                    ? "결제 진행 중..."
                    : `${summary.totalPrice.toLocaleString()}원 결제하기`
                  : "배송지를 등록해주세요"}
              </button>

              <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                수취인: Farm to Biz (플랫폼)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

