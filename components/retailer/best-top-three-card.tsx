/**
 * @file components/retailer/best-top-three-card.tsx
 * @description 베스트 1-3위 상품 카드 컴포넌트
 *
 * 베스트 페이지에서 상위 3개 상품을 세로형 카드로 표시합니다.
 * 순위 뱃지와 메달 이모지가 포함됩니다.
 */

import Link from "next/link";
import Image from "next/image";
import type { RetailerProduct } from "@/lib/supabase/queries/retailer-products";

interface BestTopThreeCardProps {
  product: RetailerProduct;
  rank: 1 | 2 | 3;
}

const rankMedals = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

const rankColors = {
  1: "bg-purple-600",
  2: "bg-purple-600",
  3: "bg-purple-600",
};

export default function BestTopThreeCard({
  product,
  rank,
}: BestTopThreeCardProps) {
  const medal = rankMedals[rank];
  const rankColor = rankColors[rank];

  return (
    <Link
      href={`/retailer/products/${product.id}`}
      className="relative group cursor-pointer"
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-lg mb-4 bg-gray-100 flex items-center justify-center">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.standardized_name || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-6xl">{medal}</span>
        )}
        
        {/* 순위 뱃지 */}
        <div
          className={`absolute top-0 left-0 ${rankColor} text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-black text-xl md:text-2xl shadow-md z-10 rounded-br-lg`}
        >
          {rank}
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="text-center px-2">
        <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1 truncate">
          {product.standardized_name || product.name}
        </h3>
        <p className="text-base md:text-xl text-gray-500 mb-2 line-clamp-1">
          {product.specification || "인기 상품"}
        </p>
        <div className="text-lg md:text-xl font-black text-purple-700">
          {product.price.toLocaleString()}원
        </div>
      </div>
    </Link>
  );
}

