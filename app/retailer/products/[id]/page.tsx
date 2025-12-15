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

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Package } from "lucide-react";
import { getRetailerProductById } from "@/lib/supabase/queries/retailer-products";
import { ProductDetailTabs } from "./product-detail-tabs";
import { ProductActions } from "./product-actions";
import ProductImageGallery from "./product-image-gallery";

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
  console.log("📂 [product-detail-page] 상품 카테고리", {
    productId: id,
    category: product.category,
  });

  const categoryQueryMap: Record<string, string> = {
    과일: "과일",
    채소: "채소",
    수산물: "수산물",
    "곡물/견과류": "곡물/견과류",
    기타: "기타",
  };

  const categoryQuery = categoryQueryMap[product.category] ?? "기타";
  const backHref = `/retailer/products?category=${encodeURIComponent(categoryQuery)}`;

  // 배송 방법 한글 변환
  const deliveryMethodMap: Record<string, string> = {
    courier: "택배",
    direct: "직배송",
    quick: "퀵서비스",
    freight: "화물",
    dawn: "새벽배송",
  };

  const deliveryMethodText = deliveryMethodMap[product.delivery_method] || product.delivery_method;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* 뒤로가기 */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>상품 목록으로</span>
      </Link>

      {/* 상품 상세 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* 왼쪽: 이미지 */}
        <div className="flex flex-col gap-4">
          <ProductImageGallery
            mainImage={product.image_url}
            thumbnails={((product as { images?: string[] }).images) ?? []}
            productName={product.standardized_name || product.name}
          />
        </div>

        {/* 오른쪽: 정보 */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6 md:p-7 space-y-6 transition-colors duration-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Package className="w-4 h-4" />
                <span>
                  {product.wholesaler_anonymous_code} · {product.wholesaler_region}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-200 px-3 py-1 text-xs font-medium">
                    신선상품
                  </span>
                  {product.delivery_dawn_available && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 px-3 py-1 text-xs font-medium">
                      새벽 배송 가능
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  {product.standardized_name || product.name}
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  {product.category} {product.specification ? `· ${product.specification}` : ""}
                </p>
              </div>

              {product.description && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-200">
                  {product.description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 transition-colors duration-200">
                    {product.price.toLocaleString()}원
                  </span>
                  {product.specification && (
                    <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      / {product.specification}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 px-3 py-1">
                    {product.stock_quantity > 0 ? `재고 ${product.stock_quantity}개` : "품절"}
                  </span>
                  {product.moq > 1 && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 px-3 py-1">
                      최소 {product.moq}개
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4 space-y-1 transition-colors duration-200">
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">원산지</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{product.wholesaler_region || "국내"}</p>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4 space-y-1 transition-colors duration-200">
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">배송방법</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{deliveryMethodText}</p>
                  
                </div> 
              </div>
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

