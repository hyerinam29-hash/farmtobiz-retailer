/**
 * @file components/retailer/order-list-item-actions.tsx
 * @description 주문 목록 아이템 액션 버튼 컴포넌트
 *
 * 주문 목록 페이지의 각 주문 아이템에 대한 액션 버튼들을 관리하는 클라이언트 컴포넌트입니다.
 * 구매 확정 모달을 통합합니다.
 *
 * @dependencies
 * - components/retailer/confirm-purchase-modal.tsx
 * - app/retailer/orders/page.tsx
 */

"use client";

import { useState } from "react";
import ConfirmPurchaseModal from "@/components/retailer/confirm-purchase-modal";

interface OrderListItemActionsProps {
  orderId: string;
  orderNumber: string;
  status: "preparing" | "shipping" | "delivered" | "cancelled";
  totalPrice: number;
}

export default function OrderListItemActions({
  orderId,
  orderNumber,
  status,
  totalPrice,
}: OrderListItemActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        {status === "delivered" ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg font-medium rounded-lg transition-colors"
          >
            구매 확정
          </button>
        ) : status === "preparing" ? (
          <button className="w-full sm:w-auto px-8 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 text-base sm:text-lg font-medium rounded-lg transition-colors">
            주문 취소
          </button>
        ) : null}
        <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 text-base sm:text-lg font-medium rounded-lg transition-colors">
          재주문
        </button>
      </div>

      {status === "delivered" && (
        <ConfirmPurchaseModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          orderId={orderId}
          orderNumber={orderNumber}
          totalAmount={totalPrice}
        />
      )}
    </>
  );
}

