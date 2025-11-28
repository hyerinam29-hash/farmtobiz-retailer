/**
 * @file delivery-addresses.ts
 * @description 배송지 관리 Server Actions
 *
 * 소매점의 배송지 정보를 생성, 조회, 수정, 삭제하는 Server Actions입니다.
 *
 * 주요 기능:
 * 1. 배송지 목록 조회
 * 2. 배송지 생성
 * 3. 배송지 수정
 * 4. 배송지 삭제
 * 5. 기본 배송지 설정
 *
 * @dependencies
 * - lib/clerk/auth.ts (getUserProfile)
 * - lib/supabase/service-role.ts (getServiceRoleClient)
 * - lib/utils/format.ts (formatPhone)
 * - lib/validation/retailer.ts (DeliveryAddressFormData)
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { formatPhone } from "@/lib/utils/format";
import type { DeliveryAddressFormData } from "@/lib/validation/retailer";
import type { DeliveryAddress } from "@/types/database";

/**
 * 배송지 목록 조회 결과
 */
export interface GetDeliveryAddressesResult {
  success: boolean;
  error?: string;
  data?: DeliveryAddress[];
}

/**
 * 배송지 생성/수정/삭제 결과
 */
export interface DeliveryAddressResult {
  success: boolean;
  error?: string;
  data?: DeliveryAddress;
}

/**
 * 배송지 목록 조회
 */
