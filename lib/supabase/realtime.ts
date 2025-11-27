/**
 * @file realtime.ts
 * @description Supabase Realtime 구독 함수들
 *
 * 이 파일은 Supabase Realtime을 사용하여 실시간 데이터 변경을 구독하는 함수들을 제공합니다.
 * 주문 알림, 도매 승인 상태 변경, 문의 알림 등을 실시간으로 받을 수 있습니다.
 *
 * ⚠️ 중요: 메모리 누수 방지
 * - 모든 구독 함수는 cleanup 함수를 반환합니다
 * - useEffect에서 사용 시 반드시 cleanup 함수를 호출해야 합니다
 * - 컴포넌트 언마운트 시 구독을 해제하지 않으면 메모리 누수가 발생합니다
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useEffect } from 'react';
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 * import { subscribeToNewOrders } from '@/lib/supabase/realtime';
 *
 * export default function DashboardPage() {
 *   const supabase = useClerkSupabaseClient();
 *   const wholesalerId = 'your-wholesaler-id';
 *
 *   useEffect(() => {
 *     const unsubscribe = subscribeToNewOrders(
 *       supabase,
 *       wholesalerId,
 *       (order) => {
 *         console.log('새 주문:', order);
 *         // 토스트 알림 표시 등
 *       }
 *     );
 *
 *     // ⚠️ 필수: cleanup 함수 호출
 *     return () => {
 *       console.log('🧹 Cleaning up order subscription');
 *       unsubscribe();
 *     };
 *   }, [supabase, wholesalerId]);
 *
 *   return <div>대시보드</div>;
 * }
 * ```
 *
 * @dependencies
 * - @supabase/supabase-js
 * - types/order.ts
 * - types/wholesaler.ts
 * - types/inquiry.ts
 *
 * @see {@link ./clerk-client.ts} - 클라이언트 컴포넌트용 Supabase 클라이언트
 * @see {@link ./server.ts} - 서버 컴포넌트용 Supabase 클라이언트
 */

// 실시간 구독 함수들이 제거되었습니다.
// 소매 페이지에서 필요 시 별도로 구현하세요.


