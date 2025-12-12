"use server";

/**
 * @file actions/retailer/create-product-inquiry.ts
 * @description 소매→도매 상품 문의 작성 서버 액션
 *
 * - Supabase inquiries 테이블에 상품 문의 저장
 * - inquiry_type = "retailer_to_wholesaler"로 저장
 * - 첨부 파일은 Supabase Storage에 업로드 후 URL 배열 저장
 */

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface CreateProductInquiryInput {
  title: string;
  content: string;
  wholesaler_id: string;
  order_id?: string | null;
  attachment_urls?: string[];
}

export interface CreateProductInquiryResult {
  success: boolean;
  error?: string;
  inquiryId?: string | null;
}

export async function createProductInquiry(
  input: CreateProductInquiryInput
): Promise<CreateProductInquiryResult> {
  console.group("✉️ [product-inquiry] 도매 상품 문의 생성 시작");
  console.log("📝 [product-inquiry] 입력 데이터:", {
    title: input.title,
    wholesaler_id: input.wholesaler_id,
    hasOrder: Boolean(input.order_id),
    attachmentCount: input.attachment_urls?.length || 0,
  });

  try {
    const profile = await getUserProfile();
    if (!profile) {
      console.error("❌ [product-inquiry] 인증 실패");
      return { success: false, error: "로그인이 필요합니다." };
    }

    const title = input.title?.trim();
    const content = input.content?.trim();
    const wholesalerId = input.wholesaler_id?.trim();
    const orderId = input.order_id?.trim() || null;
    const attachmentUrls = input.attachment_urls || [];

    if (!title || !content) {
      console.error("❌ [product-inquiry] 제목/내용 누락");
      return { success: false, error: "제목과 내용을 입력해주세요." };
    }

    if (!wholesalerId) {
      console.error("❌ [product-inquiry] 도매점 ID 누락");
      return { success: false, error: "도매점 정보가 없습니다." };
    }

    if (attachmentUrls.length > 5) {
      console.error("❌ [product-inquiry] 첨부 파일 개수 초과");
      return { success: false, error: "첨부 파일은 최대 5개까지 업로드 가능합니다." };
    }

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        user_id: profile.id,
        title,
        content,
        wholesaler_id: wholesalerId,
        order_id: orderId,
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : [],
        inquiry_type: "retailer_to_wholesaler",
        status: "open",
      })
      .select("id")
      .single();

    if (error) {
      console.error("❌ [product-inquiry] 저장 실패", error);
      return {
        success: false,
        error: "문의 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    console.log("✅ [product-inquiry] 저장 성공", {
      inquiryId: data.id,
      userId: profile.id,
      wholesalerId,
      hasOrder: Boolean(orderId),
      attachmentCount: attachmentUrls.length,
    });
    console.groupEnd();

    return { success: true, inquiryId: data.id };
  } catch (error) {
    console.error("❌ [product-inquiry] 예외 발생", error);
    console.groupEnd();
    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}

