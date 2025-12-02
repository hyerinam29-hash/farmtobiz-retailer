/**
 * @file app/retailer/products/[id]/page.tsx
 * @description 소매점 상품 상세 페이지
 *
 * 주요 기능:
 * 1. 상품 상세 정보 표시
 * 2. 도매 정보 익명화 (R.SEARCH.04)
 * 3. 장바구니 추가 (R.SEARCH.05)
 * 4. 수량 선택
 *
 * @dependencies
 * - lib/supabase/queries/retailer-products.ts
 * - app/retailer/layout.tsx (레이아웃)
 *
 * @see {@link PRD.md} - R.SEARCH.04, R.SEARCH.05 요구사항
 */

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Truck, Package } from "lucide-react";
import { getRetailerProductById } from "@/lib/supabase/queries/retailer-products";
import { ProductDetailTabs } from "./product-detail-tabs";
import { ProductActions } from "./product-actions";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("🔍 [product-detail-page] 상품 상세 페이지 로드", { productId: id });

  // 실제 DB에서 상품 정보 조회
  const product = await getRetailerProductById(id);

  // 상품이 없거나 비활성화된 경우 404 처리
  if (!product) {
    console.log("⚠️ [product-detail-page] 상품 없음", { productId: id });
    notFound();
  }

  console.log("✅ [product-detail-page] 상품 조회 완료", {
    productId: id,
    productName: product.standardized_name || product.name,
  });

  // 배송 방법 한글 변환
  const deliveryMethodMap: Record<string, string> = {
    courier: "택배",
    direct: "직배송",
    quick: "퀵서비스",
    freight: "화물",
    pickup: "픽업",
  };

  const deliveryMethodText = deliveryMethodMap[product.delivery_method] || product.delivery_method;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* 뒤로가기 */}
      <Link
        href="/retailer/products"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>상품 목록으로</span>
      </Link>

      {/* 상품 상세 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* 왼쪽: 이미지 */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.standardized_name || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-base">이미지 없음</span>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 정보 */}
        <div className="flex flex-col gap-6">
          {/* 판매자 정보 */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Package className="w-4 h-4" />
            <span>
              {product.wholesaler_anonymous_code} · {product.wholesaler_region}
            </span>
          </div>

          {/* 상품명 */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {product.standardized_name || product.name}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {product.category} {product.specification ? `· ${product.specification}` : ""}
            </p>
          </div>

          {/* 설명 */}
          {product.description && (
            <p className="text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
          )}

          {/* 구분선 */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* 가격 정보 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                {product.price.toLocaleString()}원
              </span>
              {product.specification && (
                <span className="text-gray-500 dark:text-gray-400">
                  / {product.specification}
                </span>
              )}
            </div>
            {product.moq > 1 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                최소 주문 수량: {product.moq}개
              </p>
            )}
            {product.stock_quantity > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                재고: {product.stock_quantity}개
              </p>
            )}
            {product.stock_quantity === 0 && (
              <p className="text-sm text-red-600 dark:text-red-400">
                품절
              </p>
            )}
          </div>

          {/* 배송 정보 */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Truck className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-sm">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                배송방법
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {deliveryMethodText}
              </p>
              {product.delivery_dawn_available && (
                <p className="text-green-600 dark:text-green-400 font-medium mt-1">
                  새벽 배송 가능
                </p>
              )}
              {product.shipping_fee > 0 && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  배송비: {product.shipping_fee.toLocaleString()}원
                </p>
              )}
            </div>
          </div>

          {/* 수량 선택 및 버튼 */}
          <ProductActions product={product} />
        </div>
      </div>

      {/* 추가 정보 탭 */}
      <ProductDetailTabs product={product} />
    </div>
  );
}

