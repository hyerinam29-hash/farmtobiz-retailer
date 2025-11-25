/**
 * @file app/wholesaler/dashboard/page.tsx
 * @description 도매 대시보드 페이지
 *
 * 도매업자의 메인 대시보드입니다.
 * 향후 통계, 주문 요약, 상품 요약 등의 기능이 추가될 예정입니다.
 *
 * 주요 기능:
 * 1. 대시보드 요약 정보 표시 (예정)
 * 2. 오늘의 주문 현황 (예정)
 * 3. 출고 예정 목록 (예정)
 * 4. 정산 요약 (예정)
 *
 * @dependencies
 * - components/common/PageHeader.tsx
 * - components/common/EmptyState.tsx
 * - lucide-react (LayoutDashboard 아이콘)
 */

import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description="오늘의 주문, 출고 예정, 정산 요약을 확인하세요."
      />

      <EmptyState
        message="대시보드 준비 중입니다"
        description="곧 통계 및 요약 정보를 확인할 수 있습니다."
        icon={LayoutDashboard}
      />
    </div>
  );
}

