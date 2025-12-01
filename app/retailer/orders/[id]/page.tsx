/**
 * @file app/retailer/orders/[id]/page.tsx
 * @description 소매점 주문 상세 페이지
 *
 * 주요 기능:
 * 1. 주문 정보 요약 (R.MY.01)
 * 2. 배송 타임라인 UI (R.MY.02)
 * 3. 구매 확정 버튼 (R.MY.03)
 *
 * @dependencies
 * - app/retailer/layout.tsx (레이아웃)
 * - components/retailer/confirm-purchase-modal.tsx
 *
 * @see {@link PRD.md} - R.MY.01~03 요구사항
 */

import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Phone,
} from "lucide-react";
import OrderDetailActions from "@/components/retailer/order-detail-actions";

// 각 주문 ID에 맞는 목 데이터 (추후 API로 교체 예정)
const mockOrderDetails: Record<string, {
  id: string;
  order_number: string;
  order_date: string;
  status: "preparing" | "shipping" | "delivered" | "cancelled";
  status_label: string;
  delivery_method: string;
  delivery_scheduled_time: string;
  products: Array<{
    id: string;
    name: string;
    image_url: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    anonymous_seller_id: string;
    seller_region: string;
  }>;
  delivery_info: {
    recipient_name: string;
    phone: string;
    address: string;
    address_detail: string;
    request: string;
  };
  payment_info: {
    method: string;
    card_name: string;
    card_number: string;
    paid_at: string;
  };
  price_info: {
    product_total: number;
    total: number;
  };
  timeline: Array<{
    status: string;
    label: string;
    timestamp: string | null;
    completed: boolean;
  }>;
}> = {
  "1": {
    id: "1",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    order_date: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    status: "delivered",
    status_label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_scheduled_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    products: [
      {
        id: "p1",
        name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
        quantity: 0, // 수량 삭제, 나중에 내용 추가 가능
        unit_price: 0, // 가격 삭제, 나중에 내용 추가 가능
        subtotal: 0, // 가격 삭제, 나중에 내용 추가 가능
        anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      },
    ],
    delivery_info: {
      recipient_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      phone: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      address: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      address_detail: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      request: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    },
    payment_info: {
      method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      card_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      card_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      paid_at: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    },
    price_info: {
      product_total: 0, // 가격 삭제, 나중에 내용 추가 가능
      total: 0, // 가격 삭제, 나중에 내용 추가 가능
    },
    timeline: [
      {
        status: "ordered",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "confirmed",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "preparing",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "shipping",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "delivered",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
    ],
  },
  "2": {
    id: "2",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    order_date: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    status: "shipping",
    status_label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_scheduled_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    products: [
      {
        id: "p2",
        name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
        quantity: 0, // 수량 삭제, 나중에 내용 추가 가능
        unit_price: 0, // 가격 삭제, 나중에 내용 추가 가능
        subtotal: 0, // 가격 삭제, 나중에 내용 추가 가능
        anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      },
    ],
    delivery_info: {
      recipient_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      phone: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      address: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      address_detail: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      request: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    },
    payment_info: {
      method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      card_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      card_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      paid_at: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    },
    price_info: {
      product_total: 0, // 가격 삭제, 나중에 내용 추가 가능
      total: 0, // 가격 삭제, 나중에 내용 추가 가능
    },
    timeline: [
      {
        status: "ordered",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "confirmed",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "preparing",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "shipping",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "delivered",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: null,
        completed: false,
      },
    ],
  },
  "3": {
    id: "3",
    order_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    order_date: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    status: "preparing",
    status_label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    delivery_scheduled_time: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    products: [
      {
        id: "p3",
        name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
        quantity: 0, // 수량 삭제, 나중에 내용 추가 가능
        unit_price: 0, // 가격 삭제, 나중에 내용 추가 가능
        subtotal: 0, // 가격 삭제, 나중에 내용 추가 가능
        anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      },
      {
        id: "p4",
        name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        image_url: null, // 데모 이미지 삭제, 나중에 이미지 추가 가능
        quantity: 0, // 수량 삭제, 나중에 내용 추가 가능
        unit_price: 0, // 가격 삭제, 나중에 내용 추가 가능
        subtotal: 0, // 가격 삭제, 나중에 내용 추가 가능
        anonymous_seller_id: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        seller_region: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      },
    ],
    delivery_info: {
      recipient_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      phone: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      address: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      address_detail: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      request: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    },
    payment_info: {
      method: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      card_name: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      card_number: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
      paid_at: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
    },
    price_info: {
      product_total: 0, // 가격 삭제, 나중에 내용 추가 가능
      total: 0, // 가격 삭제, 나중에 내용 추가 가능
    },
    timeline: [
      {
        status: "ordered",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "confirmed",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "preparing",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        completed: false,
      },
      {
        status: "shipping",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: null,
        completed: false,
      },
      {
        status: "delivered",
        label: "", // 텍스트 내용 삭제, 나중에 내용 추가 가능
        timestamp: null,
        completed: false,
      },
    ],
  },
};

const statusColors = {
  preparing:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  shipping:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  delivered:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // URL 파라미터 id에 따라 해당 주문 데이터 가져오기
  const order = mockOrderDetails[id] || mockOrderDetails["1"]; // 기본값으로 첫 번째 주문 사용

  console.log("📦 [order-detail] 주문 상세 조회:", { orderId: id });

  // 구매 확정 모달 상태 관리를 위한 클라이언트 컴포넌트로 분리 필요
  // 현재는 Server Component이므로 클라이언트 래퍼 컴포넌트 생성

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* 뒤로가기 버튼 */}
      <Link
        href="/retailer/orders"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>주문 내역으로 돌아가기</span>
      </Link>

      {/* 주문 헤더 */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              주문 상세
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              주문번호: {order.order_number}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}
          >
            {order.status_label}
          </span>
        </div>
      </div>

      {/* 배송 타임라인 (R.MY.02) */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          배송 현황
        </h2>
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>예정 배송 시간: {order.delivery_scheduled_time}</span>
        </div>

        {/* 타임라인 */}
        <div className="relative">
          {order.timeline.map((step, index) => (
            <div key={step.status} className="flex items-start gap-4 pb-6 last:pb-0">
              {/* 아이콘 및 연결선 */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                  }`}
                >
                  {step.status === "ordered" && <Package className="w-5 h-5" />}
                  {step.status === "confirmed" && <CheckCircle className="w-5 h-5" />}
                  {step.status === "preparing" && <Package className="w-5 h-5" />}
                  {step.status === "shipping" && <Truck className="w-5 h-5" />}
                  {step.status === "delivered" && <CheckCircle className="w-5 h-5" />}
                </div>
                {index < order.timeline.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 mt-2 ${
                      step.completed
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    style={{ minHeight: "24px" }}
                  />
                )}
              </div>

              {/* 단계 정보 */}
              <div className="flex-1 pt-2">
                <p
                  className={`font-medium ${
                    step.completed
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                {step.timestamp && step.completed && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {step.timestamp}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주문 상품 */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          주문 상품
        </h2>
        <div className="space-y-4">
          {order.products.map((product) => (
            <div
              key={product.id}
              className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              {/* 상품 이미지 */}
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">이미지 없음</span>
                  </div>
                )}
              </div>

              {/* 상품 정보 */}
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {product.anonymous_seller_id} · {product.seller_region}
                </p>
                <p className="font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {product.name}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {product.unit_price.toLocaleString()}원 × {product.quantity}개
                  </p>
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {product.subtotal.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 배송 정보 */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          배송 정보
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {order.delivery_info.recipient_name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {order.delivery_info.address}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {order.delivery_info.address_detail}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              {order.delivery_info.phone}
            </p>
          </div>
          {order.delivery_info.request && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  배송 요청사항:
                </span>{" "}
                {order.delivery_info.request}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          결제 정보
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                {order.payment_info.method}
                {order.payment_info.card_name && ` (${order.payment_info.card_name})`}
              </p>
              {order.payment_info.card_number && (
                <p className="text-gray-500 dark:text-gray-500">
                  {order.payment_info.card_number}
                </p>
              )}
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">상품 금액</span>
              <span className="text-gray-900 dark:text-gray-100">
                {order.price_info.product_total.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-gray-100">총 결제 금액</span>
              <span className="text-green-600 dark:text-green-400">
                {order.price_info.total.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 (R.MY.03) */}
      <OrderDetailActions
        orderId={order.id}
        orderNumber={order.order_number}
        status={order.status}
        totalAmount={order.price_info.total}
      />
    </div>
  );
}

