/**
 * @file hooks/use-cart-options.ts
 * @description 장바구니 작업에 필요한 retailerId와 supabaseClient를 제공하는 훅
 *
 * 장바구니 추가/수정/삭제 시 DB에 저장하기 위해 필요한 옵션을 제공합니다.
 */

"use client";

import { useEffect, useState } from "react";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { getRetailerId } from "@/actions/retailer/get-retailer-id";
import type { SupabaseClient } from "@supabase/supabase-js";

interface CartOptions {
  retailerId: string | null;
  supabaseClient: SupabaseClient | null;
  isLoading: boolean;
}

/**
 * 장바구니 작업에 필요한 옵션을 제공하는 훅
 *
 * @returns retailerId, supabaseClient, isLoading
 */
export function useCartOptions(): CartOptions {
  const supabaseClient = useClerkSupabaseClient();
  const [retailerId, setRetailerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRetailerId() {
      try {
        const id = await getRetailerId();
        setRetailerId(id);
      } catch (error) {
        console.error("❌ [use-cart-options] retailerId 조회 실패:", error);
        setRetailerId(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRetailerId();
  }, []);

  return {
    retailerId,
    supabaseClient,
    isLoading,
  };
}

