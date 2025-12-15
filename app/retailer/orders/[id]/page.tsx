/**
 * @file app/retailer/orders/[id]/page.tsx
 * @description 소매점 주문 상세 페이지 (실데이터 연동)
 *
 * 주요 기능:
 * 1. 주문 정보 요약 (R.MY.01)
 * 2. 배송 타임라인 UI (R.MY.02) - 가로형 타임라인
 * 3. 구매 확정 버튼 (R.MY.03)
 *
 * @dependencies
 * - app/retailer/layout.tsx (레이아웃)
 * - components/retailer/order-detail-actions.tsx
 * - lib/supabase/queries/orders.ts (getOrderById)
 *
 * @see {@link PRD.md} - R.MY.01~03 요구사항
 * @see {@link docs/design-handoff/17-OrderDetailPage} - 디자인 핸드오프
 */

import {
  Package,
  Truck,
  Check,
  MapPin,
  CreditCard,
} from "lucide-react";
import { getOrderById } from "@/lib/supabase/queries/orders";
import OrderDetailActions from "@/components/retailer/order-detail-actions";
import OrderProductItem from "@/components/retailer/order-product-item";
import OrderDetailBackButton from "@/components/retailer/order-detail-back-button";

type UiStatus = "preparing" | "shipping" | "delivered" | "cancelled";

const statusMap: Record<string, UiStatus> = {
  pending: "preparing",
  confirmed: "preparing",
  shipped: "shipping",
  completed: "delivered",
  cancelled: "cancelled",
};

const timeline = [
  { key: "pending", label: "주문완료" },
  { key: "confirmed", label: "결제완료" },
  { key: "shipped", label: "배송중" },
  { key: "completed", label: "배송완료" },
];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    console.log("⚠️ [order-detail] 주문 없음", { orderId: id });
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <OrderDetailBackButton />
        <p className="mt-6 text-lg font-semibold text-gray-800 dark:text-gray-100">
          주문을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const uiStatus = statusMap[order.status] ?? "preparing";
  const currentStep = Math.max(
    0,
    timeline.findIndex((step) => step.key === order.status),
  );

  const productItem = {
    id: order.product.id,
    name:
      order.product.name ||
      order.product.standardized_name ||
      "상품명 없음",
    image_url: order.product.image_url,
    quantity: order.quantity,
    unit_price: order.unit_price,
  };

  console.log("📦 [order-detail] 실데이터 조회 완료", {
    orderId: order.id,
    orderNumber: order.order_number,
    status: order.status,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8">
      {/* 뒤로가기 버튼 및 제목 */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
        <OrderDetailBackButton />
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-50">
          주문 상세 내역
        </h1>
      </div>

      {/* 주문 상태 타임라인 (가로형) */}
      <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex justify-between items-center relative mb-4 sm:mb-5 md:mb-6 lg:mb-8">
          {/* 진행선 배경 */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 sm:h-1 bg-gray-100 dark:bg-gray-800 -z-10 transform -translate-y-1/2"></div>
          {/* 진행선 (녹색) */}
          <div
            className="absolute top-1/2 left-0 h-0.5 sm:h-1 bg-green-500 -z-10 transform -translate-y-1/2 transition-all duration-700"
            style={{
              width: `${(currentStep / Math.max(timeline.length - 1, 1)) * 100}%`,
            }}
          ></div>

          {/* 타임라인 단계들 */}
          {timeline.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            return (
              <div
                key={step.key}
                className="flex flex-col items-center gap-1 sm:gap-2 bg-white dark:bg-gray-900 px-1 sm:px-2"
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 transition-colors ${
                    isCompleted
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check size={12} className="sm:w-4 sm:h-4 md:w-4 md:h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-bold ${
                    isCompleted ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 배송 상태 배너 */}
        {uiStatus === "shipping" && (
          <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 p-3 sm:p-4 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-green-800 dark:text-green-200">
            <Truck size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
            <span className="font-bold">
              상품이 배송 중입니다.
            </span>
          </div>
        )}
        {uiStatus === "delivered" && (
          <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 p-3 sm:p-4 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-green-800 dark:text-green-200">
            <Check size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
            <span className="font-bold">
              배송이 완료되었습니다.
            </span>
          </div>
        )}
        {uiStatus === "preparing" && (
          <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-blue-800 dark:text-blue-200">
            <Package size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
            <span className="font-bold">상품을 준비 중입니다.</span>
          </div>
        )}
        {uiStatus === "cancelled" && (
          <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-red-800 dark:text-red-200">
            <Package size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
            <span className="font-bold">주문이 취소되었습니다.</span>
          </div>
        )}
      </div>

      {/* 배송지 정보 & 결제 정보 (2열 그리드) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6 lg:mb-8">
        {/* 배송지 정보 */}
        <div className="p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
            <MapPin size={16} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0" /> 배송지 정보
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {(() => {
              // 배송지 정보 파싱 (형식: "상호명 | 연락처 | 주소 | 상세주소")
              // split 후 trim으로 공백 제거 (빈 문자열은 유지하여 인덱스 보존)
              const addressParts = order.delivery_address
                ? order.delivery_address.split(" | ").map(part => part.trim())
                : [];
              
              console.log("📦 [order-detail] 배송지 정보 파싱:", {
                original: order.delivery_address,
                parts: addressParts,
                partsLength: addressParts.length,
              });
              
              const businessName = addressParts[0] || "";
              const phone = addressParts[1] || "";
              const address = addressParts[2] || "";
              const addressDetail = addressParts[3] || "";

              // 파싱된 정보가 없으면 원본 텍스트 표시
              if (addressParts.length === 0) {
                return (
                  <p className="break-words">{order.delivery_address || "주소 정보 없음"}</p>
                );
              }

              return (
                <>
                  {businessName && (
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base break-words">
                      {businessName}
                    </p>
                  )}
                  {phone && (
                    <p className="break-words">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">전화번호:</span> {phone}
                    </p>
                  )}
                  {address && (
                    <>
                      <p className="break-words">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">주소:</span> {address}
                      </p>
                      {/* 상세 주소: 주소가 있으면 항상 표시 (값이 없으면 "상세 주소: "만 표시) */}
                      <p className="break-words">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">상세 주소:</span>
                        {addressDetail ? ` ${addressDetail}` : ""}
                      </p>
                    </>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
            <CreditCard size={16} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0" /> 결제 정보
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400">결제수단</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                확인 중
              </span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2 sm:pt-3 flex justify-between items-center">
              <span className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100">
                총 결제금액
              </span>
              <span className="font-black text-lg sm:text-xl md:text-2xl text-green-600">
                {order.total_amount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 주문 상품 목록 */}
      <div className="p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
          <Package size={16} className="sm:w-5 sm:h-5 text-green-600 flex-shrink-0" /> 주문 상품 (1)
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <OrderProductItem {...productItem} />
        </div>
      </div>

      {/* 액션 버튼 (R.MY.03) */}
      <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8">
        <OrderDetailActions
          orderId={order.id}
          orderNumber={order.order_number}
          status={uiStatus}
          totalAmount={order.total_amount}
        />
      </div>
    </div>
  );
}
