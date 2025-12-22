/**
 * @file app/page.tsx
 * @description 루트 페이지 - 인증 상태에 따라 적절한 페이지로 리다이렉트
 *
 * 루트 경로(/)에 접속하면:
 * - 로그인되어 있고 retailer 역할이며 소매점이 등록되어 있으면 → 대시보드
 * - 로그인되어 있고 retailer 역할이지만 소매점이 없으면 → 온보딩
 * - 로그인되어 있지 않으면 → 로그인 페이지
 *
 * ⚠️ 개선: checkAuth()를 사용하여 불필요한 Clerk API 호출을 방지합니다.
 *
 * @dependencies
 * - lib/clerk/auth.ts (checkAuth, getUserProfile)
 */

// 동적 렌더링 강제 (인증 상태 확인으로 인해 정적 생성 불가)
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { checkAuth, getUserProfile } from "@/lib/clerk/auth";

export default async function Home() {
  console.log("🏠 [Home] 루트 페이지 접근");

  // 1. Clerk 인증 상태 확인 (API 호출 없이 세션만 확인)
  console.log("🏠 [Home] Clerk 인증 상태 확인 (최적화)");
  const authState = await checkAuth();

  if (!authState) {
    // 로그인되어 있지 않으면 로그인 페이지로
    console.log("🏠 [Home] 로그인 안 됨 - /sign-in/retailer로 리다이렉트");
    redirect("/sign-in/retailer");
  }

  // 2. 로그인되어 있으면 프로필 확인
  // getUserProfile() 내부에서도 checkAuth()를 사용하므로 중복 호출이 최소화됨
  const profile = await getUserProfile();

  if (!profile) {
    // 프로필이 없으면 로그인 페이지로 (동기화가 안 된 경우)
    console.log("🏠 [Home] 프로필 없음 - /sign-in/retailer로 리다이렉트");
    redirect("/sign-in/retailer");
  }

  // 3. retailer 역할인 경우
  if (profile.role === "retailer") {
    const hasRetailer = profile.retailers && profile.retailers.length > 0;

    if (hasRetailer) {
      // 소매점이 등록되어 있으면 대시보드로
      console.log(
        "🏠 [Home] 등록된 소매점 확인 - /retailer/dashboard로 리다이렉트",
      );
      redirect("/retailer/dashboard");
    } else {
      // 소매점이 없으면 온보딩 페이지로
      console.log(
        "🏠 [Home] 소매점 미등록 - /retailer-onboarding으로 리다이렉트",
      );
      redirect("/retailer-onboarding");
    }
  }

  // 4. 다른 역할이거나 역할이 없는 경우 로그인 페이지로
  console.log("🏠 [Home] retailer 역할 아님 - /sign-in/retailer로 리다이렉트");
  redirect("/sign-in/retailer");
}
