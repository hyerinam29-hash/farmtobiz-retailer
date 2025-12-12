/**
 * @file app/retailer/products/[id]/product-detail-tabs.tsx
 * @description 상품 상세 정보 탭 컴포넌트
 *
 * 상품 상세 페이지의 탭 기능을 제공하는 클라이언트 컴포넌트입니다.
 * 상세 정보, 교환/반품, 문의하기 탭을 포함합니다.
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import ProductInquiryForm from "./product-inquiry-form";

interface ProductDetailTabsProps {
  product: {
    id: string;
    wholesaler_id: string;
    standardized_name: string | null;
    name: string;
    description: string | null;
    delivery_dawn_available: boolean;
    delivery_method: string;
  };
}

export function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  return (
    <div className="mt-12">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-gray-200 dark:border-gray-700 rounded-none h-auto p-0">
          <TabsTrigger
            value="details"
            className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 data-[state=active]:bg-transparent rounded-none pb-4 px-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            상세정보
          </TabsTrigger>
          <TabsTrigger
            value="return"
            className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 data-[state=active]:bg-transparent rounded-none pb-4 px-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            교환/반품
          </TabsTrigger>
          <TabsTrigger
            value="delivery"
            className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 data-[state=active]:bg-transparent rounded-none pb-4 px-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            문의하기
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              상품 상세 정보
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {product.description || "상품 상세 정보가 제공되지 않았습니다."}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="return" className="mt-8">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  교환/반품 안내
                </h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-medium mb-1">교환/반품 가능 기간</p>
                    <p>상품 수령 후 7일 이내</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">교환/반품 불가 사유</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>고객의 단순 변심으로 인한 교환/반품</li>
                      <li>상품의 포장을 개봉하여 상품 가치가 훼손된 경우</li>
                      <li>신선식품의 특성상 상품의 품질 저하가 발생한 경우</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">교환/반품 배송비</p>
                    <p>고객 변심의 경우 왕복 배송비가 발생합니다.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">문의</p>
                    <p>교환/반품 관련 문의는 고객센터로 연락해주세요.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="mt-8">
          <ProductInquiryForm
            productId={product.id} // ✨ 추가: 상품 ID 전달
            wholesalerId={product.wholesaler_id}
            productName={product.standardized_name || product.name}
            onSuccess={() => {
              // 문의 제출 성공 후 처리 (필요시)
              console.log("✅ [product-detail-tabs] 문의 제출 완료", {
                productId: product.id,
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

