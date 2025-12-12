"use server";

/**
 * @file actions/retailer/get-inquiries.ts
 * @description 문의 내역 조회 서버 액션
 *
 * - Supabase inquiries 테이블에서 현재 사용자의 문의 내역 조회
 * - 검색, 필터링, 정렬 기능 지원
 */

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import type { Inquiry } from "@/types/inquiry";

export interface GetInquiriesInput {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface GetInquiriesResult {
  success: boolean;
  data?: Inquiry[];
  error?: string;
}

/**
 * 문의 내역 조회
 *
 * @param {GetInquiriesInput} input - 조회 조건
 * @returns {Promise<GetInquiriesResult>} 문의 내역 목록
 */
export async function getInquiries(
  input: GetInquiriesInput = {}
): Promise<GetInquiriesResult> {
  console.group("📋 [retailer] 문의 내역 조회 시작");
  console.log("조회 조건:", input);

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

    // 기본 쿼리: 현재 사용자의 문의만 조회 (product 정보 포함)
    let query = supabase
      .from("inquiries")
      .select(`
        id, 
        user_id, 
        title, 
        content, 
        status, 
        admin_reply, 
        created_at, 
        replied_at,
        product_id,
        products (
          id,
          name,
          images
        )
      `)
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    // 검색 조건 (제목 또는 내용)
    if (input.search && input.search.trim()) {
      const searchTerm = input.search.trim();
      console.log("🔍 [retailer] 검색어 적용:", searchTerm);
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      console.log("🔍 [retailer] 검색 쿼리 생성 완료");
    }

    // 상태 필터
    if (input.status && input.status !== "전체") {
      // 상태 매핑: "접수완료" -> "open", "답변완료" -> "answered", "종료" -> "closed"
      const statusMap: Record<string, string> = {
        접수완료: "open",
        답변완료: "answered",
        종료: "closed",
      };
      const dbStatus = statusMap[input.status] || input.status;
      query = query.eq("status", dbStatus);
    }

    // 날짜 필터
    if (input.startDate) {
      query = query.gte("created_at", input.startDate);
    }
    if (input.endDate) {
      // 종료일은 하루 끝까지 포함
      const endDate = new Date(input.endDate);
      endDate.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ [retailer] 문의 내역 조회 실패", error);
      return {
        success: false,
        error: "문의 내역을 불러오는데 실패했습니다.",
      };
    }

    console.log("✅ [retailer] 문의 내역 조회 완료", { count: data?.length || 0 });
    console.groupEnd();

    // 데이터 변환: products를 product로 매핑하고 images를 image_urls로 변환
    const transformedData = (data || []).map((item: any) => {
      const inquiry: Inquiry = {
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        content: item.content,
        status: item.status,
        admin_reply: item.admin_reply,
        created_at: item.created_at,
        replied_at: item.replied_at,
        product_id: item.product_id || null,
        product: item.products
          ? {
              id: item.products.id,
              name: item.products.name,
              image_urls: item.products.images || null, // DB의 images를 image_urls로 변환
              images: item.products.images || null, // 호환성을 위해 둘 다 포함
            }
          : null,
      };
      return inquiry;
    });

    return {
      success: true,
      data: transformedData,
    };
  } catch (error) {
    console.error("❌ [retailer] getInquiries 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error: "예상치 못한 오류가 발생했습니다.",
    };
  }
}

