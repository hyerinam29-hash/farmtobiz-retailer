/**
 * @file get-retailer-info.ts
 * @description 소매점 정보 조회 Server Action (상호명/주소/연락처)
 *
 * 주요 기능:
 * 1. 현재 로그인한 소매점의 기본 정보(business_name, address, phone) 조회
 * 2. 결제/배송 화면에서 주문자 정보로 사용
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface RetailerInfo {
  business_name: string;
  address: string;
  phone: string;
}

export interface GetRetailerInfoResult {
  success: boolean;
  error?: string;
  data?: RetailerInfo;
}

/**
 * 현재 로그인한 소매점의 기본 정보 조회
 */
export async function getRetailerInfo(): Promise<GetRetailerInfoResult> {
  console.group("🏪 [retailer] 소매점 정보 조회 시작");

  try {
    const profile = await getUserProfile();

    if (!profile || profile.role !== "retailer") {
      console.error("❌ [retailer] 인증 실패 또는 소매점 역할 아님");
      return { success: false, error: "인증이 필요합니다." };
    }

    const supabase = getServiceRoleClient();

    const { data: retailer, error } = await supabase
      .from("retailers")
      .select("business_name, address, phone")
      .eq("profile_id", profile.id)
      .single();

    if (error || !retailer) {
      console.error("❌ [retailer] 소매점 정보 조회 실패:", error);
      return { success: false, error: "소매점 정보를 찾을 수 없습니다." };
    }

    console.log("✅ [retailer] 소매점 정보 조회 완료:", retailer.business_name);
    console.groupEnd();

    return { success: true, data: retailer };
  } catch (error) {
    console.error("❌ [retailer] 소매점 정보 조회 예외:", error);
    console.groupEnd();
    return { success: false, error: "예기치 않은 오류가 발생했습니다." };
  }
}

