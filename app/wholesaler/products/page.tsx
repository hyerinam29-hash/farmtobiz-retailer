/**
 * @file app/wholesaler/products/page.tsx
 * @description 상품 관리 페이지
 *
 * 도매업자가 등록한 상품 목록을 관리하는 페이지입니다.
 * 향후 상품 목록, 검색, 필터링 등의 기능이 추가될 예정입니다.
 *
 * 주요 기능:
 * 1. 상품 목록 표시 (예정)
 * 2. 상품 검색 및 필터링 (예정)
 * 3. 상품 등록 버튼 (예정)
 * 4. 상품 수정/삭제 (예정)
 *
 * @dependencies
 * - components/common/PageHeader.tsx
 * - components/common/EmptyState.tsx
 * - lucide-react (Package 아이콘)
 */

import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Package } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="상품 관리"
        description="등록한 상품을 관리하고 새로운 상품을 등록하세요."
      />

      <EmptyState
        message="상품 관리 준비 중입니다"
        description="곧 상품 목록을 확인하고 관리할 수 있습니다."
        icon={Package}
      />
    </div>
  );
}

