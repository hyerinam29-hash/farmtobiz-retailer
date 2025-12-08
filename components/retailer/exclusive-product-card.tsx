/**
 * @file components/retailer/exclusive-product-card.tsx
 * @description 단독관 전용 상품 카드 컴포넌트
 *
 * 단독관 페이지에서 사용되는 상품 카드입니다.
 * "Only", "단독특가", "선물추천" 등의 태그를 표시할 수 있습니다.
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";

interface ExclusiveProductCardProps {
  product: Product & {
    wholesaler_anonymous_code: string;
    wholesaler_region: string;
    original_name?: string;
  };
  tag?: "Only" | "단독특가" | "선물추천" | "선물용";
}

export default function ExclusiveProductCard({
  product,
  tag,
}: ExclusiveProductCardProps) {
  const router = useRouter();

  const handleAddToCart = () => {
    console.log("🛒 [단독관] 상세 페이지로 이동:", {
      product_id: product.id,
      product_name: product.standardized_name || product.original_name || product.name,
    });

    router.push(`/retailer/products/${product.id}`);
  };

  // 태그 색상 설정
  const getTagStyles = () => {
    switch (tag) {
      case "Only":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "단독특가":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "선물추천":
      case "선물용":
        return "bg-gradient-to-r from-purple-500 to-pink-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
      {/* 이미지 영역 */}
      <Link href={`/retailer/products/${product.id}`}>
        <div className="aspect-square relative flex items-center justify-center overflow-hidden bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.standardized_name || product.original_name || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-4xl">🎁</span>
          )}
          {/* 태그 표시 */}
          {tag && (
            <span
              className={`absolute top-3 left-3 ${getTagStyles()} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 border border-white/20`}
            >
              {tag}
            </span>
          )}
        </div>
      </Link>

      {/* 상품 정보 */}
      <div className="p-4 md:p-5 space-y-3 flex-1 flex flex-col bg-white">
        <div className="flex-1">
          <h3 className="font-bold text-base text-gray-900 line-clamp-2">
            {product.standardized_name || product.original_name || product.name}
          </h3>
          {product.specification && (
            <p className="text-xs text-gray-500 mt-1">{product.specification}</p>
          )}
        </div>
        <div className="border-t border-gray-100 pt-3">
          <div className="font-black text-xl text-purple-600 tracking-tight">
            {product.price.toLocaleString()}원
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
          className="w-full py-2 text-sm h-10 border-2 border-purple-500/20 rounded-xl text-purple-600 font-bold hover:bg-purple-50 flex items-center justify-center gap-2 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={16} />
          <span>담기</span>
        </button>
      </div>
    </div>
  );
}

