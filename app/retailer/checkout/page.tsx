/**
 * @file app/retailer/checkout/page.tsx
 * @description 소매점 주문/결제 페이지 (서버 컴포넌트)
 *
 * 주요 기능:
 * 1. 기본 배송지(나의상회 주소록) 조회 후 클라이언트 컴포넌트에 전달
 * 2. 클라이언트 컴포넌트에서 결제/배송 UI 및 토스페이먼츠 처리
 */

import { getDeliveryAddresses } from "@/actions/retailer/delivery-addresses";
import CheckoutPageClient from "./checkout-client";
import type { DeliveryAddress } from "@/types/database";

export default async function CheckoutPage() {
  const addressesResult = await getDeliveryAddresses();
  const defaultAddress: DeliveryAddress | null =
    addressesResult.success && addressesResult.data?.length
      ? addressesResult.data[0]
      : null;

  return <CheckoutPageClient defaultAddress={defaultAddress} />;
}

