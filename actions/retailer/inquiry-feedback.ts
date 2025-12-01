/**
 * @file inquiry-feedback.ts
 * @description 문의 피드백 Server Action
 *
 * AI 답변에 대한 피드백을 저장합니다.
 *
 * 주요 기능:
 * 1. 인증 확인
 * 2. 문의 소유권 확인
 * 3. 피드백 저장 (ai_feedback 컬럼)
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 * - lib/supabase/service-role.ts (getServiceRoleClient)
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface UpdateFeedbackRequest {
  inquiryId: string;
  helpful: boolean; // true: 도움됨, false: 도움 안됨
}

export interface UpdateFeedbackResult {
  success: boolean;
  error?: string;
}

/**
 * AI 답변 피드백 업데이트
 *
 * @param {UpdateFeedbackRequest} data - 피드백 데이터
 * @returns {Promise<UpdateFeedbackResult>} 업데이트 결과
 */
export async function updateInquiryFeedback(
  data: UpdateFeedbackRequest,
): Promise<UpdateFeedbackResult> {
  console.group("📝 [retailer] 문의 피드백 업데이트 시작");
  console.log("피드백 데이터:", data);

  try {
    // 1. 인증 확인
    const profile = await getUserProfile();

    if (!profile) {
      console.error("❌ [retailer] 인증되지 않은 사용자");
      return {
        success: false,
        error: "인증이 필요합니다.",
      };
    }

    const supabase = getServiceRoleClient();

    // 2. 문의 소유권 확인
    const { data: inquiry, error: fetchError } = await supabase
      .from("inquiries")
      .select("id, user_id")
      .eq("id", data.inquiryId)
      .single();

    if (fetchError || !inquiry) {
      console.error("❌ [retailer] 문의 조회 실패:", fetchError);
      return {
        success: false,
        error: "문의를 찾을 수 없습니다.",
      };
    }

    if (inquiry.user_id !== profile.id) {
      console.error("❌ [retailer] 권한 없음:", {
        inquiryUserId: inquiry.user_id,
        profileId: profile.id,
      });
      return {
        success: false,
        error: "권한이 없습니다.",
      };
    }

    // 3. 피드백 업데이트
    // ai_feedback 컬럼이 없다면 마이그레이션 필요
    const { error: updateError } = await supabase
      .from("inquiries")
      .update({
        ai_feedback: data.helpful,
      })
      .eq("id", data.inquiryId);

    if (updateError) {
      console.error("❌ [retailer] 피드백 업데이트 실패:", updateError);
      
      // ai_feedback 컬럼이 없는 경우를 위한 에러 처리
      if (updateError.code === "42703") {
        return {
          success: false,
          error: "피드백 기능을 사용하려면 데이터베이스 마이그레이션이 필요합니다.",
        };
      }
      
      return {
        success: false,
        error: "피드백 저장 중 오류가 발생했습니다.",
      };
    }

    console.log("✅ [retailer] 피드백 업데이트 완료");
    console.groupEnd();

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ [retailer] updateInquiryFeedback 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error: "예상치 못한 오류가 발생했습니다.",
    };
  }
}

