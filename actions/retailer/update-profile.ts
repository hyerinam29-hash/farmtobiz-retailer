/**
 * @file update-profile.ts
 * @description 소매점 프로필 정보 수정 Server Action
 *
 * 소매점의 기본 정보(상호명, 전화번호, 주소)를 수정합니다.
 *
 * 주요 기능:
 * 1. Clerk 인증 확인
 * 2. 소매점 정보 조회
 * 3. 프로필 정보 업데이트
 * 4. 에러 처리 및 로깅
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 * - lib/supabase/service-role.ts (getServiceRoleClient)
 * - lib/utils/format.ts (formatPhone)
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { formatPhone } from "@/lib/utils/format";

/**
 * 프로필 업데이트 요청 타입
 */
export interface UpdateProfileRequest {
  business_name?: string;
  phone?: string;
  address?: string;
  address_detail?: string;
}

/**
 * 프로필 업데이트 결과 타입
 */
export interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

/**
 * 소매점 프로필 정보 수정 Server Action
 *
 * @param {UpdateProfileRequest} data - 업데이트할 정보
 * @returns {Promise<UpdateProfileResult>} 업데이트 결과
 */
export async function updateRetailerProfile(
  data: UpdateProfileRequest
): Promise<UpdateProfileResult> {
  console.group("📝 [retailer] 프로필 정보 수정 시작");
  console.log("업데이트 데이터:", data);

  try {
    // 1. Clerk 인증 확인 및 profile_id 조회
    const profile = await getUserProfile();

    if (!profile) {
      console.error("❌ [retailer] 인증되지 않은 사용자");
      return {
        success: false,
        error: "인증이 필요합니다. 다시 로그인해주세요.",
      };
    }

    if (profile.role !== "retailer") {
      console.error("❌ [retailer] 소매점 역할이 아닌 사용자:", profile.role);
      return {
        success: false,
        error: "소매점 권한이 필요합니다.",
      };
    }

    console.log("✅ [retailer] 인증 확인 완료, profile_id:", profile.id);

    // 2. 소매점 정보 조회
    const supabase = getServiceRoleClient();
    const { data: retailer, error: fetchError } = await supabase
      .from("retailers")
      .select("id")
      .eq("profile_id", profile.id)
      .single();

    if (fetchError) {
      console.error("❌ [retailer] 소매점 정보 조회 실패:", fetchError);
      return {
        success: false,
        error: "소매점 정보를 찾을 수 없습니다.",
      };
    }

    if (!retailer) {
      console.error("❌ [retailer] 소매점 정보 없음");
      return {
        success: false,
        error: "소매점 정보가 등록되지 않았습니다.",
      };
    }

    // 3. 업데이트할 데이터 준비
    const updateData: {
      business_name?: string;
      phone?: string;
      address?: string;
    address_detail?: string;
    } = {};

    if (data.business_name !== undefined) {
      updateData.business_name = data.business_name.trim();
    }

    if (data.phone !== undefined) {
      updateData.phone = formatPhone(data.phone);
    }

    if (data.address !== undefined) {
      updateData.address = data.address.trim();
    }

  if (data.address_detail !== undefined) {
    updateData.address_detail = data.address_detail.trim();
  }

    // 업데이트할 데이터가 없으면 에러
    if (Object.keys(updateData).length === 0) {
      console.warn("⚠️ [retailer] 업데이트할 데이터 없음");
      return {
        success: false,
        error: "수정할 정보를 입력해주세요.",
      };
    }

    // 4. 프로필 정보 업데이트
    console.log("📝 [retailer] 프로필 정보 업데이트 시도:", updateData);
    const { error: updateError } = await supabase
      .from("retailers")
      .update(updateData)
      .eq("id", retailer.id);

    if (updateError) {
      console.error("❌ [retailer] 프로필 정보 업데이트 실패:", updateError);
      return {
        success: false,
        error: "프로필 정보 수정 중 오류가 발생했습니다.",
      };
    }

    console.log("✅ [retailer] 프로필 정보 업데이트 완료");
    console.groupEnd();

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ [retailer] 프로필 정보 수정 중 예외 발생:", error);
    return {
      success: false,
      error: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

