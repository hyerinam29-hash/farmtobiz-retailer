/**
 * @file app/wholesaler/market-prices/page.tsx
 * @description 시세 조회 페이지
 *
 * 실시간 농수산물 경매가격을 조회하는 페이지입니다.
 * 향후 KAMIS API, AT API 연동 등의 기능이 추가될 예정입니다.
 *
 * 주요 기능:
 * 1. 실시간 시세 조회 (예정)
 * 2. 상품별 시세 검색 (예정)
 * 3. 시세 차트 표시 (예정)
 * 4. 시세 알림 설정 (예정)
 *
 * @dependencies
 * - components/common/PageHeader.tsx
 * - components/common/EmptyState.tsx
 * - lucide-react (TrendingUp 아이콘)
 */

import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { TrendingUp } from "lucide-react";

export default function MarketPricesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="시세 조회"
        description="실시간 농수산물 경매가격을 확인하세요."
      />

      <EmptyState
        message="시세 조회 준비 중입니다"
        description="곧 실시간 시세 정보를 확인할 수 있습니다."
        icon={TrendingUp}
      />
    </div>
  );
}

