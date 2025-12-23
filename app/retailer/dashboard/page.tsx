/**
 * @file app/retailer/dashboard/page.tsx
 * @description 소매점 대시보드 서버 컴포넌트
 *
 * 서버에서 데이터를 페칭하여 클라이언트 컴포넌트에 전달합니다.
 *
 * 주요 기능:
 * 1. 대시보드 데이터 서버 사이드 페칭 (HOT DEAL, 추천 상품, 최근 주문, 배송 조회)
 * 2. 추천 상품 섹션은 서버 컴포넌트로 렌더링 (깜빡임 방지)
 * 3. 나머지 대시보드는 클라이언트 컴포넌트에 초기 데이터 전달
 * 4. CartOptionsProvider로 클라이언트 컴포넌트 래핑
 *
 * @dependencies
 * - getDashboardData (Server Action)
 * - ProductRecommendationSection (서버 컴포넌트)
 * - DashboardClient (클라이언트 컴포넌트)
 * - CartOptionsProvider (장바구니 컨텍스트)
 *
 * @see {@link PRD.md} - R.DASH.01~04 요구사항
 */

import { getDashboardData } from "@/actions/retailer/get-dashboard-data";
import { CartOptionsProvider } from "@/contexts/cart-options-context";
import ProductRecommendationSection from "@/components/retailer/product-recommendation-section";
import DashboardClient from "./dashboard-client";

export default async function RetailerDashboardPage() {
  console.log("🔄 [대시보드 서버] 데이터 페칭 시작");

  // 서버에서 대시보드 데이터 페칭
  let dashboardData;
  try {
    dashboardData = await getDashboardData();
    console.log("✅ [대시보드 서버] 데이터 페칭 완료", {
      recommendedProducts: dashboardData.recommendedProducts.length,
      hotDeals: dashboardData.hotDeals.length,
      recentOrders: dashboardData.recentOrders.length,
      shippingOrders: dashboardData.shippingOrders.length,
    });
  } catch (error) {
    console.error("❌ [대시보드 서버] 데이터 페칭 실패:", error);
    // 에러 시 빈 배열로 초기화
    dashboardData = {
      recommendedProducts: [],
      hotDeals: [],
      recentOrders: [],
      shippingOrders: [],
    };
  }

  return (
    <CartOptionsProvider>
      <div className="pb-20 relative overflow-hidden min-h-screen font-sans bg-[#F8F9FA] dark:bg-gray-900 transition-colors duration-200">
        {/* 3D 배경 장식 요소 */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 dark:from-green-900/20 to-emerald-100/0 dark:to-emerald-900/0 rounded-full blur-3xl -z-10 animate-pulse transition-colors duration-200"></div>
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-gradient-to-bl from-yellow-100/40 dark:from-yellow-900/20 to-orange-50/0 dark:to-orange-900/0 rounded-full blur-3xl -z-10 animate-pulse delay-700 transition-colors duration-200"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/30 dark:from-blue-900/20 to-indigo-50/0 dark:to-indigo-900/0 rounded-full blur-3xl -z-10 animate-pulse delay-1000 transition-colors duration-200"></div>

        {/* 3D 플로팅 오브젝트 */}
        <div className="absolute top-[15%] left-[5%] w-32 h-32 bg-gradient-to-br from-white/60 dark:from-gray-800/60 to-white/10 dark:to-gray-800/10 backdrop-blur-md rounded-full shadow-lg border border-white/30 dark:border-gray-700/30 -z-10 transition-colors duration-200"></div>
        <div className="absolute top-[40%] right-[10%] w-24 h-24 bg-gradient-to-br from-green-100/60 dark:from-green-900/40 to-emerald-50/10 dark:to-emerald-900/10 backdrop-blur-md rounded-[2rem] rotate-12 shadow-lg border border-white/30 dark:border-gray-700/30 -z-10 transition-colors duration-200"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-12 relative z-10">
          {/* 섹션 1: 이 상품 어때요? (서버 컴포넌트 - 깜빡임 없음) */}
          <ProductRecommendationSection
            products={dashboardData.recommendedProducts}
          />

          {/* 나머지 대시보드 (클라이언트 컴포넌트) */}
          <DashboardClient
            initialHotDeals={dashboardData.hotDeals}
            initialRecentOrders={dashboardData.recentOrders}
            initialShippingOrders={dashboardData.shippingOrders}
          />
        </div>
      </div>
    </CartOptionsProvider>
  );
}
