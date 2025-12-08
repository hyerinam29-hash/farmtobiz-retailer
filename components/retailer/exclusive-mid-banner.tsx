/**
 * @file components/retailer/exclusive-mid-banner.tsx
 * @description 단독관 중간 배너 컴포넌트
 *
 * 단독관 페이지 중간에 표시되는 배너들입니다.
 * "팜투비즈 X 명품 농장" 배너와 카테고리 배너들을 포함합니다.
 */

import Image from "next/image";
import { Fish, Apple } from "lucide-react";

interface MidBannerProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export function PremiumFarmBanner({ title, subtitle, imageUrl }: MidBannerProps) {
  return (
    <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-16 cursor-pointer group bg-purple-900 flex items-center justify-center">
      {imageUrl ? (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-purple-900"></div>
      )}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-4 z-10">
        <h3 className="text-2xl md:text-4xl font-bold mb-2">{title}</h3>
        <p className="text-lg md:text-xl opacity-90">{subtitle}</p>
      </div>
    </div>
  );
}

export function CategoryBanners() {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-16">
      {/* 수산물 직송전 */}
      <div className="flex-1 h-40 bg-purple-100 rounded-2xl flex items-center justify-between p-8 cursor-pointer hover:shadow-md transition-shadow">
        <div>
          <div className="text-purple-600 font-bold mb-1">Only Farm to Biz</div>
          <h4 className="text-xl font-bold text-gray-900">수산물 직송전</h4>
        </div>
        <Fish size={80} className="text-purple-300" strokeWidth={1.5} />
      </div>

      {/* 고당도 과일관 */}
      <div className="flex-1 h-40 bg-orange-100 rounded-2xl flex items-center justify-between p-8 cursor-pointer hover:shadow-md transition-shadow">
        <div>
          <div className="text-orange-600 font-bold mb-1">Premium Quality</div>
          <h4 className="text-xl font-bold text-gray-900">고당도 과일관</h4>
        </div>
        <Apple size={80} className="text-orange-300" strokeWidth={1.5} />
      </div>
    </div>
  );
}

