"use server";

/**
 * @file actions/retailer/create-product-inquiry.ts
 * @description 소매→도매 상품 문의 생성 서버 액션
 *
 * 소매 사용자가 상품 상세 페이지에서 도매 판매자에게 문의를 작성할 때 사용합니다.
 * - inquiry_type = "retailer_to_wholesaler"
 * - wholesaler_id 필수
 * - order_id 선택
 * - attachment_urls (최대 5개)
 */

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface CreateProductInquiryInput {
  title: string;
  content: string;
  product_id: string; // ✨ 추가: 상품 ID (상품 상세페이지에서 작성 시)
  wholesaler_id: string; // 필수
  order_id?: string | null; // 선택
  attachment_urls?: string[]; // 첨부 파일 URL 배열 (최대 5개)
}

export interface CreateProductInquiryResult {
  success: boolean;
  error?: string;
  inquiryId?: string;
}

export async function createProductInquiry(
  input: CreateProductInquiryInput
): Promise<CreateProductInquiryResult> {
  console.group("✉️ [product-inquiry] 소매→도매 상품 문의 생성 시작");
  try {
    const profile = await getUserProfile();
    if (!profile) {
      console.error("❌ [product-inquiry] 인증 실패");
      return { success: false, error: "로그인이 필요합니다." };
    }

    const title = input.title?.trim();
    const content = input.content?.trim();
    const productId = input.product_id?.trim() || null; // ✨ 추가: 상품 ID
    const wholesalerId = input.wholesaler_id?.trim();
    const orderId = input.order_id?.trim() || null;
    const attachmentUrls = input.attachment_urls || [];

    // 필수 필드 검증
    if (!title || !content) {
      console.error("❌ [product-inquiry] 제목/내용 누락");
      return { success: false, error: "제목과 내용을 입력해주세요." };
    }

    if (!wholesalerId) {
      console.error("❌ [product-inquiry] 도매점 ID 누락");
      return { success: false, error: "도매점 정보가 없습니다." };
    }

    // 첨부 파일 개수 검증 (최대 5개)
    if (attachmentUrls.length > 5) {
      console.error("❌ [product-inquiry] 첨부 파일 개수 초과", {
        count: attachmentUrls.length,
      });
      return { success: false, error: "첨부 파일은 최대 5개까지 업로드 가능합니다." };
    }

    console.log("📝 [product-inquiry] 문의 정보", {
      userId: profile.id,
      productId, // ✨ 추가: 상품 ID 로깅
      wholesalerId,
      hasOrder: Boolean(orderId),
      attachmentCount: attachmentUrls.length,
    });

    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        user_id: profile.id,
        title,
        content,
        inquiry_type: "retailer_to_wholesaler",
        product_id: productId, // ✨ 추가: 상품 ID 저장
        wholesaler_id: wholesalerId,
        order_id: orderId,
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : null,
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
      productId, // ✨ 추가: 상품 ID 로깅
      wholesalerId,
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

