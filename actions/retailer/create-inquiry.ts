/**
 * @file create-inquiry.ts
 * @description 문의 생성 Server Action
 *
 * 문의를 생성하고 AI 답변을 생성합니다.
 *
 * 주요 기능:
 * 1. 인증 확인
 * 2. 문의 저장 (inquiries 테이블)
 * 3. AI 답변 생성
 * 4. 에러 처리
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 * - lib/supabase/service-role.ts (getServiceRoleClient)
 * - lib/api/ai-inquiry.ts (generateInquiryResponse)
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { generateInquiryResponse } from "@/lib/api/ai-inquiry";

export interface CreateInquiryRequest {
  type: string;
  title: string;
  content: string;
}

export interface CreateInquiryResult {
  success: boolean;
  error?: string;
  inquiryId?: string;
  aiResponse?: string;
}

/**
 * 문의 생성 Server Action
 *
 * 문의를 저장하고 AI 답변을 생성합니다.
 *
 * @param {CreateInquiryRequest} data - 문의 데이터
 * @returns {Promise<CreateInquiryResult>} 생성 결과
 */
export async function createInquiry(
  data: CreateInquiryRequest,
): Promise<CreateInquiryResult> {
  console.group("📝 [retailer] 문의 생성 시작");
  console.log("문의 데이터:", data);

  try {
    // 1. 인증 확인
    const profile = await getUserProfile();

    if (!profile) {
      console.error("❌ [retailer] 인증되지 않은 사용자");
      return {
        success: false,
        error: "인증이 필요합니다. 다시 로그인해주세요.",
      };
    }

    // 2. 입력 검증
    if (!data.type || !data.title || !data.content) {
      return {
        success: false,
        error: "모든 필드를 입력해주세요.",
      };
    }

    const supabase = getServiceRoleClient();

    // 3. 문의 저장 (inquiries 테이블)
    const { data: newInquiry, error: insertError } = await supabase
      .from("inquiries")
      .insert({
        user_id: profile.id,
        title: data.title.trim(),
        content: data.content.trim(),
        status: "open", // 초기 상태는 "open"
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("❌ [retailer] 문의 저장 실패:", insertError);
      return {
        success: false,
        error: "문의 저장 중 오류가 발생했습니다.",
      };
    }

    console.log("✅ [retailer] 문의 저장 완료:", newInquiry.id);

    // 4. AI 답변 생성
    let aiResponse: string | undefined;
    try {
      console.log("🤖 [retailer] AI 답변 생성 시작...");
      aiResponse = await generateInquiryResponse(
        data.type,
        data.title,
        data.content,
      );
      console.log("✅ [retailer] AI 답변 생성 완료");
    } catch (aiError) {
      console.error("⚠️ [retailer] AI 답변 생성 실패 (문의는 저장됨):", aiError);
      // AI 답변 실패해도 문의는 저장되므로 계속 진행
      aiResponse = undefined;
    }

    console.groupEnd();

    return {
      success: true,
      inquiryId: newInquiry.id,
      aiResponse,
    };
  } catch (error) {
    console.error("❌ [retailer] createInquiry 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "문의 생성 중 예상치 못한 오류가 발생했습니다.",
    };
  }
}

