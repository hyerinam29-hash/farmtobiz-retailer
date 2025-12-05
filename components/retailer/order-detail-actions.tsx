/**
 * @file components/retailer/order-detail-actions.tsx
 * @description 주문 상세 페이지 액션 버튼 컴포넌트
 *
 * 주문 상세 페이지의 액션 버튼들(구매 확정, 재주문 등)을 관리하는 클라이언트 컴포넌트입니다.
 * 구매 확정 모달을 통합합니다.
 *
 * @dependencies
 * - components/retailer/confirm-purchase-modal.tsx
 * - app/retailer/orders/[id]/page.tsx
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmPurchaseModal from "@/components/retailer/confirm-purchase-modal";

interface OrderDetailActionsProps {
  orderId: string;
  orderNumber: string;
  status: "preparing" | "shipping" | "delivered" | "cancelled";
  totalAmount: number;
}

export default function OrderDetailActions({
  orderId,
  orderNumber,
  status,
  totalAmount,
}: OrderDetailActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        {status === "delivered" && orderId !== "2" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            구매 확정
          </button>
        )}
      </div>

      <ConfirmPurchaseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        orderId={orderId}
        orderNumber={orderNumber}
        totalAmount={totalAmount}
      />
    </>
  );
}

