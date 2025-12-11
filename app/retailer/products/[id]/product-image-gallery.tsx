/**
 * @file product-image-gallery.tsx
 * @description 상품 상세 페이지의 이미지 갤러리 (대표 + 썸네일)
 *
 * 주요 기능:
 * 1. 대표 이미지를 크게 표시하고, 하단 썸네일로 모든 이미지를 노출
 * 2. 썸네일 클릭 시 대표 이미지 전환
 * 3. 다크모드 대응 색상 쌍 적용
 *
 * @dependencies
 * - next/image
 * - @/lib/utils (cn)
 */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  mainImage?: string | null;
  thumbnails: string[];
  productName: string;
}

export default function ProductImageGallery({ mainImage, thumbnails, productName }: ProductImageGalleryProps) {
  const safeThumbnails = thumbnails.filter(Boolean);
  const [displayedMain, setDisplayedMain] = useState<string | undefined>(mainImage ?? safeThumbnails[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  // mainImage가 늦게 도착하는 경우 대응
  useEffect(() => {
    if (mainImage) {
      setDisplayedMain(mainImage);
      setActiveIndex(0);
    }
  }, [mainImage]);

  console.log("🖼️ [product-image-gallery] 이미지 변경", {
    activeIndex,
    image: displayedMain,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-200">
        {displayedMain ? (
          <Image
            src={displayedMain}
            alt={`${productName} 대표 이미지`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            이미지 없음
          </div>
        )}
      </div>

      {safeThumbnails.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {safeThumbnails.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                setDisplayedMain(src);
              }}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition-colors duration-200",
                activeIndex === idx
                  ? "border-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]"
                  : "border-gray-200 dark:border-gray-800"
              )}
              aria-label={`이미지 ${idx + 1} 보기`}
            >
              <Image
                src={src}
                alt={`${productName} 썸네일 ${idx + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

