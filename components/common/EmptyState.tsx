/**
 * @file components/common/EmptyState.tsx
 * @description 빈 상태를 표시하는 재사용 가능한 컴포넌트
 *
 * 데이터가 없을 때 사용자에게 친화적인 빈 상태 UI를 제공합니다.
 * - 아이콘 또는 일러스트 표시
 * - 메시지 및 선택적 설명 표시
 * - 선택적 액션 버튼 제공
 *
 * @dependencies
 * - lucide-react: 아이콘
 * - next/link: 링크 네비게이션
 * - @/lib/utils: cn 유틸리티
 */

import { Inbox, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /**
   * 표시할 메시지 (message 또는 title 중 하나 필수)
   */
  message?: string;
  /**
   * 표시할 제목 (message 또는 title 중 하나 필수)
   */
  title?: string;
  /**
   * 추가 설명 (선택적)
   */
  description?: string;
  /**
   * 아이콘 (선택적, 기본값: Inbox)
   */
  icon?: LucideIcon;
  /**
   * 액션 버튼 (선택적, ReactNode로 받아 유연하게 구성 가능)
   */
  action?: React.ReactNode;
  /**
   * 액션 버튼 라벨 (actionHref와 함께 사용)
   */
  actionLabel?: string;
  /**
   * 액션 버튼 링크 (actionLabel과 함께 사용)
   */
  actionHref?: string;
  /**
   * 추가 클래스명 (선택적)
   */
  className?: string;
}

export function EmptyState({
  message,
  title,
  description,
  icon: Icon = Inbox,
  action,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  // message 또는 title 중 하나는 필수
  const displayMessage = title || message || "";

  // actionLabel과 actionHref가 있으면 Link 컴포넌트 생성
  const actionButton =
    action ||
    (actionLabel && actionHref ? (
      <Link
        href={actionHref}
        className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium"
      >
        {actionLabel}
      </Link>
    ) : null);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-6 md:p-8 text-center",
        className
      )}
    >
      {/* 아이콘 */}
      <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 dark:bg-gray-800">
        <Icon
          className="w-8 h-8 md:w-10 md:h-10 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>

      {/* 메시지 및 설명 */}
      <div className="flex flex-col gap-2 max-w-md">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
          {displayMessage}
        </h3>
        {description && (
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {/* 액션 버튼 (선택적) */}
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
}

// default export도 유지 (하위 호환성)
export default EmptyState;

