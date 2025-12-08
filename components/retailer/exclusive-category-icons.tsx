/**
 * @file components/retailer/exclusive-category-icons.tsx
 * @description 단독관 카테고리 아이콘 메뉴 컴포넌트
 *
 * 단독관 페이지에서 사용되는 6개의 카테고리 아이콘 메뉴입니다.
 * 디자인 핸드오프 이미지 기반으로 구현되었습니다.
 */

import { RotateCw, BadgePercent, Trophy, Truck, Star, Package } from "lucide-react";

interface CategoryIcon {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  bgColor: string;
  iconColor: string;
}

const categories: CategoryIcon[] = [
  {
    icon: RotateCw,
    label: "재구매많은",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: BadgePercent,
    label: "단독특가",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    icon: Trophy,
    label: "베스트랭킹",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Truck,
    label: "산지직송",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: Star,
    label: "리뷰좋은",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Package,
    label: "대용량",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

export default function ExclusiveCategoryIcons() {
  return (
    <div className="flex justify-center gap-8 mb-16 overflow-x-auto py-4">
      {categories.map((category, index) => {
        const Icon = category.icon;
        return (
          <div
            key={index}
            className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px]"
          >
            <div
              className={`w-20 h-20 rounded-full ${category.bgColor} ${category.iconColor} flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform duration-300 border-4 border-white ring-1 ring-gray-100`}
            >
              <Icon size={32} />
            </div>
            <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900">
              {category.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

