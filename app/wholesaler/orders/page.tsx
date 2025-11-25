/**
 * @file app/wholesaler/orders/page.tsx
 * @description 주문 관리 페이지
 *
 * 소매점으로부터 들어온 주문을 관리하는 페이지입니다.
 * 향후 주문 목록, 필터링, 상태 변경 등의 기능이 추가될 예정입니다.
 *
 * 주요 기능:
 * 1. 주문 목록 표시 (예정)
 * 2. 주문 상태 필터링 (예정)
 * 3. 주문 상태 변경 (예정)
 * 4. 주문 상세 조회 (예정)
 *
 * @dependencies
 * - components/common/PageHeader.tsx
 * - components/common/EmptyState.tsx
 * - lucide-react (ShoppingCart 아이콘)
 */

import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="주문 관리"
        description="들어온 주문을 확인하고 처리하세요."
      />

      <EmptyState
        message="주문 관리 준비 중입니다"
        description="곧 주문 목록을 확인하고 관리할 수 있습니다."
        icon={ShoppingCart}
      />
    </div>
  );
}

