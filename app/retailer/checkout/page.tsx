/**
 * @file app/retailer/checkout/page.tsx
 * @description 소매점 주문/결제 페이지 (서버 컴포넌트)
 *
 * 주요 기능:
 * 1. 소매점 기본 정보(주소/연락처) 조회 후 클라이언트 컴포넌트에 전달
 * 2. 클라이언트 컴포넌트에서 결제/배송 UI 및 토스페이먼츠 처리
 */

import { getRetailerInfo } from "@/actions/retailer/get-retailer-info";
import CheckoutPageClient from "./checkout-client";

export default async function CheckoutPage() {
  const retailerResult = await getRetailerInfo();
  const retailerInfo = retailerResult.success ? retailerResult.data ?? null : null;

  return (
    <CheckoutPageClient retailerInfo={retailerInfo} />
  );
}