export async function getDeliveryAddresses(): Promise<GetDeliveryAddressesResult> {
  console.group("📋 [retailer] 배송지 목록 조회 시작");

  try {
    const profile = await getUserProfile();

    if (!profile || profile.role !== "retailer") {
      console.error("❌ [retailer] 인증 실패 또는 소매점 역할 아님");
      return {
        success: false,
        error: "인증이 필요합니다.",
      };
    }

    const supabase = getServiceRoleClient();

    // 소매점 정보 조회
    const { data: retailer, error: retailerError } = await supabase
      .from("retailers")
      .select("id")
      .eq("profile_id", profile.id)
      .single();

    if (retailerError || !retailer) {
      console.error("❌ [retailer] 소매점 정보 조회 실패:", retailerError);
      return {
        success: false,
        error: "소매점 정보를 찾을 수 없습니다.",
      };
    }

    // 배송지 목록 조회
    const { data: addresses, error: fetchError } = await supabase
      .from("delivery_addresses")
      .select("*")
      .eq("retailer_id", retailer.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("❌ [retailer] 배송지 목록 조회 실패:", fetchError);
      return {
        success: false,
        error: "배송지 목록을 불러오는 중 오류가 발생했습니다.",
      };
    }

    console.log("✅ [retailer] 배송지 목록 조회 완료:", addresses?.length || 0);
    console.groupEnd();

    return {
      success: true,
      data: addresses || [],
    };
  } catch (error) {
    console.error("❌ [retailer] 배송지 목록 조회 중 예외 발생:", error);
    return {
      success: false,
      error: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * 배송지 생성
 */
export async function createDeliveryAddress(
  data: DeliveryAddressFormData
): Promise<DeliveryAddressResult> {
  console.group("📝 [retailer] 배송지 생성 시작");
  console.log("배송지 데이터:", data);

  try {
    const profile = await getUserProfile();

    if (!profile || profile.role !== "retailer") {
      console.error("❌ [retailer] 인증 실패 또는 소매점 역할 아님");
      return {
        success: false,
        error: "인증이 필요합니다.",
      };
    }

    const supabase = getServiceRoleClient();

    // 소매점 정보 조회
    const { data: retailer, error: retailerError } = await supabase
      .from("retailers")
      .select("id")
      .eq("profile_id", profile.id)
      .single();

    if (retailerError || !retailer) {
      console.error("❌ [retailer] 소매점 정보 조회 실패:", retailerError);
      return {
        success: false,
        error: "소매점 정보를 찾을 수 없습니다.",
      };
    }

    // 기본 배송지로 설정하는 경우, 기존 기본 배송지 해제
    if (data.is_default) {
      await supabase
        .from("delivery_addresses")
        .update({ is_default: false })
        .eq("retailer_id", retailer.id)
        .eq("is_default", true);
    }

    // 배송지 생성
    const { data: newAddress, error: createError } = await supabase
      .from("delivery_addresses")
      .insert({
        retailer_id: retailer.id,
        name: data.name.trim(),
        recipient_name: data.recipient_name.trim(),
        recipient_phone: formatPhone(data.recipient_phone),
        address: data.address.trim(),
        address_detail: data.address_detail?.trim() || null,
        postal_code: data.postal_code?.trim() || null,
        is_default: data.is_default,
      })
      .select()
      .single();

    if (createError) {
      console.error("❌ [retailer] 배송지 생성 실패:", createError);
      return {
        success: false,
        error: "배송지 생성 중 오류가 발생했습니다.",
      };
    }

    console.log("✅ [retailer] 배송지 생성 완료:", newAddress.id);
    console.groupEnd();

    return {
      success: true,
      data: newAddress,
    };
  } catch (error) {
    console.error("❌ [retailer] 배송지 생성 중 예외 발생:", error);
    return {
      success: false,
      error: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * 배송지 수정
 */
export async function updateDeliveryAddress(
  addressId: string,
  data: DeliveryAddressFormData
): Promise<DeliveryAddressResult> {
  console.group("📝 [retailer] 배송지 수정 시작");
  console.log("배송지 ID:", addressId);
  console.log("수정 데이터:", data);

  try {
    const profile = await getUserProfile();

    if (!profile || profile.role !== "retailer") {
      console.error("❌ [retailer] 인증 실패 또는 소매점 역할 아님");
      return {
        success: false,
        error: "인증이 필요합니다.",
      };
    }

    const supabase = getServiceRoleClient();

    // 소매점 정보 조회
    const { data: retailer, error: retailerError } = await supabase
      .from("retailers")
      .select("id")
      .eq("profile_id", profile.id)
      .single();

    if (retailerError || !retailer) {
      console.error("❌ [retailer] 소매점 정보 조회 실패:", retailerError);
      return {
        success: false,
        error: "소매점 정보를 찾을 수 없습니다.",
      };
    }

    // 배송지 소유권 확인
    const { data: existingAddress, error: checkError } = await supabase
      .from("delivery_addresses")
      .select("id, retailer_id")
      .eq("id", addressId)
      .eq("retailer_id", retailer.id)
      .single();

    if (checkError || !existingAddress) {
      console.error("❌ [retailer] 배송지 소유권 확인 실패:", checkError);
      return {
        success: false,
        error: "배송지를 찾을 수 없거나 권한이 없습니다.",
      };
    }

    // 기본 배송지로 설정하는 경우, 기존 기본 배송지 해제
    if (data.is_default) {
      await supabase
        .from("delivery_addresses")
        .update({ is_default: false })
        .eq("retailer_id", retailer.id)
        .eq("is_default", true)
        .neq("id", addressId);
    }

    // 배송지 수정
    const { data: updatedAddress, error: updateError } = await supabase
      .from("delivery_addresses")
      .update({
        name: data.name.trim(),
        recipient_name: data.recipient_name.trim(),
        recipient_phone: formatPhone(data.recipient_phone),
        address: data.address.trim(),
        address_detail: data.address_detail?.trim() || null,
        postal_code: data.postal_code?.trim() || null,
        is_default: data.is_default,
      })
      .eq("id", addressId)
      .select()
      .single();

    if (updateError) {
      console.error("❌ [retailer] 배송지 수정 실패:", updateError);
      return {
        success: false,
        error: "배송지 수정 중 오류가 발생했습니다.",
      };
    }

    console.log("✅ [retailer] 배송지 수정 완료:", updatedAddress.id);
    console.groupEnd();

    return {
      success: true,
      data: updatedAddress,
    };
  } catch (error) {
    console.error("❌ [retailer] 배송지 수정 중 예외 발생:", error);
    return {
      success: false,
      error: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * 배송지 삭제
 */
export async function deleteDeliveryAddress(
  addressId: string
): Promise<DeliveryAddressResult> {
  console.group("🗑️ [retailer] 배송지 삭제 시작");
  console.log("배송지 ID:", addressId);

  try {
    const profile = await getUserProfile();

    if (!profile || profile.role !== "retailer") {
      console.error("❌ [retailer] 인증 실패 또는 소매점 역할 아님");
      return {
        success: false,
        error: "인증이 필요합니다.",
      };
    }

    const supabase = getServiceRoleClient();

    // 소매점 정보 조회
    const { data: retailer, error: retailerError } = await supabase
      .from("retailers")
      .select("id")
      .eq("profile_id", profile.id)
      .single();

    if (retailerError || !retailer) {
      console.error("❌ [retailer] 소매점 정보 조회 실패:", retailerError);
      return {
        success: false,
        error: "소매점 정보를 찾을 수 없습니다.",
      };
    }

    // 배송지 소유권 확인
    const { data: existingAddress, error: checkError } = await supabase
      .from("delivery_addresses")
      .select("id, retailer_id")
      .eq("id", addressId)
      .eq("retailer_id", retailer.id)
      .single();

    if (checkError || !existingAddress) {
      console.error("❌ [retailer] 배송지 소유권 확인 실패:", checkError);
      return {
        success: false,
        error: "배송지를 찾을 수 없거나 권한이 없습니다.",
      };
    }

    // 배송지 삭제
    const { error: deleteError } = await supabase
      .from("delivery_addresses")
      .delete()
      .eq("id", addressId);

    if (deleteError) {
      console.error("❌ [retailer] 배송지 삭제 실패:", deleteError);
      return {
        success: false,
        error: "배송지 삭제 중 오류가 발생했습니다.",
      };
    }

    console.log("✅ [retailer] 배송지 삭제 완료:", addressId);
    console.groupEnd();

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ [retailer] 배송지 삭제 중 예외 발생:", error);
    return {
      success: false,
      error: "예기치 않은 오류가 발생했습니다.",
    };
  }
}

