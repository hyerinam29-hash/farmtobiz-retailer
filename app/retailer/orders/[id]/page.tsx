/**
 * @file app/retailer/orders/[id]/page.tsx
 * @description 소매점 주문 상세 페이지
 *
 * 주요 기능:
 * 1. 주문 정보 요약 (R.MY.01)
 * 2. 배송 타임라인 UI (R.MY.02) - 가로형 타임라인
 * 3. 구매 확정 버튼 (R.MY.03)
 *
 * @dependencies
 * - app/retailer/layout.tsx (레이아웃)
 * - components/retailer/order-detail-actions.tsx
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
import OrderDetailActions from "@/components/retailer/order-detail-actions";
import OrderProductItem from "@/components/retailer/order-product-item";
import OrderDetailBackButton from "@/components/retailer/order-detail-back-button";

// 각 주문 ID에 맞는 목 데이터 (디자인 핸드오프 기반)
const mockOrderDetails: Record<string, {
  id: string;
  order_number: string;
  order_date: string;
  status: "preparing" | "shipping" | "delivered" | "cancelled";
  status_label: string;
  delivery_method: string;
  delivery_tracking_number: string;
  products: Array<{
    id: string;
    name: string;
    image_url: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
  delivery_info: {
    recipient_name: string;
    phone: string;
    address: string;
    address_detail: string;
  };
  payment_info: {
    method: string;
    card_name: string;
    installment: string;
  };
  price_info: {
    product_total: number;
    total: number;
  };
  timeline_steps: string[];
  current_step: number;
}> = {
  "1": {
    id: "1",
    order_number: "ORD-042",
    order_date: "2023.11.28",
    status: "shipping",
    status_label: "배송중",
    delivery_method: "일반 배송",
    delivery_tracking_number: "1234-5678-9012",
    products: [
      {
        id: "p1",
        name: "청송 꿀사과 5kg",
        image_url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80",
        quantity: 2,
        unit_price: 32000,
        subtotal: 64000,
      },
      {
        id: "p2",
        name: "제주 감귤 3kg",
        image_url: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=200&q=80",
        quantity: 1,
        unit_price: 34000,
        subtotal: 34000,
      },
    ],
    delivery_info: {
      recipient_name: "김사장",
      phone: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 123",
      address_detail: "팜투비즈 빌딩 3층",
    },
    payment_info: {
      method: "신용카드",
      card_name: "현대카드",
      installment: "일시불",
    },
    price_info: {
      product_total: 98000,
      total: 98000,
    },
    timeline_steps: ["주문완료", "결제완료", "상품준비", "배송중", "배송완료"],
    current_step: 3, // 배송중 (0부터 시작, 3번째 = 배송중)
  },
  "2": {
    id: "2",
    order_number: "ORD-041",
    order_date: "2023.11.27",
    status: "delivered",
    status_label: "배송완료",
    delivery_method: "일반 배송",
    delivery_tracking_number: "1234-5678-9011",
    products: [
      {
        id: "p3",
        name: "제주 감귤 10박스",
        image_url: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=200&q=80",
        quantity: 10,
        unit_price: 15000,
        subtotal: 150000,
      },
    ],
    delivery_info: {
      recipient_name: "김사장",
      phone: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 123",
      address_detail: "팜투비즈 빌딩 3층",
    },
    payment_info: {
      method: "신용카드",
      card_name: "현대카드",
      installment: "일시불",
    },
    price_info: {
      product_total: 150000,
      total: 150000,
    },
    timeline_steps: ["주문완료", "결제완료", "상품준비", "배송중", "배송완료"],
    current_step: 4, // 배송완료
  },
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // URL 파라미터 id에 따라 해당 주문 데이터 가져오기
  const order = mockOrderDetails[id] || mockOrderDetails["1"];

  console.log("📦 [order-detail] 주문 상세 조회:", { orderId: id, orderNumber: order.order_number });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* 뒤로가기 버튼 및 제목 */}
      <div className="flex items-center gap-4 mb-8">
        <OrderDetailBackButton />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          주문 상세 내역
        </h1>
      </div>

      {/* 주문 상태 타임라인 (가로형) */}
      <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center relative mb-8">
          {/* 진행선 배경 */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>
          {/* 진행선 (녹색) */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 transition-all duration-1000" 
            style={{ width: `${(order.current_step / (order.timeline_steps.length - 1)) * 100}%` }}
          ></div>
          
          {/* 타임라인 단계들 */}
          {order.timeline_steps.map((step, idx) => {
            const isCompleted = idx <= order.current_step;
            return (
              <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  isCompleted 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? <Check size={16} /> : idx + 1}
                </div>
                <span className={`text-xs font-bold ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* 배송 상태 배너 */}
        {order.status === "shipping" && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg flex items-center gap-3 text-green-800">
            <Truck size={24} />
            <span className="font-bold">
              고객님의 상품이 배송 중입니다. (롯데택배 {order.delivery_tracking_number})
            </span>
          </div>
        )}
        {order.status === "delivered" && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg flex items-center gap-3 text-green-800">
            <Check size={24} />
            <span className="font-bold">
              배송이 완료되었습니다.
            </span>
          </div>
        )}
      </div>

      {/* 배송지 정보 & 결제 정보 (2열 그리드) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 배송지 정보 */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-green-600" /> 배송지 정보
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-bold text-gray-900 text-base">{order.delivery_info.recipient_name}</p>
            <p>{order.delivery_info.phone}</p>
            <p>{order.delivery_info.address}</p>
            <p>{order.delivery_info.address_detail}</p>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-green-600" /> 결제 정보
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">결제수단</span>
              <span className="text-gray-900 font-medium">
                {order.payment_info.method} ({order.payment_info.card_name})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">할부정보</span>
              <span className="text-gray-900 font-medium">{order.payment_info.installment}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-800">총 결제금액</span>
              <span className="font-black text-xl text-green-600">
                {order.price_info.total.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 주문 상품 목록 */}
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package size={20} className="text-green-600" /> 주문 상품 ({order.products.length})
        </h3>
        <div className="space-y-4">
          {order.products.map((item) => (
            <OrderProductItem
              key={item.id}
              id={item.id}
              name={item.name}
              image_url={item.image_url}
              quantity={item.quantity}
              unit_price={item.unit_price}
            />
          ))}
        </div>
      </div>

      {/* 액션 버튼 (R.MY.03) */}
      <div className="mt-8">
        <OrderDetailActions
          orderId={order.id}
          orderNumber={order.order_number}
          status={order.status}
          totalAmount={order.price_info.total}
        />
      </div>
    </div>
  );
}
