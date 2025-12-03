import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * 이메일 기반 사용자 역할 확인 API
 *
 * 중복 가입 에러 감지 시 이메일로 역할을 확인합니다.
 * 로그인하지 않은 상태에서도 사용 가능합니다.
 *
 * @param {string} email - 확인할 이메일 주소
 * @returns { role: 'retailer' | 'wholesaler' | 'admin' | null }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log("🔍 [check-role-by-email] 역할 확인 시작:", email);

    const supabase = getServiceRoleClient();

    // profiles 테이블에서 이메일로 역할 조회
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("❌ [check-role-by-email] 프로필 조회 실패:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch profile",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!profile) {
      console.log("ℹ️ [check-role-by-email] 프로필 없음");
      return NextResponse.json({ role: null }, { status: 200 });
    }

    console.log("✅ [check-role-by-email] 역할 확인 완료:", profile.role);

    return NextResponse.json({ role: profile.role }, { status: 200 });
  } catch (error) {
    console.error("❌ [check-role-by-email] 예상치 못한 오류:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

