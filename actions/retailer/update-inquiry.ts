"use server";

/**
 * @file actions/retailer/update-inquiry.ts
 * @description 문의 수정 서버 액션
 *
 * 사용자가 작성한 문의의 제목과 내용을 수정합니다.
 * 답변완료 상태인 문의만 수정 가능합니다.
 */

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface UpdateInquiryInput {
  inquiryId: string;
  title: string;
  content: string;
}

export interface UpdateInquiryResult {
  success: boolean;
  error?: string;
}

/**
 * 문의 수정
 *
 * @param {UpdateInquiryInput} input - 수정할 문의 정보
 * @returns {Promise<UpdateInquiryResult>} 수정 결과
 */
export async function updateInquiry(
  input: UpdateInquiryInput
): Promise<UpdateInquiryResult> {
  console.group("✏️ [retailer] 문의 수정 시작");
  console.log("수정 데이터:", { inquiryId: input.inquiryId, title: input.title });

  try {
    const profile = await getUserProfile();
    if (!profile) {
      console.error("❌ [retailer] 인증되지 않은 사용자");
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    const title = input.title?.trim();
    const content = input.content?.trim();

    if (!title || !content) {
      console.error("❌ [retailer] 제목/내용 누락");
      return {
        success: false,
        error: "제목과 내용을 입력해주세요.",
      };
    }

    if (title.length > 200) {
      return {
        success: false,
        error: "제목은 200자 이하로 입력해주세요.",
      };
    }

    if (content.length < 10 || content.length > 3000) {
      return {
        success: false,
        error: "내용은 10자 이상 3000자 이하로 입력해주세요.",
      };
    }

    const supabase = getServiceRoleClient();

    // 1. 문의 존재 및 소유권 확인
    const { data: inquiry, error: fetchError } = await supabase
      .from("inquiries")
      .select("id, user_id, status")
      .eq("id", input.inquiryId)
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

    // 2. 답변완료 상태인지 확인
    if (inquiry.status !== "answered") {
      console.error("❌ [retailer] 수정 불가능한 상태:", inquiry.status);
      return {
        success: false,
        error: "답변완료된 문의만 수정할 수 있습니다.",
      };
    }

    // 3. 문의 수정
    const { error: updateError } = await supabase
      .from("inquiries")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.inquiryId);

    if (updateError) {
      console.error("❌ [retailer] 문의 수정 실패:", updateError);
      return {
        success: false,
        error: "문의 수정에 실패했습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    console.log("✅ [retailer] 문의 수정 완료", { inquiryId: input.inquiryId });
    console.groupEnd();

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ [retailer] updateInquiry 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}

