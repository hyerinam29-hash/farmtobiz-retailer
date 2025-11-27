/**
 * @file components/retailer/confirm-purchase-modal.tsx
 * @description 구매 확정 확인 모달 컴포넌트
 *
 * 배송 완료된 주문에 대해 구매 확정을 진행하는 모달입니다.
 * 구매 확정 시 정산 로직이 트리거됩니다.
 *
 * 주요 기능:
 * 1. 구매 확정 확인 모달 표시
 * 2. 구매 확정 Server Action 호출
 * 3. 성공/실패 처리 및 피드백
 *
 * @dependencies
 * - components/ui/dialog.tsx
 * - components/ui/button.tsx
 * - actions/retailer/confirm-purchase.ts
 *
 * @see {@link PRD.md} - R.MY.03 요구사항
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { confirmPurchase } from "@/actions/retailer/confirm-purchase";
import { useRouter } from "next/navigation";

interface ConfirmPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber: string;
  totalAmount: number;
}

export default function ConfirmPurchaseModal({
  open,
  onOpenChange,
  orderId,
  orderNumber,
  totalAmount,
}: ConfirmPurchaseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    console.log("✅ [confirm-purchase-modal] 구매 확정 시작", {
      orderId,
      orderNumber,
    });

    try {
      const result = await confirmPurchase(orderId);

      if (!result.success) {
        console.error("❌ [confirm-purchase-modal] 구매 확정 실패:", result.error);
        setError(result.error || "구매 확정 중 오류가 발생했습니다.");
        return;
      }

      console.log("✅ [confirm-purchase-modal] 구매 확정 완료", {
        orderId,
        settlementId: result.settlementId,
      });

      // 성공 시 모달 닫고 페이지 새로고침
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      console.error("❌ [confirm-purchase-modal] 구매 확정 예외:", err);
      setError(
        err instanceof Error
          ? err.message
          : "구매 확정 중 예상치 못한 오류가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <CheckCircle className="w-6 h-6 text-green-600" />
            구매 확정
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            주문을 확정하시겠습니까?
            <br />
            구매 확정 후에는 정산이 시작됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">주문번호</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {orderNumber}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">결제 금액</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 구매 확정 후에는 주문 취소가 불가능합니다.
              <br />
              정산은 구매 확정 후 7일 후에 진행됩니다.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                처리 중...
              </>
            ) : (
              "구매 확정"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

