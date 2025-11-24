/**
 * @file page.tsx
 * @description 도매점 온보딩 페이지 (서버 컴포넌트)
 *
 * 도매점 회원가입 시 사업자 정보를 입력받는 페이지입니다.
 * 이미 등록된 도매점 정보가 있는 경우 승인 대기 페이지로 리다이렉트합니다.
 *
 * 주요 기능:
 * 1. 서버 사이드에서 현재 사용자의 도매점 정보 확인
 * 2. 이미 등록된 경우 `/wholesaler/pending-approval`로 리다이렉트
 * 3. 클라이언트 컴포넌트로 폼 UI 렌더링
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile, requireAuth)
 * - lib/supabase/server.ts (createClerkSupabaseClient)
 * - components/wholesaler/WholesalerOnboardingForm.tsx
 */

import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/clerk/auth";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import WholesalerOnboardingForm from "./WholesalerOnboardingForm";

export default async function WholesalerOnboardingPage() {
  // 인증 확인
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  // 도매점 역할 확인
  if (profile.role !== "wholesaler") {
    redirect("/");
  }

  // 이미 등록된 도매점 정보 확인
  const supabase = createClerkSupabaseClient();

  const { data: existingWholesaler, error } = await supabase
    .from("wholesalers")
    .select("id, status")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (error) {
    console.error("❌ [wholesaler-onboarding] 도매점 정보 조회 오류:", error);
    // 에러가 발생해도 폼을 보여줌 (사용자가 다시 시도할 수 있도록)
  }

  // 이미 등록된 도매점 정보가 있는 경우 승인 대기 페이지로 리다이렉트
  if (existingWholesaler) {
    console.log("✅ [wholesaler-onboarding] 이미 등록된 도매점, 승인 대기 페이지로 리다이렉트");
    redirect("/wholesaler/pending-approval");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <WholesalerOnboardingForm />
      </div>
    </div>
  );
}

