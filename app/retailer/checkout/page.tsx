/**
 * @file app/retailer/checkout/page.tsx
 * @description 소매점 주문/결제 페이지
 *
 * 주요 기능:
 * 1. 배송 옵션 선택 (R.ORDER.01)
 * 2. 배송 시간 지정 (R.ORDER.02)
 * 3. Toss Payments 연동 (R.ORDER.03)
 * 4. 수취인 플랫폼 (R.ORDER.04)
 * 5. 데이터 무결성 (R.ORDER.05)
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Package, CreditCard } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const summary = useCartStore((state) => state.getSummary());

  // 배송 옵션 상태
  const [deliveryOption, setDeliveryOption] = useState<"dawn" | "normal">("dawn");
  const [deliveryTime, setDeliveryTime] = useState("06:00-07:00");
  const [deliveryNote, setDeliveryNote] = useState("");

  // 결제 수단 상태
  const [paymentMethod, setPaymentMethod] = useState<"toss" | "card" | "transfer">("toss");

  // 사용자 정보 (임시 - 나중에 실제 사용자 정보로 교체)
  const mockUserInfo = {
    name: "홍길동",
    phone: "010-1234-5678",
    address: "서울특별시 강남구 테헤란로 123",
    addressDetail: "456호",
  };

  // 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
  useEffect(() => {
    if (items.length === 0) {
      console.log("⚠️ [결제] 장바구니가 비어있어 장바구니 페이지로 리다이렉트");
      router.push("/retailer/cart");
    }
  }, [items.length, router]);

  // 장바구니가 비어있으면 아무것도 렌더링하지 않음
  if (items.length === 0) {
    return null;
  }

  const totalProductPrice = summary.totalProductPrice;
  const totalPrice = summary.totalPrice;

  // 결제 처리 함수
  const handlePayment = async () => {
    console.log("💳 [결제] 결제 프로세스 시작:", {
      totalPrice,
      paymentMethod,
      itemsCount: items.length,
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    });

    try {
      // TODO: Toss Payments 연동
      // 1. 서버에 결제 요청 생성 (Server Action 또는 API Route)
      // 2. Toss Payments 위젯 열기
      // 3. 결제 완료 후 주문 생성
      // 4. 장바구니 비우기
      // 5. 주문 완료 페이지로 이동

      alert("결제 기능은 Toss Payments 연동 후 구현됩니다.");
    } catch (error) {
      console.error("❌ [결제] 결제 실패:", error);
      alert("결제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

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
              <div className="grid grid-cols-[100px_1fr] gap-4">
                <span className="text-gray-600 dark:text-gray-400">
                  받는 분
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {mockUserInfo.name}
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4">
                <span className="text-gray-600 dark:text-gray-400">
                  연락처
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {mockUserInfo.phone}
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-4">
                <span className="text-gray-600 dark:text-gray-400">주소</span>
                <div className="text-gray-900 dark:text-gray-100">
                  <p>{mockUserInfo.address}</p>
                  <p>{mockUserInfo.addressDetail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 배송 옵션 */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              배송 옵션
            </h2>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 border-green-600 rounded-lg cursor-pointer bg-green-50 dark:bg-green-900/20">
                <input
                  type="radio"
                  name="delivery-option"
                  checked={deliveryOption === "dawn"}
                  onChange={() => setDeliveryOption("dawn")}
                  className="mt-0.5 w-5 h-5 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      새벽 배송
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    다음날 오전 7시 전 도착
                  </p>
                  {/* 시간 선택 */}
                  {deliveryOption === "dawn" && (
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="mt-3 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                    >
                      <option value="06:00-07:00">오전 6:00 ~ 7:00</option>
                      <option value="07:00-08:00">오전 7:00 ~ 8:00</option>
                    </select>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <input
                  type="radio"
                  name="delivery-option"
                  checked={deliveryOption === "normal"}
                  onChange={() => setDeliveryOption("normal")}
                  className="mt-0.5 w-5 h-5 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-gray-600" />
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      일반 배송
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    2-3일 소요
                  </p>
                </div>
              </label>
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
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
              >
                {totalPrice.toLocaleString()}원 결제하기
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
