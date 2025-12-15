/**
 * @file components/retailer/cancel-order-modal.tsx
 * @description 주문 취소 확인 모달 컴포넌트
 *
 * 주문 취소 전 사용자에게 확인을 받는 모달입니다.
 *
 * @dependencies
 * - actions/retailer/cancel-order.ts
 * - components/ui/dialog.tsx (shadcn)
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cancelOrder } from "@/actions/retailer/cancel-order";
import { Loader2 } from "lucide-react";

interface CancelOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber: string;
}

export default function CancelOrderModal({
  open,
  onOpenChange,
  orderId,
  orderNumber,
}: CancelOrderModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    console.log("🚫 [주문 취소 모달] 주문 취소 시작", {
      orderId,
      orderNumber,
    });

    try {
      const result = await cancelOrder({ orderId });

      if (!result.success) {
        console.error("❌ [주문 취소 모달] 주문 취소 실패:", result.error);
        alert(result.error || "주문 취소에 실패했습니다.");
        setIsLoading(false);
        return;
      }

      console.log("✅ [주문 취소 모달] 주문 취소 성공");
      
      // 모달 닫기
      onOpenChange(false);
      
      // 페이지 새로고침 (상태 반영)
      router.refresh();
    } catch (error) {
      console.error("❌ [주문 취소 모달] 주문 취소 중 오류:", error);
      alert("주문 취소 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg min-h-[320px] sm:min-h-[360px]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl">주문 취소</DialogTitle>
          <DialogDescription className="text-base sm:text-lg mt-2">
            정말 주문을 취소하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 sm:py-8">
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            주문번호: <span className="font-medium text-gray-900 dark:text-gray-100">{orderNumber}</span>
          </p>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            취소된 주문은 복구할 수 없으며, 재고가 삭제됩니다.
          </p>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="text-base sm:text-lg px-6 py-3"
          >
            돌아가기
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="text-base sm:text-lg px-6 py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                취소 중...
              </>
            ) : (
              "주문 취소"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

