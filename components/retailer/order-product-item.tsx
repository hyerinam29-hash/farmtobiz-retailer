/**
 * @file components/retailer/order-product-item.tsx
 * @description 주문 상세 페이지의 상품 항목 컴포넌트 (클라이언트 컴포넌트)
 *
 * 리뷰 쓰기/재구매 버튼의 onClick 핸들러를 처리하기 위한 클라이언트 컴포넌트입니다.
 */

"use client";

import Image from "next/image";
import { Package } from "lucide-react";

interface OrderProductItemProps {
  id: string;
  name: string;
  image_url: string | null;
  quantity: number;
  unit_price: number;
}

export default function OrderProductItem({
  id,
  name,
  image_url,
  quantity,
  unit_price,
}: OrderProductItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* 상품 이미지 */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={24} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 mb-1">{name}</h4>
        <div className="text-sm text-gray-500 mb-2">
          {unit_price.toLocaleString()}원 / {quantity}개
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              console.log("✍️ [주문 상세] 리뷰 쓰기 클릭, 상품:", name);
              // TODO: 리뷰 쓰기 페이지로 이동
            }}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            리뷰 쓰기
          </button>
          <button
            onClick={() => {
              console.log("🔄 [주문 상세] 재구매 클릭, 상품:", name);
              // TODO: 재구매 기능 구현
            }}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            재구매
          </button>
        </div>
      </div>

      {/* 상품 총액 */}
      <div className="font-bold text-gray-900">
        {(unit_price * quantity).toLocaleString()}원
      </div>
    </div>
  );
}

