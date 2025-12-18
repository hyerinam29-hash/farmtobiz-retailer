/**
 * @file actions/retailer/get-retailer-id.ts
 * @description 현재 로그인한 소매점의 retailer_id 조회
 *
 * 클라이언트 컴포넌트에서 retailerId를 가져올 때 사용합니다.
 */

"use server";

import { getUserProfile } from "@/lib/clerk/auth";

/**
 * 현재 로그인한 소매점의 retailer_id 조회
 *
 * @returns retailer_id 또는 null
 */
export async function getRetailerId(): Promise<string | null> {
  try {
    const profile = await getUserProfile();
    if (!profile) {
      return null;
    }

    const retailers = profile.retailers as Array<{ id: string }> | null;
    if (!retailers || retailers.length === 0) {
      return null;
    }

    return retailers[0].id;
  } catch (error) {
    console.error("❌ [get-retailer-id] retailerId 조회 실패:", error);
    return null;
  }
}

