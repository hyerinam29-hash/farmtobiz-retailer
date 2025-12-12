"use server";

/**
 * @file actions/retailer/get-announcements.ts
 * @description 공지사항 목록 조회 서버 액션
 *
 * - Supabase announcements 테이블에서 공지사항 목록 조회
 * - 최신순으로 정렬하여 반환
 */

import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface GetAnnouncementsResult {
  success: boolean;
  data?: Announcement[];
  error?: string;
}

/**
 * 공지사항 목록 조회
 *
 * @returns {Promise<GetAnnouncementsResult>} 공지사항 목록
 */
export async function getAnnouncements(): Promise<GetAnnouncementsResult> {
  console.group("📢 [retailer] 공지사항 목록 조회 시작");

  try {
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("announcements")
      .select("id, title, content, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ [retailer] 공지사항 조회 실패", error);
      return {
        success: false,
        error: "공지사항을 불러오는데 실패했습니다.",
      };
    }

    console.log("✅ [retailer] 공지사항 조회 완료", { count: data?.length || 0 });
    console.groupEnd();

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("❌ [retailer] getAnnouncements 예외:", error);
    console.groupEnd();
    return {
      success: false,
      error: "예상치 못한 오류가 발생했습니다.",
    };
  }
}

