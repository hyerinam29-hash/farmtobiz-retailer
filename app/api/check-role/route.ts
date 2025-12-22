import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";

/**
 * 사용자 역할 확인 API
 *
 * 현재 로그인한 사용자의 역할을 확인합니다.
 * 역할 선택 페이지에서 이미 역할이 있는지 확인할 때 사용합니다.
 * retailer 역할인 경우 소매점 존재 여부도 함께 확인합니다.
 *
 * @returns { role: 'retailer' | 'wholesaler' | 'admin' | null, hasRetailer?: boolean }
 */
export async function GET() {
  try {
    console.log("🔍 [check-role] 역할 확인 시작");

    // Clerk 인증 확인
    const { userId } = await auth();

    if (!userId) {
      console.log("⚠️ [check-role] 인증되지 않음");
      return NextResponse.json({ role: null }, { status: 200 });
    }

    console.log("✅ [check-role] Clerk userId:", userId);

    const supabase = createClerkSupabaseClient();

    // profiles 테이블에서 역할 및 id 조회
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("clerk_user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // 프로필이 없는 경우
        console.log("ℹ️ [check-role] 프로필 없음");
        return NextResponse.json({ role: null }, { status: 200 });
      }

      console.error("❌ [check-role] 프로필 조회 실패:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch profile",
          details: error.message,
        },
        { status: 500 },
      );
    }

    if (!profile) {
      console.log("ℹ️ [check-role] 프로필 없음");
      return NextResponse.json({ role: null }, { status: 200 });
    }

    console.log("✅ [check-role] 역할 확인 완료:", profile.role);

    // retailer 역할인 경우 소매점 존재 여부 확인
    if (profile.role === "retailer") {
      const { data: retailer, error: retailerError } = await supabase
        .from("retailers")
        .select("id")
        .eq("profile_id", profile.id)
        .maybeSingle();

      if (retailerError && retailerError.code !== "PGRST116") {
        // PGRST116은 "no rows returned" 에러 (정상적인 경우)
        console.error("❌ [check-role] 소매점 조회 실패:", retailerError);
        // 에러가 발생해도 역할 정보는 반환
        return NextResponse.json(
          { role: profile.role, hasRetailer: false },
          { status: 200 },
        );
      }

      const hasRetailer = !!retailer;
      console.log("✅ [check-role] 소매점 존재 여부:", hasRetailer);

      return NextResponse.json(
        { role: profile.role, hasRetailer },
        { status: 200 },
      );
    }

    // retailer가 아닌 경우 역할만 반환
    return NextResponse.json({ role: profile.role }, { status: 200 });
  } catch (error) {
    console.error("❌ [check-role] 예상치 못한 오류:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
