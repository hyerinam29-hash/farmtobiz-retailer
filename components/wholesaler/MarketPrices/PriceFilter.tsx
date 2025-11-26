/**
 * @file components/wholesaler/MarketPrices/PriceFilter.tsx
 * @description 시세 검색 필터 컴포넌트
 *
 * 시세 조회를 위한 필터 컴포넌트입니다.
 * 확정일자, 대분류/중분류/소분류 코드를 선택하여 시세를 조회할 수 있습니다.
 *
 * 주요 기능:
 * 1. 확정일자 선택
 * 2. 대분류/중분류/소분류 선택
 * 3. 인기 품목 빠른 검색 버튼
 * 4. Enter 키로 검색 실행
 *
 * @dependencies
 * - components/ui/input, select, button
 * - lib/api/market-prices (itemCategories)
 * - date-fns (날짜 포맷팅)
 */

"use client";

import { useState, FormEvent } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { itemCategories } from "@/lib/api/market-prices";

export interface PriceFilterParams {
  date?: string; // YYYY-MM-DD 형식
  lclsfCd?: string; // 대분류 코드
  mclsfCd?: string; // 중분류 코드
  sclsfCd?: string; // 소분류 코드
}

interface PriceFilterProps {
  onSearch: (params: PriceFilterParams) => void;
  isLoading?: boolean;
}

export default function PriceFilter({ onSearch, isLoading = false }: PriceFilterProps) {
  const [date, setDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd", { locale: ko })
  );
  const [lclsfCd, setLclsfCd] = useState<string | undefined>(undefined);
  const [mclsfCd, setMclsfCd] = useState<string | undefined>(undefined);
  const [sclsfCd, setSclsfCd] = useState<string | undefined>(undefined);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const params: PriceFilterParams = {};
    if (date) params.date = date;
    // "all" 값은 API 파라미터에서 제외
    if (lclsfCd && lclsfCd !== "all") params.lclsfCd = lclsfCd;
    if (mclsfCd && mclsfCd !== "all") params.mclsfCd = mclsfCd;
    if (sclsfCd && sclsfCd !== "all") params.sclsfCd = sclsfCd;

    onSearch(params);
  };

  const handleQuickSearch = (categoryKey: keyof typeof itemCategories) => {
    const category = itemCategories[categoryKey];
    setLclsfCd(category.code);
    setMclsfCd(undefined);
    setSclsfCd(undefined);

    const params: PriceFilterParams = {
      date: date || format(new Date(), "yyyy-MM-dd", { locale: ko }),
      lclsfCd: category.code,
    };
    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 md:p-8">
      <div className="flex flex-col gap-4">
        {/* 확정일자 선택 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="text-sm font-medium">
            확정일자
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10"
              max={format(new Date(), "yyyy-MM-dd", { locale: ko })}
            />
          </div>
        </div>

        {/* 대분류 선택 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="lclsf" className="text-sm font-medium">
            대분류
          </label>
          <Select value={lclsfCd || "all"} onValueChange={(value) => setLclsfCd(value === "all" ? undefined : value)}>
            <SelectTrigger id="lclsf">
              <SelectValue placeholder="대분류를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {Object.entries(itemCategories).map(([key, category]) => (
                <SelectItem key={key} value={category.code}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 중분류 선택 (대분류 선택 시에만 활성화) */}
        {lclsfCd && (
          <div className="flex flex-col gap-2">
            <label htmlFor="mclsf" className="text-sm font-medium">
              중분류
            </label>
            <Select value={mclsfCd || "all"} onValueChange={(value) => setMclsfCd(value === "all" ? undefined : value)}>
              <SelectTrigger id="mclsf">
                <SelectValue placeholder="중분류를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {/* 실제 API 응답 구조 확인 후 중분류 목록 추가 필요 */}
                <SelectItem value="0101">예시: 배추</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 소분류 선택 (중분류 선택 시에만 활성화) */}
        {mclsfCd && (
          <div className="flex flex-col gap-2">
            <label htmlFor="sclsf" className="text-sm font-medium">
              소분류
            </label>
            <Select value={sclsfCd || "all"} onValueChange={(value) => setSclsfCd(value === "all" ? undefined : value)}>
              <SelectTrigger id="sclsf">
                <SelectValue placeholder="소분류를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {/* 실제 API 응답 구조 확인 후 소분류 목록 추가 필요 */}
                <SelectItem value="010101">예시: 배추 상품</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 조회 버튼 */}
        <Button type="submit" disabled={isLoading} className="w-full">
          <Search className="mr-2 size-4" />
          {isLoading ? "조회 중..." : "조회"}
        </Button>
      </div>

      {/* 인기 품목 빠른 검색 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">인기 품목 빠른 검색</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(itemCategories).map((key) => (
            <Button
              key={key}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch(key as keyof typeof itemCategories)}
              disabled={isLoading}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>
    </form>
  );
}

