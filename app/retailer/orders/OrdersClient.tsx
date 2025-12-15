/**
 * @file app/retailer/orders/OrdersClient.tsx
 * @description 주문 내역 페이지 클라이언트 컴포넌트
 *
 * 검색 기능을 포함한 주문 내역 표시 컴포넌트입니다.
 * 상품명과 주문번호로 검색할 수 있습니다.
 *
 * 주요 기능:
 * 1. 상품명 및 주문번호 검색 (R.SEARCH.01)
 * 2. 검색 결과 실시간 필터링
 * 3. 주문 상태별 필터링
 * 4. 주문 목록 표시
 *
 * @dependencies
 * - components/retailer/order-list-item-actions.tsx
 */

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import OrderListItemActions from "@/components/retailer/order-list-item-actions";

// 타입 정의
type OrderStatus = "preparing" | "shipping" | "delivered" | "cancelled";

// 주문 목록 표시용 타입 (UI에 맞게 변환)
interface OrderListItem {
  id: string;
  order_number: string;
  order_date: string;
  products: Array<{
    name: string;
    quantity: number;
  }>;
  total_price: number;
  status: OrderStatus;
  status_label: string;
  delivery_method: string;
  delivery_scheduled_time: string;
}

interface OrdersClientProps {
  orders: OrderListItem[];
}

const statusColors = {
  preparing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  shipping: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function OrdersClient({ orders }: OrdersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");

  console.log("[OrdersClient] 검색 기능 초기화", { ordersCount: orders.length });

  // 검색 및 상태 필터링 로직
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // 상태 필터 적용
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
      console.log("[OrdersClient] 상태 필터 적용", {
        selectedStatus,
        filteredCount: filtered.length,
      });
    }

    // 검색어 필터 적용
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      console.log("[OrdersClient] 검색 시작", { query });

      filtered = filtered.filter((order) => {
        // 주문번호 검색
        const orderNumberMatch = order.order_number.toLowerCase().includes(query);

        // 상품명 검색 (모든 상품명 확인)
        const productNameMatch = order.products.some((product) =>
          product.name.toLowerCase().includes(query)
        );

        return orderNumberMatch || productNameMatch;
      });

      console.log("[OrdersClient] 검색 완료", {
        query,
        total: orders.length,
        filtered: filtered.length,
      });
    }

    return filtered;
  }, [orders, searchQuery, selectedStatus]);

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-8 sm:pb-12 md:pb-16"
      style={{ paddingTop: "1rem" }}
    >
      {/* 헤더 */}
      <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-gray-100">
          주문 내역
        </h1>
        <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
          주문 상태 및 배송 정보를 확인하세요
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
        {/* 검색창 */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-gray-400" />
            <input
              type="text"
              placeholder="상품명, 주문번호로 검색"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                console.log("[OrdersClient] 검색어 변경", { value });
                setSearchQuery(value);
              }}
              className="w-full pl-10 sm:pl-12 md:pl-16 lg:pl-20 pr-4 sm:pr-6 md:pr-8 py-3 sm:py-4 md:py-5 lg:py-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base md:text-lg"
            />
          </div>
        </div>
      </div>

      {/* 상태 필터 */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12 overflow-x-auto pb-2 sm:pb-3 md:pb-4">
        <button
          onClick={() => {
            console.log("[OrdersClient] 상태 필터 변경", { status: "all" });
            setSelectedStatus("all");
          }}
          className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
            selectedStatus === "all"
              ? "bg-green-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => {
            console.log("[OrdersClient] 상태 필터 변경", { status: "preparing" });
            setSelectedStatus("preparing");
          }}
          className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
            selectedStatus === "preparing"
              ? "bg-green-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          주문 완료
        </button>
        <button
          onClick={() => {
            console.log("[OrdersClient] 상태 필터 변경", { status: "shipping" });
            setSelectedStatus("shipping");
          }}
          className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
            selectedStatus === "shipping"
              ? "bg-green-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          배송 중
        </button>
        <button
          onClick={() => {
            console.log("[OrdersClient] 상태 필터 변경", { status: "delivered" });
            setSelectedStatus("delivered");
          }}
          className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
            selectedStatus === "delivered"
              ? "bg-green-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          배송 완료
        </button>
        <button
          onClick={() => {
            console.log("[OrdersClient] 상태 필터 변경", { status: "cancelled" });
            setSelectedStatus("cancelled");
          }}
          className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
            selectedStatus === "cancelled"
              ? "bg-green-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          주문 취소
        </button>
      </div>

      {/* 검색 결과 표시 */}
      {(searchQuery.trim() || selectedStatus !== "all") && (
        <div className="mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
          {selectedStatus !== "all" && (
            <span>
              상태: <span className="font-semibold">
                {selectedStatus === "preparing"
                  ? "주문 완료"
                  : selectedStatus === "shipping"
                    ? "배송 중"
                    : selectedStatus === "delivered"
                      ? "배송 완료"
                      : selectedStatus === "cancelled"
                        ? "주문 취소"
                        : "전체"}
              </span>
              {searchQuery.trim() && " · "}
            </span>
          )}
          {searchQuery.trim() && (
            <span>
              검색 결과: <span className="font-semibold">{filteredOrders.length}건</span>
            </span>
          )}
        </div>
      )}

      {/* 주문 목록 */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        {filteredOrders.length === 0 ? (
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
              {searchQuery.trim() || selectedStatus !== "all"
                ? "검색 결과가 없습니다"
                : "주문 내역이 없습니다"}
            </p>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-500">
              {searchQuery.trim() || selectedStatus !== "all"
                ? "다른 검색어나 필터로 시도해보세요"
                : "주문을 하시면 여기에 표시됩니다"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 sm:p-5 md:p-6 lg:p-8 xl:p-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              {/* 주문 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 md:gap-6 lg:gap-8 pb-4 sm:pb-5 md:pb-6 lg:pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-600 dark:text-gray-400">
                      {order.order_date}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 hidden sm:inline">·</span>
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-900 dark:text-gray-100 break-all">
                      {order.order_number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 md:py-1 lg:px-5 lg:py-1 rounded-full text-xs sm:text-sm md:text-base font-medium ${statusColors[order.status as keyof typeof statusColors]}`}
                    >
                      {order.status_label}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
                      {order.delivery_method}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/retailer/orders/${order.id}`}
                  className="text-xs sm:text-sm md:text-base lg:text-lg text-green-600 dark:text-green-400 font-medium hover:underline whitespace-nowrap flex-shrink-0 mt-2 sm:mt-0"
                >
                  상세 보기
                </Link>
              </div>

              {/* 주문 내용 */}
              <div className="py-4 sm:py-5 md:py-6 lg:py-8">
                <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                  {order.products.map((product, index) => (
                    <p
                      key={index}
                      className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 break-words"
                    >
                      {product.name}
                      {order.products.length > 1 &&
                        index === 0 &&
                        ` 외 ${order.products.length - 1}건`}
                    </p>
                  ))}
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400">
                    수량: {order.products.reduce((sum, p) => sum + p.quantity, 0)}개
                  </p>
                </div>
              </div>

              {/* 주문 푸터 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5 md:gap-6 lg:gap-8 pt-4 sm:pt-5 md:pt-6 lg:pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400">
                    결제 금액
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {order.total_price.toLocaleString()}원
                  </span>
                </div>

                <div className="mt-2 sm:mt-0">
                  <OrderListItemActions
                    orderId={order.id}
                    orderNumber={order.order_number}
                    status={order.status}
                    totalPrice={order.total_price}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

