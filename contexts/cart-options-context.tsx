/**
 * @file contexts/cart-options-context.tsx
 * @description 장바구니 옵션을 제공하는 Context
 *
 * retailerId와 supabaseClient를 한 번만 조회하여
 * 모든 하위 컴포넌트에서 재사용할 수 있도록 합니다.
 */

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { getRetailerId } from "@/actions/retailer/get-retailer-id";
import type { SupabaseClient } from "@supabase/supabase-js";

interface CartOptionsContextValue {
  retailerId: string | null;
  supabaseClient: SupabaseClient | null;
  isLoading: boolean;
}

const CartOptionsContext = createContext<CartOptionsContextValue | undefined>(undefined);

interface CartOptionsProviderProps {
  children: ReactNode;
}

export function CartOptionsProvider({ children }: CartOptionsProviderProps) {
  const supabaseClient = useClerkSupabaseClient();
  const [retailerId, setRetailerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRetailerId() {
      console.log("🔄 [CartOptionsContext] retailerId 조회 시작");
      try {
        const id = await getRetailerId();
        setRetailerId(id);
        console.log("✅ [CartOptionsContext] retailerId 조회 완료:", id);
      } catch (error) {
        console.error("❌ [CartOptionsContext] retailerId 조회 실패:", error);
        setRetailerId(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRetailerId();
  }, []);

  return (
    <CartOptionsContext.Provider value={{ retailerId, supabaseClient, isLoading }}>
      {children}
    </CartOptionsContext.Provider>
  );
}

/**
 * 장바구니 옵션을 사용하는 훅
 */
export function useCartOptionsContext(): CartOptionsContextValue {
  const context = useContext(CartOptionsContext);
  if (context === undefined) {
    throw new Error("useCartOptionsContext must be used within CartOptionsProvider");
  }
  return context;
}
