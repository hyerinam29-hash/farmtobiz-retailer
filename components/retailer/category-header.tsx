/**
 * @file components/retailer/category-header.tsx
 * @description 카테고리 헤더 컴포넌트
 *
 * 카테고리명과 이모지를 표시하는 헤더 섹션입니다.
 * 카테고리별로 다른 배경색과 이모지를 사용합니다.
 *
 * 주요 기능:
 * 1. 카테고리명 표시
 * 2. 카테고리별 이모지 표시
 * 3. 카테고리별 배경색 적용 (과일: 오렌지 배경)
 *
 * @dependencies
 * - 카테고리명 prop
 */

interface CategoryHeaderProps {
  /** 카테고리명 (예: "과일", "채소") */
  category: string;
}

/**
 * 카테고리별 이모지 매핑
 */
const categoryEmojis: Record<string, string> = {
  과일: "🍎",
  채소: "🥬",
  수산물: "🐟",
  곡물: "🌾",
  "곡물/견과": "🌾",
  견과류: "🥜",
  기타: "📦",
};

/**
 * 카테고리별 배경색 매핑
 */
const categoryBgColors: Record<string, string> = {
  과일: "bg-orange-50",
  채소: "bg-green-50",
  수산물: "bg-blue-50",
  곡물: "bg-amber-50",
  "곡물/견과": "bg-amber-50",
  견과류: "bg-amber-50",
  기타: "bg-gray-50",
};

/**
 * 카테고리 헤더 컴포넌트
 */
export default function CategoryHeader({ category }: CategoryHeaderProps) {
  const emoji = categoryEmojis[category] || categoryEmojis["기타"];
  const bgColor = categoryBgColors[category] || categoryBgColors["기타"];

  return (
    <div className={`${bgColor} rounded-xl p-6 md:p-8 mb-8`}>
      <div className="flex items-center gap-3">
        <span className="text-4xl md:text-5xl">{emoji}</span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {category}
        </h1>
      </div>
    </div>
  );
}


