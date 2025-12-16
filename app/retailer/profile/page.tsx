/**
 * @file app/retailer/profile/page.tsx
 * @description 소매점 마이페이지
 *
 * 디자인 핸드오프 12-MyPage에 맞춘 마이페이지를 제공합니다.
 *
 * 주요 기능:
 * 1. 사용자 정보 표시 (프로필, 이름, VIP 뱃지, 상호명, 이메일)
 * 2. 주문 통계 표시 (전체 주문, 배송 중, 배송 완료)
 * 3. 메뉴 영역 (주문 내역, 찜한 상품, 설정, 로그아웃)
 * 4. 최근 주문 내역 리스트
 *
 * @dependencies
 * - lib/clerk/auth.ts (requireRetailer, getCurrentUser)
 * - lib/supabase/queries/orders.ts (getOrderStats, getOrders)
 * - components/retailer/profile/MyPage.tsx
 */

export const dynamic = "force-dynamic";

import { requireRetailer, getCurrentUser } from "@/lib/clerk/auth";
import { getOrderStats, getOrders } from "@/lib/supabase/queries/orders";
import MyPage from "@/components/retailer/profile/MyPage";
import type { OrderDetail } from "@/types/order";

export default async function ProfilePage() {
  // 소매점 권한 확인
  const profile = await requireRetailer();
  const clerkUser = await getCurrentUser();

  console.log("✅ [retailer] 마이페이지: 권한 확인됨", {
    email: profile.email,
    role: profile.role,
  });

  // 사용자 정보 추출
  const userName =
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    "사용자";
  const email = profile.email || clerkUser?.emailAddresses[0]?.emailAddress || "";
  const retailer = profile.retailers?.[0];
  const businessName = retailer?.business_name || "상호명 없음";

  // 주문 통계 조회
  let orderStats = {
    totalOrders: 0,
    shippedCount: 0,
    completedCount: 0,
  };

  try {
    console.log("📊 [retailer] 마이페이지: 주문 통계 조회 시작");
    const stats = await getOrderStats();
    orderStats = {
      totalOrders: stats.totalOrders,
      shippedCount: stats.shippedCount,
      completedCount: stats.completedCount,
    };
    console.log("✅ [retailer] 마이페이지: 주문 통계 조회 완료", orderStats);
  } catch (error) {
    console.log("⚠️ [retailer] 마이페이지: 주문 통계 조회 실패 (데이터 없음 가능)", error);
    // 에러 발생 시 기본값 유지
  }

  // 최근 주문 내역 조회 (최대 5개)
  let recentOrders: OrderDetail[] = [];

  try {
    console.log("📋 [retailer] 마이페이지: 최근 주문 내역 조회 시작");
    const result = await getOrders({
      page: 1,
      pageSize: 5,
      sortBy: "created_at",
      sortOrder: "desc",
    });
    recentOrders = result.orders;
    console.log("✅ [retailer] 마이페이지: 최근 주문 내역 조회 완료", {
      count: recentOrders.length,
    });
  } catch (error) {
    console.log("⚠️ [retailer] 마이페이지: 최근 주문 내역 조회 실패 (데이터 없음 가능)", error);
    // 에러 발생 시 빈 배열 유지
  }

  return (
    <MyPage
      userName={userName}
      businessName={businessName}
      email={email}
      totalOrders={orderStats.totalOrders}
      shippingOrders={orderStats.shippedCount}
      completedOrders={orderStats.completedCount}
      recentOrders={recentOrders}
    />
  );
}

