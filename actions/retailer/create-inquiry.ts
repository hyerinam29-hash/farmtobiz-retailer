"use server";

/**
 * @file actions/retailer/create-inquiry.ts
 * @description 챗봇/문의 작성 서버 액션
 *
 * - Supabase inquiries 테이블에 제목/내용(필수) 및 order_id(옵션) 저장
 * - 현재 로그인한 사용자의 profile.id를 user_id로 사용
 */

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface CreateInquiryInput {
  title: string;
  content: string;
  orderId?: string | null;
}

export interface CreateInquiryResult {
  success: boolean;
  error?: string;
}

export async function createInquiry(
  input: CreateInquiryInput
): Promise<CreateInquiryResult> {
  console.group("✉️ [inquiry] 관리자 문의 생성 시작");
  try {
    const profile = await getUserProfile();
    if (!profile) {
      console.error("❌ [inquiry] 인증 실패");
      return { success: false, error: "로그인이 필요합니다." };
    }

    const title = input.title?.trim();
    const content = input.content?.trim();
    const orderId = input.orderId?.trim() || null;

    if (!title || !content) {
      console.error("❌ [inquiry] 제목/내용 누락");
      return { success: false, error: "제목과 내용을 입력해주세요." };
    }

    const supabase = getServiceRoleClient();

    const { error } = await supabase.from("inquiries").insert({
      user_id: profile.id,
      title,
      content,
      order_id: orderId || null,
      inquiry_type: "retailer_to_admin",
      status: "open",
    });

    if (error) {
      console.error("❌ [inquiry] 저장 실패", error);
      return {
        success: false,
        error: "문의 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    console.log("✅ [inquiry] 저장 성공", {
      userId: profile.id,
      hasOrder: Boolean(orderId),
    });
    return { success: true };
  } catch (error) {
    console.error("❌ [inquiry] 예외 발생", error);
    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  } finally {
    console.groupEnd();
  }
}

