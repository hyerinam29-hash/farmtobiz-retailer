/**
 * @file components/retailer/special-event-banner.tsx
 * @description 연말 특가 이벤트 배너
 *
 * 특가 페이지 상단의 히어로 배너입니다. 기능 변경 없이
 * 디자인 시안에 맞춘 이미지/레이아웃만 제공합니다.
 */

"use client";

import Image from "next/image";
import { AlertTriangle } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80";

export default function SpecialEventBanner() {
  return (
    <div className="relative bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl overflow-hidden shadow-xl">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-8 md:gap-12">
        {/* 왼쪽 텍스트 영역 */}
        <div className="text-white max-w-xl relative z-20 text-center md:text-left space-y-6">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-1.5 rounded-full text-sm font-bold border border-white/30 shadow-sm">
            ✨ 팜투비즈 단독 기획전
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-lg tracking-tight whitespace-pre-wrap break-keep">
              🔥 연말 결산 특가
              <br />
              최대 80% 할인 혜택
            </h2>
            <p className="text-lg md:text-xl font-medium text-white/95 drop-shadow-md leading-relaxed whitespace-pre-wrap break-keep">
              한 해 동안 사랑받은 상품을
              <br />
              역대급 가격으로 만나보세요
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3 shadow-lg">
              <div className="bg-white rounded-full p-2">
                <AlertTriangle className="text-red-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-red-100 text-xs font-medium">한정 수량</p>
                <p className="text-white font-bold">재고 소진 시 조기 종료</p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 이미지 영역 */}
        <div className="relative z-20 perspective-1000">
          <div className="w-72 h-48 md:w-96 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white/40 bg-white/10">
            <Image
              src={HERO_IMAGE}
              alt="신선한 샐러드 특가 이미지"
              fill
              sizes="(max-width: 768px) 280px, 384px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

