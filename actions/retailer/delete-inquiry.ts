"use server";

/**
 * @file actions/retailer/delete-inquiry.ts
 * @description 문의 삭제 서버 액션
 *
 * 사용자가 작성한 문의를 삭제합니다.
 * 답변완료 상태인 문의만 삭제 가능합니다.
 */

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface DeleteInquiryInput {
  inquiryId: string;
}

export interface DeleteInquiryResult {
  success: boolean;
  error?: string;
}

/**
 * 문의 삭제
 *
 * @param {DeleteInquiryInput} input - 삭제할 문의 ID
 * @returns {Promise<DeleteInquiryResult>} 삭제 결과
 */
export async function deleteInquiry(
  input: DeleteInquiryInput
): Promise<DeleteInquiryResult> {
  console.group("🗑️ [retailer] 문의 삭제 시작");
  console.log("삭제할 문의 ID:", input.inquiryId);

  try {
    const profile = await getUserProfile();
    if (!profile) {
      console.error("❌ [retailer] 인증되지 않은 사용자");
      return {
        success: false,
        error: "로그인이 필요합니다.",
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
      console.error("❌ [retailer] 삭제 불가능한 상태:", inquiry.status);
      return {
        success: false,
        error: "답변완료된 문의만 삭제할 수 있습니다.",
      };
    }

    // 3. 문의 삭제
    const { error: deleteError } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", input.inquiryId);

    if (deleteError) {
      console.error("❌ [retailer] 문의 삭제 실패:", deleteError);
      return {
        success: false,
        error: "문의 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    console.log("✅ [retailer] 문의 삭제 완료", { inquiryId: input.inquiryId });
    console.groupEnd();

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ [retailer] deleteInquiry 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}

